# AGENTS.md

## Instrucciones específicas para Cursor Cloud

Este repositorio es **EvalAr Secundaria**, un sistema de evaluaciones para docentes de secundaria argentina, construido con React + Vite + TypeScript + Tailwind CSS + shadcn/ui + Zustand + React Router v6.

**Idioma del proyecto:** Español. Toda la documentación, comentarios y texto de la UI deben estar en español.

### Comandos principales

- `npm install` — instalar dependencias
- `npm run dev` — servidor de desarrollo (Vite, puerto 5173)
- `npm run build` — build de producción (requiere `tsc -b` sin errores)
- `npm run lint` — ejecutar ESLint

### Cuentas de prueba (mock, sin Supabase)

- **Docente:** `docente@evaluar.edu.ar` / `123456`
- **Alumno:** `alumno@evaluar.edu.ar` / `123456`

### Notas para futuros agentes

- El proyecto actualmente usa datos mock en los stores de Zustand. Supabase, Gemini y Resend tienen placeholders en `src/lib/` pero no están conectados.
- Las variables de entorno están definidas en `.env.example`. No son necesarias para el funcionamiento con datos mock.
- shadcn/ui está configurado con Tailwind CSS v4 y el Vite plugin. Para agregar nuevos componentes: `npx shadcn@latest add <componente>`.
- El color principal es índigo (#4F46E5). El tema soporta modo oscuro/claro con toggle.
- La fuente del proyecto es Inter (cargada vía Google Fonts en `index.html`).
