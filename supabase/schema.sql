-- ============================================================
-- EvalAr Secundaria — Schema completo para Supabase SQL Editor
-- ============================================================
-- Pegar este archivo completo en el SQL Editor de Supabase
-- y ejecutar. Crea tablas, índices y políticas RLS.
-- ============================================================

-- -------------------------------------------------------
-- 1. DOCENTES
-- -------------------------------------------------------
create table if not exists public.docentes (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  email      text not null unique,
  escuela    text,
  created_at timestamptz not null default now()
);

alter table public.docentes enable row level security;

-- Los docentes pueden ver y editar solo su propio registro
create policy "Docentes: lectura propia"
  on public.docentes for select
  using (auth.uid() = id);

create policy "Docentes: inserción propia"
  on public.docentes for insert
  with check (auth.uid() = id);

create policy "Docentes: actualización propia"
  on public.docentes for update
  using (auth.uid() = id);

-- -------------------------------------------------------
-- 2. EVALUACIONES
-- -------------------------------------------------------
create table if not exists public.evaluaciones (
  id             uuid primary key default gen_random_uuid(),
  docente_id     uuid not null references public.docentes(id) on delete cascade,
  titulo         text not null,
  materia        text not null,
  curso          text not null,
  division       text not null,
  turno          text,
  fecha          date,
  duracion_min   int not null default 60,
  objetivos      text,
  puntaje_total  int not null default 100,
  criterios      text,
  archivo_url    text,
  estado         text not null default 'borrador'
                   check (estado in ('borrador','configurada','en_curso','finalizada')),
  created_at     timestamptz not null default now()
);

alter table public.evaluaciones enable row level security;

create index idx_evaluaciones_docente on public.evaluaciones(docente_id);

-- El docente dueño puede hacer CRUD completo
create policy "Evaluaciones: lectura docente"
  on public.evaluaciones for select
  using (auth.uid() = docente_id);

create policy "Evaluaciones: inserción docente"
  on public.evaluaciones for insert
  with check (auth.uid() = docente_id);

create policy "Evaluaciones: actualización docente"
  on public.evaluaciones for update
  using (auth.uid() = docente_id);

create policy "Evaluaciones: eliminación docente"
  on public.evaluaciones for delete
  using (auth.uid() = docente_id);

-- -------------------------------------------------------
-- 3. VERSIONES (items de evaluación y fast track en JSONB)
-- -------------------------------------------------------
create table if not exists public.versiones (
  id               uuid primary key default gen_random_uuid(),
  evaluacion_id    uuid not null references public.evaluaciones(id) on delete cascade,
  numero_version   int not null default 1,
  items_eval       jsonb not null default '[]'::jsonb,
  items_fasttrack  jsonb not null default '[]'::jsonb
);

alter table public.versiones enable row level security;

create index idx_versiones_evaluacion on public.versiones(evaluacion_id);

-- El docente dueño de la evaluación puede gestionar versiones
create policy "Versiones: lectura docente"
  on public.versiones for select
  using (
    exists (
      select 1 from public.evaluaciones e
      where e.id = evaluacion_id and e.docente_id = auth.uid()
    )
  );

create policy "Versiones: inserción docente"
  on public.versiones for insert
  with check (
    exists (
      select 1 from public.evaluaciones e
      where e.id = evaluacion_id and e.docente_id = auth.uid()
    )
  );

create policy "Versiones: actualización docente"
  on public.versiones for update
  using (
    exists (
      select 1 from public.evaluaciones e
      where e.id = evaluacion_id and e.docente_id = auth.uid()
    )
  );

create policy "Versiones: eliminación docente"
  on public.versiones for delete
  using (
    exists (
      select 1 from public.evaluaciones e
      where e.id = evaluacion_id and e.docente_id = auth.uid()
    )
  );

-- -------------------------------------------------------
-- 4. ALUMNOS_EVAL (alumnos asignados a una evaluación)
-- -------------------------------------------------------
create table if not exists public.alumnos_eval (
  id                uuid primary key default gen_random_uuid(),
  evaluacion_id     uuid not null references public.evaluaciones(id) on delete cascade,
  nombre            text not null,
  apellido          text not null,
  dni               text,
  email             text,
  division          text,
  version_asignada  uuid references public.versiones(id),
  token_unico       text not null unique default encode(gen_random_bytes(24), 'hex'),
  created_at        timestamptz not null default now()
);

alter table public.alumnos_eval enable row level security;

create index idx_alumnos_eval_evaluacion on public.alumnos_eval(evaluacion_id);
create index idx_alumnos_eval_token on public.alumnos_eval(token_unico);

-- El docente dueño puede gestionar alumnos
create policy "Alumnos_eval: lectura docente"
  on public.alumnos_eval for select
  using (
    exists (
      select 1 from public.evaluaciones e
      where e.id = evaluacion_id and e.docente_id = auth.uid()
    )
  );

create policy "Alumnos_eval: inserción docente"
  on public.alumnos_eval for insert
  with check (
    exists (
      select 1 from public.evaluaciones e
      where e.id = evaluacion_id and e.docente_id = auth.uid()
    )
  );

create policy "Alumnos_eval: actualización docente"
  on public.alumnos_eval for update
  using (
    exists (
      select 1 from public.evaluaciones e
      where e.id = evaluacion_id and e.docente_id = auth.uid()
    )
  );

create policy "Alumnos_eval: eliminación docente"
  on public.alumnos_eval for delete
  using (
    exists (
      select 1 from public.evaluaciones e
      where e.id = evaluacion_id and e.docente_id = auth.uid()
    )
  );

-- Acceso anónimo por token (para que el alumno pueda ver sus datos)
create policy "Alumnos_eval: lectura por token anon"
  on public.alumnos_eval for select
  using (true);

-- -------------------------------------------------------
-- 5. SESIONES (cada intento de fast track o evaluación formal)
-- -------------------------------------------------------
create table if not exists public.sesiones (
  id              uuid primary key default gen_random_uuid(),
  alumno_eval_id  uuid not null references public.alumnos_eval(id) on delete cascade,
  tipo            text not null check (tipo in ('fasttrack','formal')),
  inicio          timestamptz not null default now(),
  fin             timestamptz,
  puntaje         int,
  estado          text not null default 'en_curso'
                    check (estado in ('en_curso','finalizada','abandonada','tiempo_agotado')),
  log_actividad   jsonb not null default '[]'::jsonb
);

alter table public.sesiones enable row level security;

create index idx_sesiones_alumno on public.sesiones(alumno_eval_id);

-- El docente dueño puede leer sesiones de sus evaluaciones
create policy "Sesiones: lectura docente"
  on public.sesiones for select
  using (
    exists (
      select 1 from public.alumnos_eval ae
      join public.evaluaciones e on e.id = ae.evaluacion_id
      where ae.id = alumno_eval_id and e.docente_id = auth.uid()
    )
  );

-- Acceso anónimo para lectura/escritura (alumno usa token, no auth)
create policy "Sesiones: acceso anon"
  on public.sesiones for all
  using (true)
  with check (true);

-- -------------------------------------------------------
-- 6. RESPUESTAS
-- -------------------------------------------------------
create table if not exists public.respuestas (
  id                uuid primary key default gen_random_uuid(),
  sesion_id         uuid not null references public.sesiones(id) on delete cascade,
  item_id           uuid not null,
  respuesta_dada    text,
  puntaje_obtenido  int not null default 0,
  justificacion     text
);

alter table public.respuestas enable row level security;

create index idx_respuestas_sesion on public.respuestas(sesion_id);

-- El docente dueño puede leer respuestas
create policy "Respuestas: lectura docente"
  on public.respuestas for select
  using (
    exists (
      select 1 from public.sesiones s
      join public.alumnos_eval ae on ae.id = s.alumno_eval_id
      join public.evaluaciones e on e.id = ae.evaluacion_id
      where s.id = sesion_id and e.docente_id = auth.uid()
    )
  );

-- Acceso anónimo para lectura/escritura (alumno usa token)
create policy "Respuestas: acceso anon"
  on public.respuestas for all
  using (true)
  with check (true);
