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
  School,
  BookOpen,
  User,
  CalendarDays,
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
  respuestaCorrecta: string
  puntajeObtenido: number
  puntajeTotal: number
  rubrica: string
}

interface ResultadoEvaluacion {
  alumno: string
  escuela: string
  materia: string
  curso: string
  division: string
  docente: string
  fecha: string
  duracion: string
  puntajeObtenido: number
  puntajeTotal: number
  aprobado: boolean
  preguntas: PreguntaResultado[]
}

const resultadoMock: ResultadoEvaluacion = {
  alumno: "Tomás Herrera",
  escuela: "E.E.S. N° 12 «Juan B. Justo»",
  materia: "Matemática",
  curso: "3°",
  division: "A",
  docente: "Prof. María González",
  fecha: "15 de mayo de 2026",
  duracion: "47 min 23 seg",
  puntajeObtenido: 85,
  puntajeTotal: 100,
  aprobado: true,
  preguntas: [
    {
      id: "1",
      texto: "¿Cuál es el dominio de la función f(x) = √(x − 3)?",
      tipo: "multiple_choice",
      respuestaDada: "x ≥ 3",
      respuestaCorrecta: "x ≥ 3",
      puntajeObtenido: 10,
      puntajeTotal: 10,
      rubrica:
        "Correcto. Para que la raíz cuadrada esté definida, el radicando debe ser ≥ 0, es decir x − 3 ≥ 0, por lo tanto x ≥ 3.",
    },
    {
      id: "2",
      texto: "La función f(x) = x² es una función par.",
      tipo: "verdadero_falso",
      respuestaDada: "Verdadero",
      respuestaCorrecta: "Verdadero",
      puntajeObtenido: 10,
      puntajeTotal: 10,
      rubrica:
        "Correcto. Una función es par si f(−x) = f(x). En este caso, f(−x) = (−x)² = x² = f(x), lo cual confirma la propiedad.",
    },
    {
      id: "3",
      texto:
        "Dada f(x) = x² − 6x + 8, encontrá las raíces, el vértice y determiná si la parábola abre hacia arriba o hacia abajo. Justificá cada paso.",
      tipo: "desarrollo",
      respuestaDada:
        "Las raíces son x = 2 y x = 4 porque x² − 6x + 8 = (x − 2)(x − 4). El vértice está en x = 3, y f(3) = 9 − 18 + 8 = −1, entonces V(3, −1). Abre hacia arriba porque a = 1 > 0.",
      respuestaCorrecta:
        "Raíces: x = 2 y x = 4 (factorizando o por Bhaskara). Vértice: xᵥ = −b/2a = 6/2 = 3, yᵥ = f(3) = −1, entonces V(3, −1). Abre hacia arriba porque a = 1 > 0.",
      puntajeObtenido: 18,
      puntajeTotal: 20,
      rubrica:
        "Muy buen desarrollo. Las raíces y el vértice están correctos, y la conclusión sobre la apertura es acertada. Se descontaron 2 puntos porque faltó mencionar explícitamente la fórmula del vértice xᵥ = −b/(2a) como justificación formal del cálculo.",
    },
    {
      id: "4",
      texto: "Si f(x) = 2x + 1 y g(x) = x − 3, entonces (f ∘ g)(x) es:",
      tipo: "multiple_choice",
      respuestaDada: "2x − 5",
      respuestaCorrecta: "2x − 5",
      puntajeObtenido: 10,
      puntajeTotal: 10,
      rubrica:
        "Correcto. La composición f(g(x)) = f(x − 3) = 2(x − 3) + 1 = 2x − 6 + 1 = 2x − 5.",
    },
    {
      id: "5",
      texto:
        "La pendiente de la recta que pasa por los puntos (1, 3) y (4, 9) es:",
      tipo: "multiple_choice",
      respuestaDada: "2",
      respuestaCorrecta: "2",
      puntajeObtenido: 10,
      puntajeTotal: 10,
      rubrica:
        "Correcto. Aplicando la fórmula de pendiente: m = (y₂ − y₁)/(x₂ − x₁) = (9 − 3)/(4 − 1) = 6/3 = 2.",
    },
    {
      id: "6",
      texto: "Toda función lineal tiene exactamente una raíz.",
      tipo: "verdadero_falso",
      respuestaDada: "Verdadero",
      respuestaCorrecta: "Falso",
      puntajeObtenido: 0,
      puntajeTotal: 10,
      rubrica:
        "Incorrecto. No toda función lineal tiene exactamente una raíz. La función constante f(x) = k (con k ≠ 0) es un caso particular de función lineal que no tiene raíces, y f(x) = 0 tiene infinitas raíces (todo ℝ). Solo las funciones de la forma f(x) = mx + b con m ≠ 0 tienen exactamente una raíz.",
    },
    {
      id: "7",
      texto:
        "Explicá la diferencia entre dominio e imagen de una función. Dá un ejemplo concreto e identificá dominio e imagen en él.",
      tipo: "desarrollo",
      respuestaDada:
        "El dominio es el conjunto de valores que puede tomar x (la entrada), y la imagen es el conjunto de valores que toma y (la salida). Por ejemplo, en f(x) = √x, el dominio es x ≥ 0 y la imagen es y ≥ 0.",
      respuestaCorrecta:
        "El dominio (conjunto de partida) son todos los valores de x para los cuales la función está definida. La imagen (subconjunto del codominio) son todos los valores de y que la función efectivamente alcanza. Ejemplo: f(x) = √x tiene dominio [0, +∞) e imagen [0, +∞).",
      puntajeObtenido: 17,
      puntajeTotal: 20,
      rubrica:
        "Buena explicación conceptual y ejemplo pertinente con dominio e imagen correctos. Se descontaron 3 puntos porque faltó utilizar terminología formal (conjunto de partida y conjunto de llegada) y mencionar que la imagen es un subconjunto del codominio, no el codominio en sí.",
    },
    {
      id: "8",
      texto: "El vértice de la parábola f(x) = (x − 4)² − 1 es:",
      tipo: "multiple_choice",
      respuestaDada: "(4, −1)",
      respuestaCorrecta: "(4, −1)",
      puntajeObtenido: 10,
      puntajeTotal: 10,
      rubrica:
        "Correcto. De la forma canónica f(x) = a(x − h)² + k se identifican directamente h = 4 y k = −1, por lo tanto el vértice es V(4, −1).",
    },
  ],
}

function tipoLabel(tipo: PreguntaResultado["tipo"]) {
  switch (tipo) {
    case "multiple_choice":
      return "Opción múltiple"
    case "verdadero_falso":
      return "Verdadero / Falso"
    case "desarrollo":
      return "Desarrollo"
  }
}

function clasificacion(p: PreguntaResultado) {
  if (p.puntajeObtenido === p.puntajeTotal) return "correcta"
  if (p.puntajeObtenido === 0) return "incorrecta"
  return "parcial"
}

export function ResultadoAlumno() {
  const navigate = useNavigate()
  const { token } = useParams()
  void token

  const r = resultadoMock
  const porcentaje = Math.round((r.puntajeObtenido / r.puntajeTotal) * 100)
  const correctas = r.preguntas.filter(
    (p) => clasificacion(p) === "correcta",
  ).length
  const parciales = r.preguntas.filter(
    (p) => clasificacion(p) === "parcial",
  ).length
  const incorrectas = r.preguntas.length - correctas - parciales

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      {/* Print-specific styles for A4 PDF generation */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            font-size: 11pt;
          }

          .no-print {
            display: none !important;
          }

          .print-break-inside-avoid {
            break-inside: avoid;
          }

          .print-break-before {
            break-before: page;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 space-y-6">
          {/* Metadata header */}
          <Card className="print-break-inside-avoid">
            <CardContent className="p-5 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">Alumno:</span>
                  <span className="font-semibold">{r.alumno}</span>
                </div>
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">Escuela:</span>
                  <span className="font-semibold">{r.escuela}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">Materia:</span>
                  <span className="font-semibold">{r.materia}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">Curso:</span>
                  <span className="font-semibold">
                    {r.curso} {r.division}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">Docente:</span>
                  <span className="font-semibold">{r.docente}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="font-semibold">{r.fecha}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score hero */}
          <Card className="shadow-xl border-0 shadow-black/5 dark:shadow-black/20 overflow-hidden print-break-inside-avoid">
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
                <p className="text-muted-foreground mt-2 text-lg">
                  {porcentaje}% de acierto
                </p>
              </div>

              <Badge
                variant={r.aprobado ? "default" : "destructive"}
                className="text-base px-6 py-1.5 uppercase tracking-wide"
              >
                {r.aprobado ? "Aprobado" : "Reprobado"}
              </Badge>
            </div>

            {/* Summary stats */}
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-lg font-bold">{correctas}</p>
                    <p className="text-xs text-muted-foreground">Correctas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3">
                  <Target className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div>
                    <p className="text-lg font-bold">{parciales}</p>
                    <p className="text-xs text-muted-foreground">Parciales</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 p-3">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                  <div>
                    <p className="text-lg font-bold">{incorrectas}</p>
                    <p className="text-xs text-muted-foreground">Incorrectas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <Clock className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-lg font-bold text-primary">
                      {r.duracion}
                    </p>
                    <p className="text-xs text-muted-foreground">Duración</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress bar */}
          <Card className="print-break-inside-avoid">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Puntaje total
                </span>
                <span className="text-sm font-semibold">
                  {r.puntajeObtenido}/{r.puntajeTotal} ({porcentaje}%)
                </span>
              </div>
              <Progress value={porcentaje} className="h-3" />
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
                {r.materia} — Funciones · {r.curso} {r.division} · {r.fecha}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {r.preguntas.map((pregunta, index) => {
                const cls = clasificacion(pregunta)
                const esCorrecta = cls === "correcta"
                const esParcial = cls === "parcial"

                return (
                  <div
                    key={pregunta.id}
                    className={cn(
                      "rounded-xl border p-4 space-y-3 print-break-inside-avoid",
                      esCorrecta
                        ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10"
                        : esParcial
                          ? "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10"
                          : "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10",
                    )}
                  >
                    {/* Question header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {esCorrecta ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          ) : esParcial ? (
                            <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            Pregunta {index + 1}: {pregunta.texto}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {tipoLabel(pregunta.tipo)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          esCorrecta
                            ? "default"
                            : esParcial
                              ? "secondary"
                              : "destructive"
                        }
                        className="shrink-0 text-sm"
                      >
                        {pregunta.puntajeObtenido}/{pregunta.puntajeTotal}
                      </Badge>
                    </div>

                    <Separator />

                    {/* Answer details */}
                    <div className="space-y-2 pl-8">
                      <div className="text-sm">
                        <span className="text-muted-foreground font-medium">
                          Respuesta dada:{" "}
                        </span>
                        <span
                          className={cn(
                            "font-medium",
                            esCorrecta
                              ? "text-emerald-700 dark:text-emerald-300"
                              : esParcial
                                ? "text-amber-700 dark:text-amber-300"
                                : "text-red-700 dark:text-red-300",
                          )}
                        >
                          {pregunta.respuestaDada}
                        </span>
                      </div>

                      <div className="text-sm">
                        <span className="text-muted-foreground font-medium">
                          Respuesta correcta:{" "}
                        </span>
                        <span className="font-medium text-emerald-700 dark:text-emerald-300">
                          {pregunta.respuestaCorrecta}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 rounded-lg bg-background/80 p-3 text-sm">
                        <MessageSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-foreground">
                            Rúbrica:{" "}
                          </span>
                          <span className="text-muted-foreground">
                            {pregunta.rubrica}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 no-print">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 flex-1"
              onClick={handlePrint}
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
            EvalAr Secundaria v1.0 · Resultado generado el {r.fecha}
          </p>
        </div>
      </div>
    </>
  )
}
