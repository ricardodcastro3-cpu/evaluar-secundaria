import { useState, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Zap,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  X,
  ClipboardList,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { TimerBar } from "@/components/TimerBar"
import { cn } from "@/lib/utils"

interface Opcion {
  id: string
  texto: string
  es_correcta: boolean
}

interface PreguntaFT {
  id: string
  tipo: "multiple_choice" | "desarrollo"
  texto: string
  opciones: Opcion[]
  puntaje: number
  respuestaModelo?: string
}

interface ResultadoItem {
  preguntaId: string
  esCorrecta: boolean
  puntajeObtenido: number
  puntajeMaximo: number
}

const preguntasMock: PreguntaFT[] = [
  {
    id: "ft1",
    tipo: "multiple_choice",
    texto: "Dadas f(x) = 2x² − 1 y g(x) = 3x + 4, el valor de f(g(−1)) es:",
    puntaje: 10,
    opciones: [
      { id: "a", texto: "1", es_correcta: true },
      { id: "b", texto: "17", es_correcta: false },
      { id: "c", texto: "−1", es_correcta: false },
      { id: "d", texto: "7", es_correcta: false },
    ],
  },
  {
    id: "ft2",
    tipo: "multiple_choice",
    texto:
      "Sea f(x) = { x² + 1 si x < 0 ; 2x − 3 si x ≥ 0 }. ¿Cuál es el valor de f(−2) + f(3)?",
    puntaje: 10,
    opciones: [
      { id: "a", texto: "5", es_correcta: false },
      { id: "b", texto: "8", es_correcta: true },
      { id: "c", texto: "6", es_correcta: false },
      { id: "d", texto: "10", es_correcta: false },
    ],
  },
  {
    id: "ft3",
    tipo: "desarrollo",
    texto:
      "Dadas f(x) = x² − 4x + 3 y g(x) = x + 1, hallá la expresión de (f ∘ g)(x), simplificala y determiná sus raíces. Mostrá todo el procedimiento.",
    puntaje: 10,
    opciones: [],
    respuestaModelo:
      "(f ∘ g)(x) = f(g(x)) = (x+1)² − 4(x+1) + 3 = x² + 2x + 1 − 4x − 4 + 3 = x² − 2x. Raíces: x(x−2) = 0, x = 0 o x = 2.",
  },
  {
    id: "ft4",
    tipo: "multiple_choice",
    texto:
      "La función f(x) = √(6 − x − x²) tiene como dominio el intervalo:",
    puntaje: 10,
    opciones: [
      { id: "a", texto: "[−3, 2]", es_correcta: true },
      { id: "b", texto: "(−3, 2)", es_correcta: false },
      { id: "c", texto: "[−2, 3]", es_correcta: false },
      { id: "d", texto: "ℝ − {−3, 2}", es_correcta: false },
    ],
  },
  {
    id: "ft5",
    tipo: "multiple_choice",
    texto:
      "Si f(x) = (x − 1)/(x + 2) y g(x) = 2x + 5, entonces g(f(0)) es igual a:",
    puntaje: 10,
    opciones: [
      { id: "a", texto: "4", es_correcta: true },
      { id: "b", texto: "5", es_correcta: false },
      { id: "c", texto: "3", es_correcta: false },
      { id: "d", texto: "−1", es_correcta: false },
    ],
  },
  {
    id: "ft6",
    tipo: "desarrollo",
    texto:
      "Demostrá que la función f(x) = x³ − x es impar. Escribí la definición de función impar y verificala paso a paso para esta función.",
    puntaje: 10,
    opciones: [],
    respuestaModelo:
      "Una función es impar si f(−x) = −f(x) para todo x. f(−x) = (−x)³ − (−x) = −x³ + x = −(x³ − x) = −f(x). Queda demostrado.",
  },
  {
    id: "ft7",
    tipo: "multiple_choice",
    texto:
      "Sea h(x) = { |x − 1| si x ≤ 2 ; x² − 3 si x > 2 }. La función h es continua en x = 2 y h(2) vale:",
    puntaje: 10,
    opciones: [
      { id: "a", texto: "1", es_correcta: true },
      { id: "b", texto: "2", es_correcta: false },
      { id: "c", texto: "0", es_correcta: false },
      { id: "d", texto: "La función no es continua en x = 2", es_correcta: false },
    ],
  },
  {
    id: "ft8",
    tipo: "desarrollo",
    texto:
      "Dada f(x) = (2x + 1)/(x − 3), determiná: a) el dominio y la imagen de f, b) las asíntotas horizontales y verticales, c) si existe algún valor de x tal que f(x) = 2. Justificá cada paso.",
    puntaje: 10,
    opciones: [],
    respuestaModelo:
      "a) Dom f = ℝ − {3}; Im f = ℝ − {2}. b) Asíntota vertical: x = 3; horizontal: y = 2. c) 2 = (2x+1)/(x−3) → 2(x−3) = 2x+1 → 2x−6 = 2x+1 → −6 = 1. Absurdo, no existe tal x.",
  },
  {
    id: "ft9",
    tipo: "multiple_choice",
    texto:
      "Si f(x) = x² − 1 y g(x) = √(x + 1), el dominio de (g ∘ f)(x) es:",
    puntaje: 10,
    opciones: [
      { id: "a", texto: "Todos los reales", es_correcta: true },
      { id: "b", texto: "x ≥ 0", es_correcta: false },
      { id: "c", texto: "x ≥ 1", es_correcta: false },
      { id: "d", texto: "x ≥ −1", es_correcta: false },
    ],
  },
  {
    id: "ft10",
    tipo: "multiple_choice",
    texto:
      "Dada f(x) = 3|2x − 4| − 6, el conjunto de valores de x que satisfacen f(x) ≤ 0 es:",
    puntaje: 10,
    opciones: [
      { id: "a", texto: "[1, 3]", es_correcta: true },
      { id: "b", texto: "(1, 3)", es_correcta: false },
      { id: "c", texto: "[0, 4]", es_correcta: false },
      { id: "d", texto: "{1, 3}", es_correcta: false },
    ],
  },
]

const MAX_CARACTERES = 500

function evaluarItem(
  pregunta: PreguntaFT,
  respuesta: string | null,
): ResultadoItem {
  if (pregunta.tipo === "multiple_choice") {
    const opcion = pregunta.opciones.find((o) => o.id === respuesta)
    const correcta = opcion?.es_correcta ?? false
    return {
      preguntaId: pregunta.id,
      esCorrecta: correcta,
      puntajeObtenido: correcta ? pregunta.puntaje : 0,
      puntajeMaximo: pregunta.puntaje,
    }
  }
  const tieneRespuesta = respuesta != null && respuesta.trim().length > 0
  return {
    preguntaId: pregunta.id,
    esCorrecta: tieneRespuesta,
    puntajeObtenido: tieneRespuesta ? 7 : 0,
    puntajeMaximo: pregunta.puntaje,
  }
}

export function FastTrackAlumno() {
  const navigate = useNavigate()
  const { token } = useParams()
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [seleccion, setSeleccion] = useState<string | null>(null)
  const [textoDesarrollo, setTextoDesarrollo] = useState("")
  const [finalizado, setFinalizado] = useState(false)
  const [resultados, setResultados] = useState<Record<string, ResultadoItem>>(
    {},
  )
  const [timerKey, setTimerKey] = useState(0)

  const pregunta = preguntasMock[preguntaActual]
  const total = preguntasMock.length
  const progreso = ((preguntaActual + 1) / total) * 100

  const handleTimeUp = useCallback(() => {
    setResultados((prev) => {
      const nuevos = { ...prev }
      preguntasMock.forEach((p) => {
        if (!nuevos[p.id]) {
          nuevos[p.id] = evaluarItem(p, null)
        }
      })
      return nuevos
    })
    setFinalizado(true)
  }, [])

  const handleSiguiente = () => {
    const respuestaActual =
      pregunta.tipo === "desarrollo" ? textoDesarrollo : seleccion
    if (pregunta.tipo === "multiple_choice" && !respuestaActual) return

    const resultado = evaluarItem(pregunta, respuestaActual)
    const nuevosResultados = { ...resultados, [pregunta.id]: resultado }
    setResultados(nuevosResultados)

    if (preguntaActual < total - 1) {
      setPreguntaActual(preguntaActual + 1)
      setSeleccion(null)
      setTextoDesarrollo("")
    } else {
      setFinalizado(true)
    }
  }

  const handleCancelar = () => {
    navigate(`/eval/${token}`)
  }

  const handleReintentar = () => {
    setPreguntaActual(0)
    setSeleccion(null)
    setTextoDesarrollo("")
    setFinalizado(false)
    setResultados({})
    setTimerKey((k) => k + 1)
  }

  const puntajeTotal = preguntasMock.reduce((s, p) => s + p.puntaje, 0)

  if (finalizado) {
    const puntajeObtenido = Object.values(resultados).reduce(
      (s, r) => s + r.puntajeObtenido,
      0,
    )
    const correctas = Object.values(resultados).filter(
      (r) => r.esCorrecta,
    ).length
    const porcentaje = Math.round((puntajeObtenido / puntajeTotal) * 100)
    const aprobado = porcentaje >= 60

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12 space-y-6">
          <div className="text-center space-y-4">
            <div
              className={cn(
                "inline-flex h-20 w-20 items-center justify-center rounded-full",
                aprobado
                  ? "bg-emerald-100 dark:bg-emerald-900/30"
                  : "bg-amber-100 dark:bg-amber-900/30",
              )}
            >
              {aprobado ? (
                <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <XCircle className="h-10 w-10 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <h2 className="text-2xl font-bold">¡Fast Track completado!</h2>
            <p className="text-muted-foreground">
              Matemática — Funciones · 3° A
            </p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="pt-6 space-y-5">
              <div className="text-center">
                <p className="text-6xl font-extrabold text-primary">
                  {puntajeObtenido}
                  <span className="text-2xl text-muted-foreground font-normal">
                    /{puntajeTotal}
                  </span>
                </p>
                <p className="text-muted-foreground mt-2">
                  {porcentaje}% de acierto
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {correctas}
                  </p>
                  <p className="text-xs text-muted-foreground">Correctas</p>
                </div>
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-center">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {total - correctas}
                  </p>
                  <p className="text-xs text-muted-foreground">Incorrectas</p>
                </div>
              </div>

              <Badge
                variant={aprobado ? "default" : "destructive"}
                className="w-full justify-center py-2.5 text-sm"
              >
                {aprobado ? "Aprobado" : "Necesitás seguir practicando"}
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Detalle por pregunta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {preguntasMock.map((p, i) => {
                const r = resultados[p.id]
                return (
                  <div
                    key={p.id}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-3",
                      r?.esCorrecta
                        ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10"
                        : "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10",
                    )}
                  >
                    <div className="pt-0.5">
                      {r?.esCorrecta ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {i + 1}. {p.texto}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {p.tipo === "multiple_choice"
                          ? "Opción múltiple"
                          : "Desarrollo"}
                      </p>
                    </div>
                    <Badge
                      variant={r?.esCorrecta ? "default" : "destructive"}
                      className="shrink-0"
                    >
                      {r?.puntajeObtenido ?? 0}/{p.puntaje}
                    </Badge>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={handleReintentar}
            >
              <RotateCcw className="h-4 w-4" />
              Volver a practicar
            </Button>
            <Button
              size="lg"
              className="gap-2"
              onClick={() => navigate(`/evaluacion/${token}`)}
            >
              <BookOpen className="h-4 w-4" />
              Ir a Evaluación Formal
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const tieneRespuesta =
    pregunta.tipo === "desarrollo"
      ? textoDesarrollo.trim().length > 0
      : seleccion !== null

  const puntajeAcumulado = Object.values(resultados).reduce(
    (s, r) => s + r.puntajeObtenido,
    0,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b">
        <div className="mx-auto max-w-5xl px-4 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900/30 p-1.5">
                <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="font-semibold text-sm">Fast Track</span>
              <Badge variant="secondary" className="text-xs">
                Práctica
              </Badge>
            </div>
            <span className="text-sm font-medium">
              Pregunta {preguntaActual + 1} de {total}
            </span>
          </div>
          <TimerBar
            key={timerKey}
            duracionMinutos={15}
            onTimeUp={handleTimeUp}
          />
          <Progress value={progreso} className="h-2" />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex gap-6">
          {/* Main question area */}
          <div className="flex-1 min-w-0 space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">Pregunta {preguntaActual + 1}</Badge>
                  <Badge variant="secondary">
                    {pregunta.tipo === "multiple_choice"
                      ? "Opción múltiple"
                      : "Desarrollo"}
                  </Badge>
                  <Badge variant="secondary" className="ml-auto">
                    {pregunta.puntaje} pts
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-3 leading-relaxed">
                  {pregunta.texto}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pregunta.tipo === "multiple_choice" ? (
                  <div className="space-y-3">
                    {pregunta.opciones.map((opcion) => (
                      <button
                        key={opcion.id}
                        onClick={() => setSeleccion(opcion.id)}
                        className={cn(
                          "w-full text-left rounded-xl border-2 p-4 transition-all flex items-center gap-4",
                          seleccion === opcion.id
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/40 hover:bg-accent/50",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                            seleccion === opcion.id
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/30",
                          )}
                        >
                          {seleccion === opcion.id && (
                            <div className="h-3 w-3 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-sm font-medium">
                          {opcion.texto}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Escribí tu respuesta acá..."
                      rows={6}
                      value={textoDesarrollo}
                      onChange={(e) => {
                        if (e.target.value.length <= MAX_CARACTERES) {
                          setTextoDesarrollo(e.target.value)
                        }
                      }}
                      className="resize-none text-sm"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Corrección simulada por IA: 7/10 si respondés, 0 si
                        dejás en blanco.
                      </span>
                      <span
                        className={cn(
                          "text-xs tabular-nums",
                          textoDesarrollo.length > MAX_CARACTERES * 0.9
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-muted-foreground",
                        )}
                      >
                        {textoDesarrollo.length}/{MAX_CARACTERES}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={handleCancelar}
              >
                <X className="h-4 w-4" />
                Cancelar Fast Track
              </Button>

              <Button
                size="lg"
                className="gap-2 min-w-[140px]"
                disabled={
                  pregunta.tipo === "multiple_choice" ? !tieneRespuesta : false
                }
                onClick={handleSiguiente}
              >
                {preguntaActual < total - 1 ? (
                  <>
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </>
                ) : (
                  "Finalizar"
                )}
              </Button>
            </div>
          </div>

          {/* Live results sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-[140px]">
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Resultados en vivo
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {Object.keys(resultados).length}/{total} respondidas ·{" "}
                    {puntajeAcumulado} pts
                  </p>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {preguntasMock.map((p, i) => {
                    const r = resultados[p.id]
                    const estaActiva = i === preguntaActual
                    return (
                      <div
                        key={p.id}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                          estaActiva && !r
                            ? "bg-primary/10 font-medium"
                            : r
                              ? r.esCorrecta
                                ? "bg-emerald-50 dark:bg-emerald-900/10"
                                : "bg-red-50 dark:bg-red-900/10"
                              : "opacity-50",
                        )}
                      >
                        <span className="w-5 text-center font-mono text-xs">
                          {i + 1}
                        </span>
                        {r ? (
                          <>
                            {r.esCorrecta ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                            )}
                            <span
                              className={cn(
                                "ml-auto text-xs font-semibold tabular-nums",
                                r.esCorrecta
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-red-600 dark:text-red-400",
                              )}
                            >
                              {r.puntajeObtenido}/{r.puntajeMaximo}
                            </span>
                          </>
                        ) : estaActiva ? (
                          <span className="text-xs text-primary">
                            En curso…
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Pendiente
                          </span>
                        )}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
