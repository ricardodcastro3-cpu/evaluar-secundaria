import { useNavigate } from "react-router-dom"
import {
  BookOpen,
  Zap,
  Clock,
  CheckCircle2,
  Trophy,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuthStore } from "@/store/authStore"

const evaluacionesPendientes = [
  {
    id: "eval-2",
    titulo: "FastTrack - Revolución de Mayo",
    materia: "Historia",
    tipo: "fasttrack" as const,
    duracion: 15,
    preguntas: 5,
  },
  {
    id: "eval-3",
    titulo: "Parcial de Lengua - Análisis Sintáctico",
    materia: "Lengua y Literatura",
    tipo: "formal" as const,
    duracion: 60,
    preguntas: 8,
  },
]

const evaluacionesCompletadas = [
  {
    id: "eval-1",
    titulo: "Parcial de Matemática - Funciones",
    materia: "Matemática",
    nota: 8,
    porcentaje: 80,
    fecha: "15/04/2026",
  },
]

export function DashboardAlumno() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight text-[#0f172a] dark:text-foreground">
          ¡Hola, {user?.nombre}!
        </h2>
        <p className="text-muted-foreground">
          Acá podés ver tus evaluaciones pendientes y resultados
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200/85 to-amber-400/30 shadow-sm ring-1 ring-amber-300/55 dark:from-amber-900/55 dark:to-amber-700/25 dark:ring-amber-500/25">
              <Clock className="h-9 w-9 text-amber-700 dark:text-amber-300" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="font-heading text-2xl font-bold text-[#0f172a] dark:text-foreground">
                {evaluacionesPendientes.length}
              </p>
              <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-200/80 to-emerald-400/25 shadow-sm ring-1 ring-emerald-300/55 dark:from-emerald-900/55 dark:to-emerald-800/20 dark:ring-emerald-500/25">
              <CheckCircle2 className="h-9 w-9 text-emerald-700 dark:text-emerald-300" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="font-heading text-2xl font-bold text-[#0f172a] dark:text-foreground">
                {evaluacionesCompletadas.length}
              </p>
              <p className="text-sm font-medium text-muted-foreground">Completadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED]/25 via-violet-300/20 to-[#2563EB]/15 shadow-sm ring-1 ring-[#7C3AED]/20">
              <Trophy className="h-9 w-9 text-[#7C3AED]" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="font-heading text-2xl font-bold text-[#0f172a] dark:text-foreground">8.0</p>
              <p className="text-sm font-medium text-muted-foreground">Promedio</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-[#7C3AED]" strokeWidth={2.25} />
            Evaluaciones Pendientes
          </CardTitle>
          <CardDescription>
            Evaluaciones que tenés que completar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {evaluacionesPendientes.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">
              No tenés evaluaciones pendientes
            </p>
          ) : (
            <div className="space-y-3">
              {evaluacionesPendientes.map((ev) => (
                <div
                  key={ev.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-[#E5E7EB] dark:border-border bg-white/60 dark:bg-card/50 p-4 shadow-sm"
                >
                  <div
                    className={`rounded-xl p-2 self-start ring-1 ${ev.tipo === "fasttrack" ? "bg-amber-100 dark:bg-amber-900/30 ring-amber-200/80" : "bg-[#7C3AED]/10 ring-[#7C3AED]/15"}`}
                  >
                    {ev.tipo === "fasttrack" ? (
                      <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" strokeWidth={2.25} />
                    ) : (
                      <BookOpen className="h-5 w-5 text-[#7C3AED]" strokeWidth={2.25} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{ev.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {ev.materia} · {ev.duracion} min · {ev.preguntas}{" "}
                      preguntas
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(
                        ev.tipo === "fasttrack"
                          ? "/alumno/fasttrack"
                          : "/alumno/evaluacion",
                      )
                    }
                  >
                    Comenzar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.25} />
            Resultados
          </CardTitle>
          <CardDescription>Tus evaluaciones completadas</CardDescription>
        </CardHeader>
        <CardContent>
          {evaluacionesCompletadas.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">
              Todavía no completaste ninguna evaluación
            </p>
          ) : (
            <div className="space-y-3">
              {evaluacionesCompletadas.map((ev) => (
                <div
                  key={ev.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-[#E5E7EB] dark:border-border p-4 cursor-pointer hover:bg-[#7C3AED]/[0.04] transition-colors shadow-sm"
                  onClick={() => navigate(`/alumno/resultado/${ev.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{ev.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {ev.materia} · {ev.fecha}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <Progress value={ev.porcentaje} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {ev.porcentaje}% correcto
                      </p>
                    </div>
                    <Badge
                      variant={ev.nota >= 6 ? "success" : "destructive"}
                      className="text-base px-3 py-1"
                    >
                      {ev.nota}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
