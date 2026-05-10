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

const preguntasMock: PreguntaFT[] = [
  {
    id: "ft1",
    tipo: "multiple_choice",
    texto: "¿Cuál es el dominio de la función f(x) = √(x − 3)?",
    puntaje: 10,
    opciones: [
      { id: "a", texto: "x ≥ 3", es_correcta: true },
      { id: "b", texto: "x > 3", es_correcta: false },
      { id: "c", texto: "x ≥ 0", es_correcta: false },
      { id: "d", texto: "Todos los reales", es_correcta: false },
    ],
  },
  {
    id: "ft2",
    tipo: "multiple_choice",
    texto: "Si f(x) = 2x + 1, ¿cuánto vale f(4)?",
    puntaje: 10,
    opciones: [
      { id: "a", texto: "7", es_correcta: false },
      { id: "b", texto: "8", es_correcta: false },
      { id: "c", texto: "9", es_correcta: true },
      { id: "d", texto: "10", es_correcta: false },
    ],
  },
  {
    id: "ft3",
    tipo: "multiple_choice",
    texto: "¿Cuál de las siguientes es una función cuadrática?",
    puntaje: 10,
    opciones: [
      { id: "a", texto: "f(x) = 3x + 2", es_correcta: false },
      { id: "b", texto: "f(x) = x² − 4x + 3", es_correcta: true },
      { id: "c", texto: "f(x) = 1/x", es_correcta: false },
      { id: "d", texto: "f(x) = √x", es_correcta: false },
    ],
  },
  {
    id: "ft4",
    tipo: "desarrollo",
    texto: "Explicá con tus palabras qué es el dominio de una función y dá un ejemplo.",
    puntaje: 10,
    opciones: [],
    respuestaModelo:
      "El dominio de una función es el conjunto de todos los valores posibles de la variable independiente (x) para los cuales la función está definida.",
  },
  {
    id: "ft5",
    tipo: "multiple_choice",
    texto: "La imagen de f(x) = x² es:",
    puntaje: 10,
    opciones: [
      { id: "a", texto: "Todos los reales", es_correcta: false },
      { id: "b", texto: "y ≥ 0", es_correcta: true },
      { id: "c", texto: "y > 0", es_correcta: false },
      { id: "d", texto: "y ≤ 0", es_correcta: false },
    ],
  },
  {
    id: "ft6",
    tipo: "multiple_choice",
    texto: "¿Cuál es la pendiente de la recta y = −3x + 7?",
    puntaje: 10,
    opciones: [
      { id: "a", texto: "7", es_correcta: false },
      { id: "b", texto: "3", es_correcta: false },
      { id: "c", texto: "−3", es_correcta: true },
      { id: "d", texto: "−7", es_correcta: false },
    ],
  },
  {
    id: "ft7",
    tipo: "multiple_choice",
    texto: "El vértice de f(x) = (x − 2)² + 5 es:",
    puntaje: 10,
    opciones: [
      { id: "a", texto: "(2, 5)", es_correcta: true },
      { id: "b", texto: "(−2, 5)", es_correcta: false },
      { id: "c", texto: "(5, 2)", es_correcta: false },
      { id: "d", texto: "(2, −5)", es_correcta: false },
    ],
  },
  {
    id: "ft8",
    tipo: "desarrollo",
    texto: "Dada f(x) = x² − 4, encontrá las raíces de la función. Mostrá el procedimiento.",
    puntaje: 10,
    opciones: [],
    respuestaModelo: "x² − 4 = 0 → x² = 4 → x = ±2. Las raíces son x = 2 y x = −2.",
  },
  {
    id: "ft9",
    tipo: "multiple_choice",
    texto: "Si f(x) = x + 1 y g(x) = 2x, entonces f(g(3)) es:",
    puntaje: 10,
    opciones: [
      { id: "a", texto: "6", es_correcta: false },
      { id: "b", texto: "7", es_correcta: true },
      { id: "c", texto: "8", es_correcta: false },
      { id: "d", texto: "9", es_correcta: false },
    ],
  },
  {
    id: "ft10",
    tipo: "multiple_choice",
    texto: "Una función es par cuando:",
    puntaje: 10,
    opciones: [
      { id: "a", texto: "f(−x) = f(x) para todo x", es_correcta: true },
      { id: "b", texto: "f(−x) = −f(x) para todo x", es_correcta: false },
      { id: "c", texto: "f(0) = 0", es_correcta: false },
      { id: "d", texto: "Su gráfico pasa por el origen", es_correcta: false },
    ],
  },
]

const MAX_CARACTERES = 500

export function FastTrackAlumno() {
  const navigate = useNavigate()
  const { token } = useParams()
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [respuestas, setRespuestas] = useState<Record<string, string>>({})
  const [seleccion, setSeleccion] = useState<string | null>(null)
  const [textoDesarrollo, setTextoDesarrollo] = useState("")
  const [finalizado, setFinalizado] = useState(false)

  const pregunta = preguntasMock[preguntaActual]
  const total = preguntasMock.length
  const progreso = ((preguntaActual + 1) / total) * 100

  const handleTimeUp = useCallback(() => {
    setFinalizado(true)
  }, [])

  const handleSiguiente = () => {
    const respuestaActual =
      pregunta.tipo === "desarrollo" ? textoDesarrollo : seleccion
    if (!respuestaActual) return

    const nuevasRespuestas = { ...respuestas, [pregunta.id]: respuestaActual }
    setRespuestas(nuevasRespuestas)

    if (preguntaActual < total - 1) {
      const siguienteIdx = preguntaActual + 1
      setPreguntaActual(siguienteIdx)
      const sig = preguntasMock[siguienteIdx]
      setSeleccion(nuevasRespuestas[sig.id] || null)
      setTextoDesarrollo(
        sig.tipo === "desarrollo" ? (nuevasRespuestas[sig.id] || "") : "",
      )
    } else {
      setFinalizado(true)
    }
  }

  const handleCancelar = () => {
    navigate(`/eval/${token}`)
  }

  const calcularResultado = () => {
    let correctas = 0
    let puntajeObtenido = 0
    const detalles = preguntasMock.map((p) => {
      const resp = respuestas[p.id]
      if (p.tipo === "multiple_choice") {
        const opcionElegida = p.opciones.find((o) => o.id === resp)
        const esCorrecta = opcionElegida?.es_correcta ?? false
        if (esCorrecta) {
          correctas++
          puntajeObtenido += p.puntaje
        }
        return {
          ...p,
          respuestaDada: opcionElegida?.texto ?? "Sin respuesta",
          esCorrecta,
          puntajeObtenido: esCorrecta ? p.puntaje : 0,
        }
      }
      const tieneRespuesta = resp && resp.trim().length > 0
      const puntajeDes = tieneRespuesta ? Math.round(p.puntaje * 0.7) : 0
      if (tieneRespuesta) {
        correctas++
        puntajeObtenido += puntajeDes
      }
      return {
        ...p,
        respuestaDada: resp || "Sin respuesta",
        esCorrecta: tieneRespuesta,
        puntajeObtenido: puntajeDes,
      }
    })
    const puntajeTotal = preguntasMock.reduce((s, p) => s + p.puntaje, 0)
    return { correctas, puntajeObtenido, puntajeTotal, detalles }
  }

  if (finalizado) {
    const resultado = calcularResultado()
    const porcentaje = Math.round(
      (resultado.puntajeObtenido / resultado.puntajeTotal) * 100,
    )
    const aprobado = porcentaje >= 60

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12 space-y-6">
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
              Matemática - Funciones · 3° A
            </p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="pt-6 space-y-5">
              <div className="text-center">
                <p className="text-6xl font-extrabold text-primary">
                  {resultado.puntajeObtenido}
                  <span className="text-2xl text-muted-foreground font-normal">
                    /{resultado.puntajeTotal}
                  </span>
                </p>
                <p className="text-muted-foreground mt-2">
                  {porcentaje}% de acierto
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {resultado.correctas}
                  </p>
                  <p className="text-xs text-muted-foreground">Correctas</p>
                </div>
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-center">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {total - resultado.correctas}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => {
                setPreguntaActual(0)
                setRespuestas({})
                setSeleccion(null)
                setTextoDesarrollo("")
                setFinalizado(false)
              }}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b">
        <div className="mx-auto max-w-3xl px-4 py-3 space-y-3">
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
          <TimerBar duracionMinutos={15} onTimeUp={handleTimeUp} />
          <Progress value={progreso} className="h-2" />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
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
            <CardTitle className="text-lg mt-3">{pregunta.texto}</CardTitle>
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
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        seleccion === opcion.id
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30",
                      )}
                    >
                      {seleccion === opcion.id && (
                        <div className="h-2.5 w-2.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{opcion.texto}</span>
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
                <div className="flex justify-end">
                  <span
                    className={cn(
                      "text-xs",
                      textoDesarrollo.length > MAX_CARACTERES * 0.9
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-muted-foreground",
                    )}
                  >
                    {textoDesarrollo.length}/{MAX_CARACTERES} caracteres
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
            disabled={!tieneRespuesta}
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
    </div>
  )
}
