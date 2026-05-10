import { useNavigate, useParams } from "react-router-dom"
import {
  Award,
  XCircle,
  CheckCircle2,
  Download,
  Home,
  Clock,
  Target,
  BarChart3,
  MessageSquare,
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
import { cn } from "@/lib/utils"

interface PreguntaResultado {
  id: string
  texto: string
  tipo: "multiple_choice" | "verdadero_falso" | "desarrollo"
  respuestaDada: string
  respuestaCorrecta?: string
  puntajeObtenido: number
  puntajeTotal: number
  justificacion: string
}

const resultadoMock = {
  titulo: "Parcial de Matemática - Funciones",
  materia: "Matemática",
  curso: "3° A",
  docente: "Prof. María González",
  fecha: "15 de mayo de 2026",
  duracion: "47 min 23 seg",
  puntajeObtenido: 85,
  puntajeTotal: 100,
  porcentaje: 85,
  aprobado: true,
  preguntas: [
    {
      id: "1",
      texto: "¿Cuál es el dominio de la función f(x) = √(x − 3)?",
      tipo: "multiple_choice" as const,
      respuestaDada: "x ≥ 3",
      respuestaCorrecta: "x ≥ 3",
      puntajeObtenido: 10,
      puntajeTotal: 10,
      justificacion:
        "Correcto. Para que la raíz cuadrada esté definida, el radicando debe ser ≥ 0, es decir x − 3 ≥ 0, por lo tanto x ≥ 3.",
    },
    {
      id: "2",
      texto: "La función f(x) = x² es una función par.",
      tipo: "verdadero_falso" as const,
      respuestaDada: "Verdadero",
      respuestaCorrecta: "Verdadero",
      puntajeObtenido: 10,
      puntajeTotal: 10,
      justificacion:
        "Correcto. f(−x) = (−x)² = x² = f(x), lo que confirma que es par.",
    },
    {
      id: "3",
      texto:
        "Dada f(x) = x² − 6x + 8, encontrá las raíces, el vértice y si abre hacia arriba o abajo.",
      tipo: "desarrollo" as const,
      respuestaDada:
        "Las raíces son x=2 y x=4 porque x²-6x+8 = (x-2)(x-4). El vértice está en x=3, y f(3) = 9-18+8 = -1, entonces V(3,-1). Abre hacia arriba porque a=1>0.",
      puntajeObtenido: 18,
      puntajeTotal: 20,
      justificacion:
        "Muy bien el desarrollo. Las raíces y el vértice están correctos. Se descontaron 2 puntos porque faltó mencionar explícitamente la fórmula del vértice xv = -b/2a.",
    },
    {
      id: "4",
      texto: "Si f(x) = 2x + 1 y g(x) = x − 3, entonces (f ∘ g)(x) es:",
      tipo: "multiple_choice" as const,
      respuestaDada: "2x − 5",
      respuestaCorrecta: "2x − 5",
      puntajeObtenido: 10,
      puntajeTotal: 10,
      justificacion:
        "Correcto. f(g(x)) = 2(x − 3) + 1 = 2x − 6 + 1 = 2x − 5.",
    },
    {
      id: "5",
      texto:
        "La pendiente de la recta que pasa por los puntos (1, 3) y (4, 9) es:",
      tipo: "multiple_choice" as const,
      respuestaDada: "2",
      respuestaCorrecta: "2",
      puntajeObtenido: 10,
      puntajeTotal: 10,
      justificacion:
        "Correcto. m = (y₂ − y₁)/(x₂ − x₁) = (9 − 3)/(4 − 1) = 6/3 = 2.",
    },
    {
      id: "6",
      texto: "Toda función lineal tiene exactamente una raíz.",
      tipo: "verdadero_falso" as const,
      respuestaDada: "Verdadero",
      respuestaCorrecta: "Falso",
      puntajeObtenido: 0,
      puntajeTotal: 10,
      justificacion:
        "Incorrecto. La función constante f(x) = k (con k ≠ 0) es lineal pero no tiene raíces, y f(x) = 0 tiene infinitas raíces.",
    },
    {
      id: "7",
      texto:
        "Explicá la diferencia entre dominio e imagen de una función. Dá un ejemplo.",
      tipo: "desarrollo" as const,
      respuestaDada:
        "El dominio es el conjunto de valores que puede tomar x (la entrada), y la imagen es el conjunto de valores que toma y (la salida). Por ejemplo, en f(x) = √x, el dominio es x ≥ 0 y la imagen es y ≥ 0.",
      puntajeObtenido: 17,
      puntajeTotal: 20,
      justificacion:
        "Buena explicación conceptual y buen ejemplo. Se descontaron 3 puntos porque faltó usar terminología formal (conjunto de partida/llegada) y mencionar que la imagen es un subconjunto del codominio.",
    },
    {
      id: "8",
      texto: "El vértice de la parábola f(x) = (x − 4)² − 1 es:",
      tipo: "multiple_choice" as const,
      respuestaDada: "(4, −1)",
      respuestaCorrecta: "(4, −1)",
      puntajeObtenido: 10,
      puntajeTotal: 10,
      justificacion:
        "Correcto. De la forma canónica f(x) = (x − h)² + k, se identifica h = 4 y k = −1.",
    },
  ] as PreguntaResultado[],
}

export function ResultadoAlumno() {
  const navigate = useNavigate()
  const { token } = useParams()
  void token

  const r = resultadoMock
  const correctas = r.preguntas.filter(
    (p) => p.puntajeObtenido === p.puntajeTotal,
  ).length
  const parciales = r.preguntas.filter(
    (p) => p.puntajeObtenido > 0 && p.puntajeObtenido < p.puntajeTotal,
  ).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 space-y-6">
        {/* Score hero */}
        <Card className="shadow-xl border-0 shadow-black/5 dark:shadow-black/20 overflow-hidden">
          <div
            className={cn(
              "p-8 sm:p-10 text-center space-y-4",
              r.aprobado
                ? "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30"
                : "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30",
            )}
          >
            <div
              className={cn(
                "inline-flex h-20 w-20 items-center justify-center rounded-full",
                r.aprobado
                  ? "bg-emerald-100 dark:bg-emerald-900/50"
                  : "bg-red-100 dark:bg-red-900/50",
              )}
            >
              {r.aprobado ? (
                <Award className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
              )}
            </div>

            <div>
              <p className="text-7xl sm:text-8xl font-extrabold tracking-tighter">
                {r.puntajeObtenido}
                <span className="text-3xl sm:text-4xl text-muted-foreground font-normal">
                  /{r.puntajeTotal}
                </span>
              </p>
              <p className="text-muted-foreground mt-2 text-lg">{r.porcentaje}% de acierto</p>
            </div>

            <Badge
              variant={r.aprobado ? "default" : "destructive"}
              className="text-base px-6 py-1.5"
            >
              {r.aprobado ? "Aprobado" : "Desaprobado"}
            </Badge>
          </div>

          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-lg font-bold">{correctas}</p>
                  <p className="text-xs text-muted-foreground">Correctas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Target className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <p className="text-lg font-bold">{parciales}</p>
                  <p className="text-xs text-muted-foreground">Parciales</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                <div>
                  <p className="text-lg font-bold">
                    {r.preguntas.length - correctas - parciales}
                  </p>
                  <p className="text-xs text-muted-foreground">Incorrectas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-lg font-bold text-primary">{r.duracion.split(" ")[0]}</p>
                  <p className="text-xs text-muted-foreground">Minutos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Detalle por pregunta
            </CardTitle>
            <CardDescription>
              {r.materia} · {r.curso} · {r.fecha}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {r.preguntas.map((pregunta, index) => {
              const esCompleta =
                pregunta.puntajeObtenido === pregunta.puntajeTotal
              const esParcial =
                pregunta.puntajeObtenido > 0 &&
                pregunta.puntajeObtenido < pregunta.puntajeTotal
              const esIncorrecta = pregunta.puntajeObtenido === 0

              return (
                <div
                  key={pregunta.id}
                  className={cn(
                    "rounded-xl border p-4 space-y-3",
                    esCompleta
                      ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10"
                      : esParcial
                        ? "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10"
                        : "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {esCompleta ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        ) : esParcial ? (
                          <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {index + 1}. {pregunta.texto}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {pregunta.tipo === "multiple_choice"
                              ? "Opción múltiple"
                              : pregunta.tipo === "verdadero_falso"
                                ? "V/F"
                                : "Desarrollo"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        esCompleta
                          ? "default"
                          : esIncorrecta
                            ? "destructive"
                            : "secondary"
                      }
                      className="shrink-0 text-sm"
                    >
                      {pregunta.puntajeObtenido}/{pregunta.puntajeTotal}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2 pl-8">
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Tu respuesta:{" "}
                      </span>
                      <span
                        className={cn(
                          "font-medium",
                          esCompleta
                            ? "text-emerald-700 dark:text-emerald-300"
                            : esIncorrecta
                              ? "text-red-700 dark:text-red-300"
                              : "text-amber-700 dark:text-amber-300",
                        )}
                      >
                        {pregunta.respuestaDada}
                      </span>
                    </div>

                    {pregunta.respuestaCorrecta &&
                      pregunta.respuestaDada !== pregunta.respuestaCorrecta && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            Respuesta correcta:{" "}
                          </span>
                          <span className="font-medium text-emerald-700 dark:text-emerald-300">
                            {pregunta.respuestaCorrecta}
                          </span>
                        </div>
                      )}

                    <div className="flex items-start gap-2 rounded-lg bg-background/80 p-3 text-sm">
                      <MessageSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">
                        {pregunta.justificacion}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Progress bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Puntaje total
              </span>
              <span className="text-sm font-semibold">
                {r.puntajeObtenido}/{r.puntajeTotal} ({r.porcentaje}%)
              </span>
            </div>
            <Progress value={r.porcentaje} className="h-3" />
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 flex-1"
            onClick={() => {
              /* PDF stub */
            }}
          >
            <Download className="h-4 w-4" />
            Descargar PDF
          </Button>
          <Button
            size="lg"
            className="gap-2 flex-1"
            onClick={() => navigate("/login")}
          >
            <Home className="h-4 w-4" />
            Volver al inicio
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          EvalAr v1.0 · Resultado generado el {r.fecha}
        </p>
      </div>
    </div>
  )
}
