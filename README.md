# EvalAr Secundaria

Sistema de evaluaciones para docentes de educación secundaria argentina.

## Tecnologías

- **React** + **Vite** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Zustand** (estado global)
- **React Router v6** (navegación)

## Inicio rápido

```bash
npm install
npm run dev
```

## Cuentas de prueba

| Rol     | Email                      | Contraseña |
|---------|---------------------------|------------|
| Docente | docente@evaluar.edu.ar    | 123456     |
| Alumno  | alumno@evaluar.edu.ar     | 123456     |

## Scripts

| Comando          | Descripción                |
|-----------------|---------------------------|
| `npm run dev`   | Servidor de desarrollo     |
| `npm run build` | Build de producción        |
| `npm run lint`  | Ejecutar ESLint            |
| `npm run preview` | Preview del build        |

## Estructura del proyecto

```
src/
├── components/     # Componentes reutilizables (Header, Sidebar, etc.)
│   └── ui/         # Componentes shadcn/ui
├── hooks/          # Hooks personalizados
├── lib/            # Utilidades y servicios (Supabase, Gemini, PDF)
├── pages/          # Páginas de la aplicación
├── store/          # Stores de Zustand
└── types/          # Interfaces TypeScript
```

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GEMINI_API_KEY=
VITE_RESEND_API_KEY=
```
