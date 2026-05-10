-- =============================================================================
-- Backend Supabase — tablas docentes, solicitudes, evaluaciones, alumnos + RLS
-- =============================================================================
-- INSTRUCCIONES:
-- 1. Reemplazá __ADMIN_EMAIL__ por tu correo (el mismo que usás con Google), ej:
--    ricardo@ejemplo.edu.ar
-- 2. Pegá TODO este archivo en Supabase → SQL Editor → Run.
-- 3. Si ya ejecutaste migraciones viejas, este script usa IF NOT EXISTS / ALTER
--    para sumar columnas nuevas sin romper lo existente.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) Tabla docentes
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.docentes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  email text NOT NULL,
  nombre text,
  apellido text,
  activo boolean NOT NULL DEFAULT true,
  rol text NOT NULL DEFAULT 'docente',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT docentes_email_unique UNIQUE (email),
  CONSTRAINT docentes_rol_check CHECK (rol IN ('docente', 'admin'))
);

ALTER TABLE public.docentes
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL;
ALTER TABLE public.docentes
  ADD COLUMN IF NOT EXISTS nombre text;
ALTER TABLE public.docentes
  ADD COLUMN IF NOT EXISTS apellido text;
ALTER TABLE public.docentes
  ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true;
ALTER TABLE public.docentes
  ADD COLUMN IF NOT EXISTS rol text NOT NULL DEFAULT 'docente';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'docentes_rol_check' AND conrelid = 'public.docentes'::regclass
  ) THEN
    ALTER TABLE public.docentes
      ADD CONSTRAINT docentes_rol_check CHECK (rol IN ('docente', 'admin'));
  END IF;
END $$;

COMMENT ON COLUMN public.docentes.activo IS 'Si false, el docente no debería acceder (revocado).';
COMMENT ON COLUMN public.docentes.rol IS 'admin: panel de gestión docentes; docente: uso normal.';

CREATE INDEX IF NOT EXISTS docentes_email_lower_idx ON public.docentes (lower(email));

-- -----------------------------------------------------------------------------
-- 2) Tabla solicitudes_docentes
--    (created_at = fecha de solicitud; reviewed_at = fecha de respuesta)
-- -----------------------------------------------------------------------------
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

ALTER TABLE public.solicitudes_docentes
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL;
ALTER TABLE public.solicitudes_docentes
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;
ALTER TABLE public.solicitudes_docentes
  ADD COLUMN IF NOT EXISTS reviewed_by_email text;
ALTER TABLE public.solicitudes_docentes
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

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

-- -----------------------------------------------------------------------------
-- 3) Tabla evaluaciones
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.evaluaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  docente_id uuid NOT NULL REFERENCES public.docentes (id) ON DELETE CASCADE,
  materia text NOT NULL DEFAULT '',
  curso text NOT NULL DEFAULT '',
  division text NOT NULL DEFAULT '',
  turno text,
  fecha date,
  datos_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS evaluaciones_docente_id_idx ON public.evaluaciones (docente_id);

COMMENT ON TABLE public.evaluaciones IS 'Evaluaciones del docente; payload flexible en datos_json.';

-- -----------------------------------------------------------------------------
-- 4) Tabla alumnos (resultados / inscriptos por evaluación)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.alumnos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluacion_id uuid NOT NULL REFERENCES public.evaluaciones (id) ON DELETE CASCADE,
  nombre text NOT NULL,
  nota numeric(5, 2),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS alumnos_evaluacion_id_idx ON public.alumnos (evaluacion_id);

-- -----------------------------------------------------------------------------
-- 5) is_admin() — por fila en docentes con rol admin y activo
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.docentes d
    WHERE lower(trim(d.email)) = lower(trim(COALESCE(auth.jwt() ->> 'email', '')))
      AND d.activo = true
      AND d.rol = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- 6) Helper: id del docente actual (por email)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_docente_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT d.id
  FROM public.docentes d
  WHERE lower(trim(d.email)) = lower(trim(COALESCE(auth.jwt() ->> 'email', '')))
    AND d.activo = true
  LIMIT 1;
$$;

-- -----------------------------------------------------------------------------
-- 7) RPC: crear / reactivar solicitud (cualquier usuario autenticado la ejecuta)
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 8) RPC: aprobar / rechazar / revocar (solo admin)
-- -----------------------------------------------------------------------------
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
    INSERT INTO public.docentes (email, nombre, apellido, user_id, activo, rol)
    VALUES (
      lower(trim(s.email)),
      trim(substring(v_full FROM 1 FOR space_idx - 1)),
      trim(substring(v_full FROM space_idx + 1)),
      s.user_id,
      true,
      'docente'
    )
    ON CONFLICT (email) DO UPDATE SET
      nombre = EXCLUDED.nombre,
      apellido = EXCLUDED.apellido,
      user_id = COALESCE(EXCLUDED.user_id, public.docentes.user_id),
      activo = true,
      rol = CASE WHEN public.docentes.rol = 'admin' THEN 'admin' ELSE 'docente' END;
  ELSE
    INSERT INTO public.docentes (email, nombre, apellido, user_id, activo, rol)
    VALUES (lower(trim(s.email)), v_full, NULL, s.user_id, true, 'docente')
    ON CONFLICT (email) DO UPDATE SET
      nombre = EXCLUDED.nombre,
      apellido = EXCLUDED.apellido,
      user_id = COALESCE(EXCLUDED.user_id, public.docentes.user_id),
      activo = true,
      rol = CASE WHEN public.docentes.rol = 'admin' THEN 'admin' ELSE 'docente' END;
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

  IF EXISTS (
    SELECT 1 FROM public.docentes d
    WHERE d.id = p_docente_id AND d.rol = 'admin' AND d.activo = true
  ) THEN
    RAISE EXCEPTION 'cannot revoke admin docente';
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

-- -----------------------------------------------------------------------------
-- 9) RLS
-- -----------------------------------------------------------------------------
ALTER TABLE public.docentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes_docentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumnos ENABLE ROW LEVEL SECURITY;

-- Docentes: lectura propia o admin; escritura solo admin (altas vía RPC approve)
DROP POLICY IF EXISTS docentes_select_own_or_admin ON public.docentes;
CREATE POLICY docentes_select_own_or_admin
  ON public.docentes
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR lower(email) = lower(trim(COALESCE((SELECT auth.jwt() ->> 'email'), '')))
  );

DROP POLICY IF EXISTS docentes_insert_admin ON public.docentes;
CREATE POLICY docentes_insert_admin
  ON public.docentes
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS docentes_update_admin ON public.docentes;
CREATE POLICY docentes_update_admin
  ON public.docentes
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS docentes_delete_admin ON public.docentes;
CREATE POLICY docentes_delete_admin
  ON public.docentes
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Solicitudes: lectura propia o admin; insert directo usuario autenticado (email = JWT)
DROP POLICY IF EXISTS solicitudes_select_own_or_admin ON public.solicitudes_docentes;
CREATE POLICY solicitudes_select_own_or_admin
  ON public.solicitudes_docentes
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR lower(email) = lower(trim(COALESCE((SELECT auth.jwt() ->> 'email'), '')))
  );

DROP POLICY IF EXISTS solicitudes_insert_authenticated ON public.solicitudes_docentes;
CREATE POLICY solicitudes_insert_authenticated
  ON public.solicitudes_docentes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    lower(trim(email)) = lower(trim(COALESCE(auth.jwt() ->> 'email', '')))
  );

DROP POLICY IF EXISTS solicitudes_update_admin ON public.solicitudes_docentes;
CREATE POLICY solicitudes_update_admin
  ON public.solicitudes_docentes
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS solicitudes_delete_admin ON public.solicitudes_docentes;
CREATE POLICY solicitudes_delete_admin
  ON public.solicitudes_docentes
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Evaluaciones: docente dueño o admin
DROP POLICY IF EXISTS evaluaciones_select ON public.evaluaciones;
CREATE POLICY evaluaciones_select
  ON public.evaluaciones
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR docente_id = public.current_docente_id()
  );

DROP POLICY IF EXISTS evaluaciones_insert ON public.evaluaciones;
CREATE POLICY evaluaciones_insert
  ON public.evaluaciones
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin()
    OR docente_id = public.current_docente_id()
  );

DROP POLICY IF EXISTS evaluaciones_update ON public.evaluaciones;
CREATE POLICY evaluaciones_update
  ON public.evaluaciones
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
    OR docente_id = public.current_docente_id()
  )
  WITH CHECK (
    public.is_admin()
    OR docente_id = public.current_docente_id()
  );

DROP POLICY IF EXISTS evaluaciones_delete ON public.evaluaciones;
CREATE POLICY evaluaciones_delete
  ON public.evaluaciones
  FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
    OR docente_id = public.current_docente_id()
  );

-- Alumnos: según evaluación del docente
DROP POLICY IF EXISTS alumnos_select ON public.alumnos;
CREATE POLICY alumnos_select
  ON public.alumnos
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.evaluaciones e
      WHERE e.id = alumnos.evaluacion_id
        AND e.docente_id = public.current_docente_id()
    )
  );

DROP POLICY IF EXISTS alumnos_insert ON public.alumnos;
CREATE POLICY alumnos_insert
  ON public.alumnos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.evaluaciones e
      WHERE e.id = alumnos.evaluacion_id
        AND e.docente_id = public.current_docente_id()
    )
  );

DROP POLICY IF EXISTS alumnos_update ON public.alumnos;
CREATE POLICY alumnos_update
  ON public.alumnos
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.evaluaciones e
      WHERE e.id = alumnos.evaluacion_id
        AND e.docente_id = public.current_docente_id()
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.evaluaciones e
      WHERE e.id = alumnos.evaluacion_id
        AND e.docente_id = public.current_docente_id()
    )
  );

DROP POLICY IF EXISTS alumnos_delete ON public.alumnos;
CREATE POLICY alumnos_delete
  ON public.alumnos
  FOR DELETE
  TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.evaluaciones e
      WHERE e.id = alumnos.evaluacion_id
        AND e.docente_id = public.current_docente_id()
    )
  );

-- -----------------------------------------------------------------------------
-- 10) Grants
-- -----------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON public.docentes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.solicitudes_docentes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.evaluaciones TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alumnos TO authenticated;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_docente_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_docente_solicitud(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_approve_solicitud(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_reject_solicitud(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_revoke_docente(uuid) TO authenticated;

-- -----------------------------------------------------------------------------
-- 11) Admin inicial (reemplazá el email antes de ejecutar)
-- -----------------------------------------------------------------------------
INSERT INTO public.docentes (email, nombre, apellido, activo, rol)
VALUES (
  lower(trim('__ADMIN_EMAIL__')),
  'Administrador',
  'Sistema',
  true,
  'admin'
)
ON CONFLICT (email) DO UPDATE SET
  activo = true,
  rol = 'admin',
  nombre = EXCLUDED.nombre,
  apellido = EXCLUDED.apellido;
