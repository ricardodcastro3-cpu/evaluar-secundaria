import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Send,
  ShieldAlert,
  AlertTriangle,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { TimerBar } from "@/components/TimerBar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface Opcion {
  id: string
  texto: string
  es_correcta: boolean
}

interface PreguntaFormal {
  id: string
  tipo: "multiple_choice" | "verdadero_falso" | "desarrollo"
  texto: string
  opciones: Opcion[]
  puntaje: number
}

const preguntasFormal: PreguntaFormal[] = [
  {
    id: "f1",
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
    id: "f2",
    tipo: "verdadero_falso",
    texto: "La función f(x) = x² es una función par.",
    puntaje: 10,
    opciones: [
      { id: "v", texto: "Verdadero", es_correcta: true },
      { id: "f", texto: "Falso", es_correcta: false },
    ],
  },
  {
    id: "f3",
    tipo: "desarrollo",
    texto:
      'Dada la función f(x) = x² − 6x + 8, encontrá: a) las raíces, b) el vértice, c) si abre hacia arriba o abajo. Justificá cada paso.',
    puntaje: 20,
    opciones: [],
  },
  {
    id: "f4",
    tipo: "multiple_choice",
    texto: "Si f(x) = 2x + 1 y g(x) = x − 3, entonces (f ∘ g)(x) es:",
    puntaje: 10,
    opciones: [
      { id: "a", texto: "2x − 5", es_correcta: true },
      { id: "b", texto: "2x − 2", es_correcta: false },
      { id: "c", texto: "2x + 4", es_correcta: false },
      { id: "d", texto: "x − 1", es_correcta: false },
    ],
  },
  {
    id: "f5",
    tipo: "multiple_choice",
    texto: "La pendiente de la recta que pasa por los puntos (1, 3) y (4, 9) es:",
    puntaje: 10,
    opciones: [
      { id: "a", texto: "1", es_correcta: false },
      { id: "b", texto: "2", es_correcta: true },
      { id: "c", texto: "3", es_correcta: false },
      { id: "d", texto: "6", es_correcta: false },
    ],
  },
  {
    id: "f6",
    tipo: "verdadero_falso",
    texto: "Toda función lineal tiene exactamente una raíz.",
    puntaje: 10,
    opciones: [
      { id: "v", texto: "Verdadero", es_correcta: false },
      { id: "f", texto: "Falso", es_correcta: true },
    ],
  },
  {
    id: "f7",
    tipo: "desarrollo",
    texto:
      "Explicá la diferencia entre dominio e imagen de una función. Dá un ejemplo de una función cuyo dominio no sean todos los reales, y justificá por qué.",
    puntaje: 20,
    opciones: [],
  },
  {
    id: "f8",
    tipo: "multiple_choice",
    texto: "El vértice de la parábola f(x) = (x − 4)² − 1 es:",
    puntaje: 10,
    opciones: [
      { id: "a", texto: "(4, −1)", es_correcta: true },
      { id: "b", texto: "(−4, −1)", es_correcta: false },
      { id: "c", texto: "(4, 1)", es_correcta: false },
      { id: "d", texto: "(−4, 1)", es_correcta: false },
    ],
  },
]

const MAX_CARACTERES = 800

export function EvaluacionFormalAlumno() {
  const navigate = useNavigate()
  const { token } = useParams()
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [respuestas, setRespuestas] = useState<Record<string, string>>({})
  const [showConfirm, setShowConfirm] = useState(false)
  const [tabWarnings, setTabWarnings] = useState<string[]>([])
  const [showTabWarning, setShowTabWarning] = useState(false)
  const tabWarningTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pregunta = preguntasFormal[preguntaActual]
  const total = preguntasFormal.length
  const progreso = ((preguntaActual + 1) / total) * 100
  const respondidas = Object.keys(respuestas).length

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        const now = new Date().toLocaleTimeString("es-AR")
        setTabWarnings((prev) => [...prev, now])
        setShowTabWarning(true)
        if (tabWarningTimeout.current) clearTimeout(tabWarningTimeout.current)
        tabWarningTimeout.current = setTimeout(
          () => setShowTabWarning(false),
          5000,
        )
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility)
      if (tabWarningTimeout.current) clearTimeout(tabWarningTimeout.current)
    }
  }, [])

  const handleTimeUp = useCallback(() => {
    navigate(`/resultado/${token}`)
  }, [navigate, token])

  const handleSeleccion = (opcionId: string) => {
    setRespuestas({ ...respuestas, [pregunta.id]: opcionId })
  }

  const handleDesarrollo = (texto: string) => {
    if (texto.length <= MAX_CARACTERES) {
      setRespuestas({ ...respuestas, [pregunta.id]: texto })
    }
  }

  const handleEntregar = () => {
    setShowConfirm(false)
    navigate(`/resultado/${token}`)
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Banner rojo superior */}
      <div className="bg-red-600 dark:bg-red-800 text-white">
        <div className="mx-auto max-w-3xl px-4 py-2.5 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <p className="text-sm font-semibold text-center">
              EVALUACIÓN FORMAL — No se puede pausar ni reiniciar
            </p>
          </div>
          <p className="text-xs text-red-200 text-center">
            Los resultados del Fast Track fueron borrados. Ya no podés volver a practicar.
          </p>
        </div>
      </div>

      {/* Tab change warning */}
      {showTabWarning && (
        <div className="bg-amber-500 dark:bg-amber-600 text-white animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="mx-auto max-w-3xl px-4 py-2.5 flex items-center justify-center gap-2">
            <Eye className="h-4 w-4 shrink-0" />
            <p className="text-sm font-semibold">
              Se registró que saliste de la evaluación
            </p>
          </div>
        </div>
      )}

      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-background/90 dark:bg-background/85 backdrop-blur-md border-b border-[#E5E7EB] dark:border-border">
        <div className="mx-auto max-w-3xl px-4 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-[#7C3AED]/12 ring-1 ring-[#7C3AED]/15 p-1.5">
                <BookOpen className="h-4 w-4 text-[#7C3AED]" strokeWidth={2.25} />
              </div>
              <span className="font-semibold text-sm">
                Parcial de Matemática - Funciones
              </span>
            </div>
            <div className="flex items-center gap-2">
              {tabWarnings.length > 0 && (
                <Badge
                  variant="destructive"
                  className="text-xs gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  {tabWarnings.length} salida{tabWarnings.length > 1 ? "s" : ""}
                </Badge>
              )}
              <span className="text-sm font-medium">
                {preguntaActual + 1}/{total}
              </span>
            </div>
          </div>
          <TimerBar duracionMinutos={60} onTimeUp={handleTimeUp} />
          <Progress value={progreso} className="h-2" />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Question navigator */}
        <div className="flex gap-2 flex-wrap">
          {preguntasFormal.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setPreguntaActual(i)}
              className={cn(
                "h-9 w-9 rounded-xl text-sm font-semibold transition-all",
                i === preguntaActual
                  ? "bg-gradient-to-br from-[#7C3AED] to-[#2563EB] text-white shadow-md shadow-[#7C3AED]/30"
                  : respuestas[p.id]
                    ? "bg-[#7C3AED]/15 text-[#6d28d9] dark:text-[#C4B5FD] ring-1 ring-[#7C3AED]/20"
                    : "bg-muted text-muted-foreground hover:bg-[#7C3AED]/8",
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Pregunta {preguntaActual + 1}</Badge>
              <Badge variant="secondary">
                {pregunta.tipo === "multiple_choice"
                  ? "Opción múltiple"
                  : pregunta.tipo === "verdadero_falso"
                    ? "Verdadero / Falso"
                    : "Desarrollo"}
              </Badge>
              <Badge variant="secondary" className="ml-auto">
                {pregunta.puntaje} pts
              </Badge>
            </div>
            <CardTitle className="text-lg mt-3">{pregunta.texto}</CardTitle>
          </CardHeader>
          <CardContent>
            {pregunta.tipo === "desarrollo" ? (
              <div className="space-y-2">
                <Textarea
                  placeholder="Escribí tu respuesta acá..."
                  rows={8}
                  value={respuestas[pregunta.id] || ""}
                  onChange={(e) => handleDesarrollo(e.target.value)}
                  className="resize-none text-sm"
                />
                <div className="flex justify-end">
                  <span
                    className={cn(
                      "text-xs",
                      (respuestas[pregunta.id]?.length ?? 0) >
                        MAX_CARACTERES * 0.9
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-muted-foreground",
                    )}
                  >
                    {respuestas[pregunta.id]?.length ?? 0}/{MAX_CARACTERES}{" "}
                    caracteres
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {pregunta.opciones.map((opcion) => (
                  <button
                    key={opcion.id}
                    onClick={() => handleSeleccion(opcion.id)}
                    className={cn(
                      "w-full text-left rounded-xl border-2 p-4 transition-all flex items-center gap-4",
                      respuestas[pregunta.id] === opcion.id
                        ? "border-[#7C3AED] bg-gradient-to-r from-[#7C3AED]/8 to-[#2563EB]/10 shadow-sm"
                        : "border-[#E5E7EB] hover:border-[#7C3AED]/45 hover:bg-[#7C3AED]/[0.04] dark:border-border",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        respuestas[pregunta.id] === opcion.id
                          ? "border-[#7C3AED] bg-gradient-to-br from-[#7C3AED] to-[#2563EB]"
                          : "border-muted-foreground/30",
                      )}
                    >
                      {respuestas[pregunta.id] === opcion.id && (
                        <div className="h-2.5 w-2.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{opcion.texto}</span>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled={preguntaActual === 0}
            onClick={() => setPreguntaActual(preguntaActual - 1)}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowConfirm(true)}
            className="gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/30"
          >
            <Send className="h-4 w-4" />
            Finalizar ({respondidas}/{total})
          </Button>

          {preguntaActual < total - 1 && (
            <Button
              onClick={() => setPreguntaActual(preguntaActual + 1)}
              className="gap-2"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          {preguntaActual === total - 1 && (
            <Button
              onClick={() => setShowConfirm(true)}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Finalizar
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation modal */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-2">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <DialogTitle>¿Estás seguro?</DialogTitle>
            </div>
            <DialogDescription className="space-y-3">
              <span className="block font-semibold text-red-600 dark:text-red-400">
                Esta acción es irreversible.
              </span>
              <span className="block">
                Respondiste {respondidas} de {total} preguntas.
                {respondidas < total && (
                  <span className="block mt-1 text-amber-600 dark:text-amber-400 font-medium">
                    Tenés {total - respondidas} pregunta
                    {total - respondidas > 1 ? "s" : ""} sin responder.
                  </span>
                )}
              </span>
              {tabWarnings.length > 0 && (
                <span className="block text-xs text-muted-foreground">
                  Se registraron {tabWarnings.length} salida
                  {tabWarnings.length > 1 ? "s" : ""} de la pestaña durante la
                  evaluación.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Seguir respondiendo
            </Button>
            <Button
              variant="destructive"
              onClick={handleEntregar}
            >
              Confirmar entrega
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
