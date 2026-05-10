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
  const { usuario } = useAuthStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          ¡Hola, {usuario?.nombre}!
        </h2>
        <p className="text-muted-foreground">
          Acá podés ver tus evaluaciones pendientes y resultados
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-amber-100 dark:bg-amber-900/30 p-3">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {evaluacionesPendientes.length}
              </p>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-emerald-100 dark:bg-emerald-900/30 p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {evaluacionesCompletadas.length}
              </p>
              <p className="text-sm text-muted-foreground">Completadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-primary/10 p-3">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">8.0</p>
              <p className="text-sm text-muted-foreground">Promedio</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
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
                  className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border p-4"
                >
                  <div
                    className={`rounded-lg p-2 self-start ${ev.tipo === "fasttrack" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-primary/10"}`}
                  >
                    {ev.tipo === "fasttrack" ? (
                      <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-primary" />
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
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
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
                  className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border p-4 cursor-pointer hover:bg-accent/50 transition-colors"
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
                      variant={ev.nota >= 6 ? "default" : "destructive"}
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
