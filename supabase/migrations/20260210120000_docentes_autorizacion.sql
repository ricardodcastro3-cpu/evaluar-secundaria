-- Autorización de docentes + panel admin
--
-- 1) SQL Editor (una vez):
--    UPDATE public.admin_config SET admin_email = 'tu-email-real@dominio.com' WHERE id = 1;
--    Opcional: insertá tu usuario en docentes si también dictás:
--    INSERT INTO public.docentes (email, nombre, apellido) VALUES ('tu-email@...','Nombre','Apellido')
--    ON CONFLICT (email) DO NOTHING;
--
-- 2) Supabase → Authentication → URL Configuration → Redirect URLs, agregar:
--    https://TU-DOMINIO/login
--    https://TU-DOMINIO/alumno/login
--    (y http://localhost:5173/login y .../alumno/login para desarrollo)
--
-- 3) Opcional: Database Webhook sobre INSERT en solicitudes_docentes (email/Slack).

-- ---------------------------------------------------------------------------
-- Config administrador (única fuente de verdad para RLS)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_config (
  id int PRIMARY KEY CHECK (id = 1),
  admin_email text NOT NULL
);

INSERT INTO public.admin_config (id, admin_email)
VALUES (1, 'admin@cambiame.edu.ar')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;

-- Sin políticas: solo el rol de servicio y funciones SECURITY DEFINER acceden

-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.docentes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  email text NOT NULL,
  nombre text,
  apellido text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT docentes_email_unique UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public.solicitudes_docentes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  email text NOT NULL,
  nombre text NOT NULL DEFAULT '',
  estado text NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by_email text,
  CONSTRAINT solicitudes_docentes_email_unique UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS solicitudes_docentes_estado_idx
  ON public.solicitudes_docentes (estado);

CREATE OR REPLACE FUNCTION public.set_solicitudes_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_solicitudes_docentes_updated ON public.solicitudes_docentes;
CREATE TRIGGER tr_solicitudes_docentes_updated
  BEFORE UPDATE ON public.solicitudes_docentes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_solicitudes_updated_at();

-- ---------------------------------------------------------------------------
-- is_admin(): compara JWT con admin_config (SECURITY DEFINER)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_config ac
    WHERE ac.id = 1
      AND lower(trim(ac.admin_email)) = lower(trim(COALESCE(auth.jwt() ->> 'email', '')))
  );
$$;

REVOKE ALL ON TABLE public.admin_config FROM PUBLIC;

-- ---------------------------------------------------------------------------
-- Crear / reactivar solicitud (docente nuevo o rechazado que vuelve a pedir)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_docente_solicitud(p_nombre text)
RETURNS public.solicitudes_docentes
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text := lower(trim(auth.jwt() ->> 'email'));
  v_uid uuid := auth.uid();
  r public.solicitudes_docentes%ROWTYPE;
  v_nom text;
BEGIN
  IF v_email IS NULL OR v_email = '' OR v_uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  v_nom := COALESCE(NULLIF(trim(p_nombre), ''), 'Docente');

  SELECT * INTO r FROM public.solicitudes_docentes WHERE lower(email) = v_email;

  IF FOUND THEN
    IF r.estado = 'pendiente' THEN
      UPDATE public.solicitudes_docentes
      SET nombre = v_nom, user_id = v_uid
      WHERE id = r.id
      RETURNING * INTO r;
      RETURN r;
    ELSIF r.estado = 'aprobado' THEN
      RETURN r;
    ELSIF r.estado = 'rechazado' THEN
      UPDATE public.solicitudes_docentes SET
        estado = 'pendiente',
        nombre = v_nom,
        user_id = v_uid,
        reviewed_at = NULL,
        reviewed_by_email = NULL,
        updated_at = now()
      WHERE id = r.id
      RETURNING * INTO r;
      RETURN r;
    END IF;
  END IF;

  INSERT INTO public.solicitudes_docentes (email, nombre, user_id, estado)
  VALUES (v_email, v_nom, v_uid, 'pendiente')
  RETURNING * INTO r;
  RETURN r;
END;
$$;

-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_approve_solicitud(p_solicitud_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  s public.solicitudes_docentes%ROWTYPE;
  v_full text;
  space_idx int;
  admin_em text := auth.jwt() ->> 'email';
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT * INTO s FROM public.solicitudes_docentes WHERE id = p_solicitud_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'solicitud not found';
  END IF;
  IF s.estado IS DISTINCT FROM 'pendiente' THEN
    RAISE EXCEPTION 'invalid estado';
  END IF;

  v_full := trim(s.nombre);
  space_idx := position(' ' IN v_full);

  IF space_idx > 0 THEN
    INSERT INTO public.docentes (email, nombre, apellido, user_id)
    VALUES (
      lower(trim(s.email)),
      trim(substring(v_full FROM 1 FOR space_idx - 1)),
      trim(substring(v_full FROM space_idx + 1)),
      s.user_id
    )
    ON CONFLICT (email) DO UPDATE SET
      nombre = EXCLUDED.nombre,
      apellido = EXCLUDED.apellido,
      user_id = COALESCE(EXCLUDED.user_id, public.docentes.user_id);
  ELSE
    INSERT INTO public.docentes (email, nombre, apellido, user_id)
    VALUES (lower(trim(s.email)), v_full, NULL, s.user_id)
    ON CONFLICT (email) DO UPDATE SET
      nombre = EXCLUDED.nombre,
      apellido = EXCLUDED.apellido,
      user_id = COALESCE(EXCLUDED.user_id, public.docentes.user_id);
  END IF;

  UPDATE public.solicitudes_docentes SET
    estado = 'aprobado',
    reviewed_at = now(),
    reviewed_by_email = admin_em
  WHERE id = p_solicitud_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_reject_solicitud(p_solicitud_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_em text := auth.jwt() ->> 'email';
  n int;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  UPDATE public.solicitudes_docentes SET
    estado = 'rechazado',
    reviewed_at = now(),
    reviewed_by_email = admin_em
  WHERE id = p_solicitud_id
    AND estado = 'pendiente';

  GET DIAGNOSTICS n = ROW_COUNT;
  IF n = 0 THEN
    RAISE EXCEPTION 'solicitud not found or not pending';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_revoke_docente(p_docente_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n int;
  em text;
  admin_em text := auth.jwt() ->> 'email';
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT d.email INTO em FROM public.docentes d WHERE d.id = p_docente_id;
  IF em IS NULL THEN
    RAISE EXCEPTION 'docente not found';
  END IF;

  DELETE FROM public.docentes WHERE id = p_docente_id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n = 0 THEN
    RAISE EXCEPTION 'docente not found';
  END IF;

  UPDATE public.solicitudes_docentes SET
    estado = 'rechazado',
    reviewed_at = now(),
    reviewed_by_email = admin_em
  WHERE lower(email) = lower(trim(em));
END;
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.docentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes_docentes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS docentes_select_own_or_admin ON public.docentes;
CREATE POLICY docentes_select_own_or_admin
  ON public.docentes
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR lower(email) = lower(trim(COALESCE((SELECT auth.jwt() ->> 'email'), '')))
  );

-- Los docentes no insertan/actualizan filas directamente (solo RPC admin + approve)

DROP POLICY IF EXISTS solicitudes_select_own_or_admin ON public.solicitudes_docentes;
CREATE POLICY solicitudes_select_own_or_admin
  ON public.solicitudes_docentes
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR lower(email) = lower(trim(COALESCE((SELECT auth.jwt() ->> 'email'), '')))
  );

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
GRANT SELECT ON TABLE public.docentes TO authenticated;
GRANT SELECT ON TABLE public.solicitudes_docentes TO authenticated;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_docente_solicitud(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_approve_solicitud(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_reject_solicitud(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_revoke_docente(uuid) TO authenticated;
