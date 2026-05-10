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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <GraduationCap className="h-9 w-9 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Eval<span className="text-primary">Ar</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sistema de Evaluación Secundaria
            </p>
          </div>
        </div>

        <Card className="shadow-xl border-0 shadow-black/5 dark:shadow-black/20">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <p className="text-lg text-muted-foreground">Bienvenido/a</p>
              <h2 className="text-2xl sm:text-3xl font-bold">
                {ev.alumno.nombre} {ev.alumno.apellido}
              </h2>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {ev.alumno.curso} {ev.alumno.division}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-center">{ev.titulo}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <BookMarked className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Materia</p>
                    <p className="font-medium text-sm">{ev.materia}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <User className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Docente</p>
                    <p className="font-medium text-sm">{ev.docente}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <Calendar className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha</p>
                    <p className="font-medium text-sm">{ev.fecha}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <Clock className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duración</p>
                    <p className="font-medium text-sm">{ev.duracionFormal} minutos</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                Elegí cómo querés comenzar
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate(`/fast-track/${token}`)}
                  className="group relative flex flex-col items-center gap-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6 transition-all hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-100 hover:scale-[1.02] active:scale-[0.98] dark:border-emerald-800 dark:bg-emerald-950/30 dark:hover:border-emerald-600 dark:hover:shadow-emerald-900/20"
                >
                  <div className="rounded-xl bg-emerald-100 p-3 dark:bg-emerald-900/50">
                    <Zap className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-emerald-700 dark:text-emerald-300">
                      Practicar con Fast Track
                    </p>
                    <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                      {ev.duracionFastTrack} min · Podés repetirlo
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => navigate(`/evaluacion/${token}`)}
                  className="group relative flex flex-col items-center gap-3 rounded-xl border-2 border-blue-200 bg-blue-50 p-6 transition-all hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 hover:scale-[1.02] active:scale-[0.98] dark:border-blue-800 dark:bg-blue-950/30 dark:hover:border-blue-600 dark:hover:shadow-blue-900/20"
                >
                  <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900/50">
                    <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-blue-700 dark:text-blue-300">
                      Iniciar Evaluación Formal
                    </p>
                    <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                      {ev.duracionFormal} min · Una sola oportunidad
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-amber-800 dark:text-amber-200">
                  Importante
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">
                  La evaluación formal tiene una sola oportunidad. No podrás repetirla.
                  Te recomendamos practicar primero con el Fast Track.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          EvalAr v1.0 · Si tenés problemas, contactá a tu docente
        </p>
      </div>
    </div>
  )
}
