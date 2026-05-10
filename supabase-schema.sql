-- EvalAr Secundaria - esquema inicial Supabase
-- Pegar completo en Supabase SQL Editor.

create extension if not exists "pgcrypto";

-- =========================
-- TABLAS
-- =========================

create table if not exists public.docentes (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null,
  email text not null unique,
  escuela text,
  created_at timestamptz not null default now()
);

create table if not exists public.evaluaciones (
  id uuid primary key default gen_random_uuid(),
  docente_id uuid not null references public.docentes (id) on delete cascade,
  titulo text not null,
  materia text not null,
  curso text not null,
  division text not null,
  turno text not null check (turno in ('manana', 'tarde', 'noche')),
  fecha date not null,
  duracion_min int not null check (duracion_min > 0),
  objetivos text,
  puntaje_total int not null default 100 check (puntaje_total > 0),
  criterios jsonb not null default '[]'::jsonb,
  archivo_url text,
  estado text not null default 'borrador' check (estado in ('borrador', 'activa', 'finalizada')),
  created_at timestamptz not null default now()
);

create table if not exists public.versiones (
  id uuid primary key default gen_random_uuid(),
  evaluacion_id uuid not null references public.evaluaciones (id) on delete cascade,
  numero_version int not null check (numero_version > 0),
  items_eval jsonb not null default '[]'::jsonb,
  items_fasttrack jsonb not null default '[]'::jsonb,
  unique (evaluacion_id, numero_version)
);

create table if not exists public.alumnos_eval (
  id uuid primary key default gen_random_uuid(),
  evaluacion_id uuid not null references public.evaluaciones (id) on delete cascade,
  nombre text not null,
  apellido text not null,
  dni text not null,
  email text,
  division text not null,
  version_asignada int not null default 1 check (version_asignada > 0),
  token_unico uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  unique (evaluacion_id, dni),
  unique (token_unico)
);

create table if not exists public.sesiones (
  id uuid primary key default gen_random_uuid(),
  alumno_eval_id uuid not null references public.alumnos_eval (id) on delete cascade,
  tipo text not null check (tipo in ('fasttrack', 'formal')),
  inicio timestamptz not null default now(),
  fin timestamptz,
  puntaje int,
  estado text not null default 'iniciada' check (estado in ('iniciada', 'finalizada', 'cancelada')),
  log_actividad jsonb not null default '[]'::jsonb
);

create table if not exists public.respuestas (
  id uuid primary key default gen_random_uuid(),
  sesion_id uuid not null references public.sesiones (id) on delete cascade,
  item_id uuid not null,
  respuesta_dada text,
  puntaje_obtenido int not null default 0 check (puntaje_obtenido >= 0),
  justificacion text
);

-- =========================
-- INDICES
-- =========================

create index if not exists evaluaciones_docente_id_idx on public.evaluaciones (docente_id);
create index if not exists versiones_evaluacion_id_idx on public.versiones (evaluacion_id);
create index if not exists alumnos_eval_evaluacion_id_idx on public.alumnos_eval (evaluacion_id);
create index if not exists alumnos_eval_token_unico_idx on public.alumnos_eval (token_unico);
create index if not exists sesiones_alumno_eval_id_idx on public.sesiones (alumno_eval_id);
create index if not exists respuestas_sesion_id_idx on public.respuestas (sesion_id);

-- =========================
-- ROW LEVEL SECURITY
-- =========================

alter table public.docentes enable row level security;
alter table public.evaluaciones enable row level security;
alter table public.versiones enable row level security;
alter table public.alumnos_eval enable row level security;
alter table public.sesiones enable row level security;
alter table public.respuestas enable row level security;

-- DOCENTES

drop policy if exists "docentes_select_own" on public.docentes;
create policy "docentes_select_own"
on public.docentes
for select
to authenticated
using (id = auth.uid());

drop policy if exists "docentes_insert_own" on public.docentes;
create policy "docentes_insert_own"
on public.docentes
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "docentes_update_own" on public.docentes;
create policy "docentes_update_own"
on public.docentes
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- EVALUACIONES

drop policy if exists "evaluaciones_select_own" on public.evaluaciones;
create policy "evaluaciones_select_own"
on public.evaluaciones
for select
to authenticated
using (docente_id = auth.uid());

drop policy if exists "evaluaciones_insert_own" on public.evaluaciones;
create policy "evaluaciones_insert_own"
on public.evaluaciones
for insert
to authenticated
with check (docente_id = auth.uid());

drop policy if exists "evaluaciones_update_own" on public.evaluaciones;
create policy "evaluaciones_update_own"
on public.evaluaciones
for update
to authenticated
using (docente_id = auth.uid())
with check (docente_id = auth.uid());

drop policy if exists "evaluaciones_delete_own" on public.evaluaciones;
create policy "evaluaciones_delete_own"
on public.evaluaciones
for delete
to authenticated
using (docente_id = auth.uid());

-- VERSIONES

drop policy if exists "versiones_select_by_docente" on public.versiones;
create policy "versiones_select_by_docente"
on public.versiones
for select
to authenticated
using (
  exists (
    select 1
    from public.evaluaciones e
    where e.id = versiones.evaluacion_id
      and e.docente_id = auth.uid()
  )
);

drop policy if exists "versiones_insert_by_docente" on public.versiones;
create policy "versiones_insert_by_docente"
on public.versiones
for insert
to authenticated
with check (
  exists (
    select 1
    from public.evaluaciones e
    where e.id = versiones.evaluacion_id
      and e.docente_id = auth.uid()
  )
);

drop policy if exists "versiones_update_by_docente" on public.versiones;
create policy "versiones_update_by_docente"
on public.versiones
for update
to authenticated
using (
  exists (
    select 1
    from public.evaluaciones e
    where e.id = versiones.evaluacion_id
      and e.docente_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.evaluaciones e
    where e.id = versiones.evaluacion_id
      and e.docente_id = auth.uid()
  )
);

drop policy if exists "versiones_delete_by_docente" on public.versiones;
create policy "versiones_delete_by_docente"
on public.versiones
for delete
to authenticated
using (
  exists (
    select 1
    from public.evaluaciones e
    where e.id = versiones.evaluacion_id
      and e.docente_id = auth.uid()
  )
);

-- ALUMNOS_EVAL

drop policy if exists "alumnos_eval_select_by_docente" on public.alumnos_eval;
create policy "alumnos_eval_select_by_docente"
on public.alumnos_eval
for select
to authenticated
using (
  exists (
    select 1
    from public.evaluaciones e
    where e.id = alumnos_eval.evaluacion_id
      and e.docente_id = auth.uid()
  )
);

drop policy if exists "alumnos_eval_insert_by_docente" on public.alumnos_eval;
create policy "alumnos_eval_insert_by_docente"
on public.alumnos_eval
for insert
to authenticated
with check (
  exists (
    select 1
    from public.evaluaciones e
    where e.id = alumnos_eval.evaluacion_id
      and e.docente_id = auth.uid()
  )
);

drop policy if exists "alumnos_eval_update_by_docente" on public.alumnos_eval;
create policy "alumnos_eval_update_by_docente"
on public.alumnos_eval
for update
to authenticated
using (
  exists (
    select 1
    from public.evaluaciones e
    where e.id = alumnos_eval.evaluacion_id
      and e.docente_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.evaluaciones e
    where e.id = alumnos_eval.evaluacion_id
      and e.docente_id = auth.uid()
  )
);

drop policy if exists "alumnos_eval_delete_by_docente" on public.alumnos_eval;
create policy "alumnos_eval_delete_by_docente"
on public.alumnos_eval
for delete
to authenticated
using (
  exists (
    select 1
    from public.evaluaciones e
    where e.id = alumnos_eval.evaluacion_id
      and e.docente_id = auth.uid()
  )
);

-- SESIONES

drop policy if exists "sesiones_select_by_docente" on public.sesiones;
create policy "sesiones_select_by_docente"
on public.sesiones
for select
to authenticated
using (
  exists (
    select 1
    from public.alumnos_eval ae
    join public.evaluaciones e on e.id = ae.evaluacion_id
    where ae.id = sesiones.alumno_eval_id
      and e.docente_id = auth.uid()
  )
);

drop policy if exists "sesiones_insert_by_docente" on public.sesiones;
create policy "sesiones_insert_by_docente"
on public.sesiones
for insert
to authenticated
with check (
  exists (
    select 1
    from public.alumnos_eval ae
    join public.evaluaciones e on e.id = ae.evaluacion_id
    where ae.id = sesiones.alumno_eval_id
      and e.docente_id = auth.uid()
  )
);

drop policy if exists "sesiones_update_by_docente" on public.sesiones;
create policy "sesiones_update_by_docente"
on public.sesiones
for update
to authenticated
using (
  exists (
    select 1
    from public.alumnos_eval ae
    join public.evaluaciones e on e.id = ae.evaluacion_id
    where ae.id = sesiones.alumno_eval_id
      and e.docente_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.alumnos_eval ae
    join public.evaluaciones e on e.id = ae.evaluacion_id
    where ae.id = sesiones.alumno_eval_id
      and e.docente_id = auth.uid()
  )
);

-- RESPUESTAS

drop policy if exists "respuestas_select_by_docente" on public.respuestas;
create policy "respuestas_select_by_docente"
on public.respuestas
for select
to authenticated
using (
  exists (
    select 1
    from public.sesiones s
    join public.alumnos_eval ae on ae.id = s.alumno_eval_id
    join public.evaluaciones e on e.id = ae.evaluacion_id
    where s.id = respuestas.sesion_id
      and e.docente_id = auth.uid()
  )
);

drop policy if exists "respuestas_insert_by_docente" on public.respuestas;
create policy "respuestas_insert_by_docente"
on public.respuestas
for insert
to authenticated
with check (
  exists (
    select 1
    from public.sesiones s
    join public.alumnos_eval ae on ae.id = s.alumno_eval_id
    join public.evaluaciones e on e.id = ae.evaluacion_id
    where s.id = respuestas.sesion_id
      and e.docente_id = auth.uid()
  )
);

drop policy if exists "respuestas_update_by_docente" on public.respuestas;
create policy "respuestas_update_by_docente"
on public.respuestas
for update
to authenticated
using (
  exists (
    select 1
    from public.sesiones s
    join public.alumnos_eval ae on ae.id = s.alumno_eval_id
    join public.evaluaciones e on e.id = ae.evaluacion_id
    where s.id = respuestas.sesion_id
      and e.docente_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.sesiones s
    join public.alumnos_eval ae on ae.id = s.alumno_eval_id
    join public.evaluaciones e on e.id = ae.evaluacion_id
    where s.id = respuestas.sesion_id
      and e.docente_id = auth.uid()
  )
);

-- Nota:
-- Para accesos publicos por token_unico de alumnos, se recomienda exponer RPCs o Edge Functions
-- que validen el token y operen con SECURITY DEFINER. Las policies anteriores priorizan un RLS
-- seguro para docentes autenticados y evitan exponer alumnos_eval completos al rol anon.
