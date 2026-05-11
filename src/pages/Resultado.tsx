import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Download,
  Share2,
  BarChart3,
  Award,
  Clock,
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
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/store/authStore"

const resultadoMock = {
  titulo: "Parcial de Matemática - Funciones",
  materia: "Matemática",
  curso: "3° A",
  fecha: "15 de abril de 2026",
  duracion: "1h 12min",
  nota: 8,
  puntaje_obtenido: 80,
  puntaje_total: 100,
  porcentaje: 80,
  aprobado: true,
  preguntas: [
    {
      id: "1",
      texto: "Determinar el dominio de f(x) = √(x-3)",
      correcta: true,
      puntaje: 10,
    },
    {
      id: "2",
      texto: "Graficar f(x) = 2x + 1",
      correcta: true,
      puntaje: 10,
    },
    {
      id: "3",
      texto: "Hallar la intersección con el eje Y de f(x) = x² - 4",
      correcta: true,
      puntaje: 10,
    },
    {
      id: "4",
      texto: "Clasificar f(x) = 3 como función constante, lineal o cuadrática",
      correcta: true,
      puntaje: 10,
    },
    {
      id: "5",
      texto: "Determinar si f(x) = x³ es par, impar o ninguna",
      correcta: false,
      puntaje: 0,
    },
    {
      id: "6",
      texto: "Calcular f(2) si f(x) = x² - 3x + 5",
      correcta: true,
      puntaje: 10,
    },
    {
      id: "7",
      texto: "Identificar el vértice de f(x) = (x-2)² + 3",
      correcta: true,
      puntaje: 10,
    },
    {
      id: "8",
      texto: "Resolver el sistema de ecuaciones lineales",
      correcta: true,
      puntaje: 10,
    },
    {
      id: "9",
      texto: "Determinar la imagen de f(x) = |x - 1|",
      correcta: false,
      puntaje: 0,
    },
    {
      id: "10",
      texto: "Componer f(g(x)) con f(x) = 2x y g(x) = x + 1",
      correcta: true,
      puntaje: 10,
    },
  ],
  estadisticas_curso: {
    promedio: 6.8,
    aprobados: 18,
    desaprobados: 7,
    nota_maxima: 10,
    nota_minima: 3,
  },
}

export function Resultado() {
  const navigate = useNavigate()
  const { id: _evaluacionId } = useParams()
  void _evaluacionId
  const { user } = useAuthStore()

  const r = resultadoMock
  const esDocente = user?.rol === "docente"
  const correctas = r.preguntas.filter((p) => p.correcta).length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {esDocente ? "Resultados" : "Tu Resultado"}
          </h2>
          <p className="text-muted-foreground">{r.titulo}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" disabled>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" disabled>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <div
              className={`inline-flex h-24 w-24 items-center justify-center rounded-full ${r.aprobado ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30"}`}
            >
              {r.aprobado ? (
                <Award className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div>
              <p className="text-5xl font-bold">{r.nota}</p>
              <p className="text-muted-foreground mt-1">
                {r.puntaje_obtenido}/{r.puntaje_total} puntos
              </p>
            </div>
            <Badge
              variant={r.aprobado ? "default" : "destructive"}
              className="text-sm px-4 py-1"
            >
              {r.aprobado ? "Aprobado" : "Desaprobado"}
            </Badge>

            <Separator />

            <div className="w-full space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Correctas:</span>
                <span className="ml-auto font-medium">
                  {correctas}/{r.preguntas.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Porcentaje:</span>
                <span className="ml-auto font-medium">{r.porcentaje}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Duración:</span>
                <span className="ml-auto font-medium">{r.duracion}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Detalle de Respuestas</CardTitle>
            <CardDescription>
              {r.materia} · {r.curso} · {r.fecha}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {r.preguntas.map((pregunta, index) => (
                <div
                  key={pregunta.id}
                  className={`flex items-start gap-3 rounded-lg border p-3 ${
                    pregunta.correcta
                      ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10"
                      : "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10"
                  }`}
                >
                  <div className="mt-0.5">
                    {pregunta.correcta ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {index + 1}. {pregunta.texto}
                    </p>
                  </div>
                  <Badge
                    variant={pregunta.correcta ? "default" : "destructive"}
                    className="shrink-0"
                  >
                    {pregunta.puntaje} pts
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {esDocente && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Estadísticas del Curso
            </CardTitle>
            <CardDescription>{r.curso}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-5">
              <div className="text-center rounded-lg bg-muted/50 p-4">
                <p className="text-2xl font-bold">
                  {r.estadisticas_curso.promedio}
                </p>
                <p className="text-xs text-muted-foreground">Promedio</p>
              </div>
              <div className="text-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {r.estadisticas_curso.aprobados}
                </p>
                <p className="text-xs text-muted-foreground">Aprobados</p>
              </div>
              <div className="text-center rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {r.estadisticas_curso.desaprobados}
                </p>
                <p className="text-xs text-muted-foreground">Desaprobados</p>
              </div>
              <div className="text-center rounded-lg bg-muted/50 p-4">
                <p className="text-2xl font-bold">
                  {r.estadisticas_curso.nota_maxima}
                </p>
                <p className="text-xs text-muted-foreground">Máxima</p>
              </div>
              <div className="text-center rounded-lg bg-muted/50 p-4">
                <p className="text-2xl font-bold">
                  {r.estadisticas_curso.nota_minima}
                </p>
                <p className="text-xs text-muted-foreground">Mínima</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  Tasa de aprobación
                </span>
                <span className="font-medium">
                  {Math.round(
                    (r.estadisticas_curso.aprobados /
                      (r.estadisticas_curso.aprobados +
                        r.estadisticas_curso.desaprobados)) *
                      100,
                  )}
                  %
                </span>
              </div>
              <Progress
                value={
                  (r.estadisticas_curso.aprobados /
                    (r.estadisticas_curso.aprobados +
                      r.estadisticas_curso.desaprobados)) *
                  100
                }
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>
    </div>
  )
}
