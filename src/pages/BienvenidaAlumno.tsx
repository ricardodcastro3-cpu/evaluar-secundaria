import { useNavigate, useParams } from "react-router-dom"
import {
  GraduationCap,
  Zap,
  BookOpen,
  Clock,
  Calendar,
  User,
  BookMarked,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const evaluacionMock = {
  alumno: { nombre: "Juan", apellido: "Pérez", curso: "3°", division: "A" },
  materia: "Matemática",
  docente: "Prof. María González",
  titulo: "Parcial de Matemática - Funciones",
  fecha: "15 de mayo de 2026",
  duracionFastTrack: 15,
  duracionFormal: 60,
  cantidadPreguntas: 10,
  temas: ["Funciones lineales", "Funciones cuadráticas", "Dominio e imagen"],
}

export function BienvenidaAlumno() {
  const navigate = useNavigate()
  const { token } = useParams()

  const ev = evaluacionMock

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#7C3AED]/12 via-[#2563EB]/8 to-transparent pointer-events-none" />
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12 relative">
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#2563EB] shadow-lg shadow-[#7C3AED]/30">
            <GraduationCap className="h-9 w-9 text-white" strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a] dark:text-foreground">
              EVALUACIONES SAN JUAN
            </h1>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">
              Nivel Secundario — Ciclo Básico y Orientado — San Juan, República Argentina
            </p>
          </div>
        </div>

        <Card className="border border-[#E5E7EB]/80 dark:border-border shadow-[0_8px_32px_-8px_rgba(124,58,237,0.12)]">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <p className="text-lg text-muted-foreground">Bienvenido/a</p>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0f172a] dark:text-foreground">
                {ev.alumno.nombre} {ev.alumno.apellido}
              </h2>
              <Badge variant="secondary" className="text-sm px-3 py-1 font-semibold">
                {ev.alumno.curso} {ev.alumno.division}
              </Badge>
            </div>

            <Separator className="bg-border/80" />

            <div className="space-y-3">
              <h3 className="font-heading font-bold text-lg text-center text-[#0f172a] dark:text-foreground">{ev.titulo}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-card border border-[#E5E7EB]/90 dark:border-border p-3 shadow-sm">
                  <BookMarked className="h-5 w-5 text-[#7C3AED] shrink-0" strokeWidth={2.25} />
                  <div>
                    <p className="text-xs text-muted-foreground">Materia</p>
                    <p className="font-semibold text-sm text-[#0f172a] dark:text-foreground">{ev.materia}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-card border border-[#E5E7EB]/90 dark:border-border p-3 shadow-sm">
                  <User className="h-5 w-5 text-[#7C3AED] shrink-0" strokeWidth={2.25} />
                  <div>
                    <p className="text-xs text-muted-foreground">Docente</p>
                    <p className="font-semibold text-sm text-[#0f172a] dark:text-foreground">{ev.docente}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-card border border-[#E5E7EB]/90 dark:border-border p-3 shadow-sm">
                  <Calendar className="h-5 w-5 text-[#7C3AED] shrink-0" strokeWidth={2.25} />
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha</p>
                    <p className="font-semibold text-sm text-[#0f172a] dark:text-foreground">{ev.fecha}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-card border border-[#E5E7EB]/90 dark:border-border p-3 shadow-sm">
                  <Clock className="h-5 w-5 text-[#7C3AED] shrink-0" strokeWidth={2.25} />
                  <div>
                    <p className="text-xs text-muted-foreground">Duración</p>
                    <p className="font-semibold text-sm text-[#0f172a] dark:text-foreground">{ev.duracionFormal} minutos</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-border/80" />

            <div className="space-y-3">
              <p className="text-center text-sm font-heading font-bold text-amber-700 dark:text-amber-300">
                ⚡ Empezá practicando con el Fast Track
              </p>
              <button
                type="button"
                onClick={() => navigate(`/fast-track/${token}`)}
                className="w-full group relative flex items-center gap-4 rounded-2xl border-2 border-amber-300/90 bg-gradient-to-r from-amber-50 to-orange-50/80 dark:from-amber-950/40 dark:to-orange-950/20 dark:border-amber-600/50 p-5 transition-all hover:border-amber-400 hover:shadow-lg hover:shadow-amber-200/50 hover:-translate-y-0.5 active:translate-y-0 dark:hover:shadow-amber-900/20"
              >
                <div className="rounded-xl bg-amber-100 dark:bg-amber-900/50 p-3 ring-1 ring-amber-200/80 dark:ring-amber-500/20">
                  <Zap className="h-8 w-8 text-amber-600 dark:text-amber-400" strokeWidth={2.25} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-heading font-bold text-lg text-amber-900 dark:text-amber-100">
                    Practicar con Fast Track
                  </p>
                  <p className="text-sm text-amber-800/85 dark:text-amber-200/85 mt-0.5">
                    {ev.duracionFastTrack} min · 10 ítems de práctica · Podés repetirlo las veces que quieras
                  </p>
                </div>
                <div className="text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform font-bold">
                  →
                </div>
              </button>
            </div>

            <Separator className="bg-border/80" />

            <div className="space-y-3">
              <p className="text-center text-xs text-muted-foreground">
                Cuando te sientas preparado/a
              </p>
              <button
                type="button"
                onClick={() => navigate(`/evaluacion/${token}`)}
                className="w-full group relative flex items-center gap-4 rounded-2xl border-2 border-[#7C3AED]/35 bg-gradient-to-r from-[#7C3AED]/[0.07] to-[#2563EB]/[0.09] dark:from-[#7C3AED]/20 dark:to-[#2563EB]/15 dark:border-[#a78bfa]/40 p-4 transition-all hover:border-[#7C3AED]/55 hover:shadow-[0_12px_40px_-12px_rgba(124,58,237,0.25)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <div className="rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#2563EB] p-2.5 shadow-md shadow-[#7C3AED]/25">
                  <BookOpen className="h-6 w-6 text-white" strokeWidth={2.25} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-heading font-bold text-[#4A2BA8] dark:text-[#C4B5FD]">
                    Iniciar Evaluación Formal
                  </p>
                  <p className="text-xs text-[#6B7280] dark:text-muted-foreground mt-0.5">
                    {ev.duracionFormal} min · Una sola oportunidad
                  </p>
                </div>
              </button>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-amber-200/90 bg-amber-50/90 dark:border-amber-700/50 dark:bg-amber-950/30 p-4">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" strokeWidth={2.25} />
              <div className="text-sm text-amber-900 dark:text-amber-100 space-y-1">
                <p className="font-heading font-bold text-amber-950 dark:text-amber-50">
                  Importante
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-amber-900/95 dark:text-amber-100/95">
                  <li>La evaluación formal tiene <strong>una sola oportunidad</strong>. No podrás repetirla.</li>
                  <li>Al iniciar la evaluación formal, se borran los resultados del Fast Track.</li>
                  <li>Te recomendamos practicar primero con el Fast Track las veces que necesites.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-xl bg-gradient-to-r from-[#7C3AED]/10 to-[#2563EB]/10 border border-[#7C3AED]/15 dark:from-[#7C3AED]/20 dark:to-[#2563EB]/15 dark:border-violet-500/25 p-3 mt-4">
          <p className="text-xs text-[#0f172a] dark:text-foreground/90 text-center font-medium">
            Al acceder a esta evaluación quedás registrado/a automáticamente.
            El listado de alumnos se genera en orden alfabético.
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Diseño de propiedad intelectual del Profesor RICARDO DAMIÁN CASTRO — San Juan, República Argentina
        </p>
      </div>
    </div>
  )
}
