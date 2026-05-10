import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Flag,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

const preguntasFormal = [
  {
    id: "f1",
    tipo: "multiple_choice" as const,
    texto:
      "Identificá cuál de las siguientes oraciones es compuesta coordinada:",
    opciones: [
      { id: "a", texto: "El sol brillaba y los pájaros cantaban.", es_correcta: true },
      { id: "b", texto: "Cuando llegué, ya habían salido.", es_correcta: false },
      { id: "c", texto: "La casa que compramos es grande.", es_correcta: false },
      { id: "d", texto: "Es importante que estudies.", es_correcta: false },
    ],
  },
  {
    id: "f2",
    tipo: "verdadero_falso" as const,
    texto:
      "Las oraciones subordinadas adjetivas cumplen la función de modificar a un sustantivo.",
    opciones: [
      { id: "v", texto: "Verdadero", es_correcta: true },
      { id: "f", texto: "Falso", es_correcta: false },
    ],
  },
  {
    id: "f3",
    tipo: "desarrollo" as const,
    texto:
      'Analizá sintácticamente la siguiente oración e identificá sujeto, predicado y sus modificadores: "Los alumnos de tercer año presentaron sus trabajos prácticos en la feria de ciencias."',
    opciones: [],
  },
  {
    id: "f4",
    tipo: "multiple_choice" as const,
    texto: '¿Qué tipo de subordinada contiene la oración "Quiero que vengas temprano"?',
    opciones: [
      { id: "a", texto: "Subordinada adjetiva", es_correcta: false },
      { id: "b", texto: "Subordinada sustantiva", es_correcta: true },
      { id: "c", texto: "Subordinada adverbial", es_correcta: false },
      { id: "d", texto: "Coordinada adversativa", es_correcta: false },
    ],
  },
  {
    id: "f5",
    tipo: "desarrollo" as const,
    texto:
      "Explicá la diferencia entre una oración compuesta coordinada y una subordinada. Dá un ejemplo de cada una.",
    opciones: [],
  },
]

export function EvaluacionFormal() {
  const navigate = useNavigate()
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [respuestas, setRespuestas] = useState<Record<string, string>>({})
  const [showConfirm, setShowConfirm] = useState(false)

  const pregunta = preguntasFormal[preguntaActual]
  const progreso = ((preguntaActual + 1) / preguntasFormal.length) * 100

  const respondidas = Object.keys(respuestas).length
  const totalPreguntas = preguntasFormal.length

  const handleSeleccion = (opcionId: string) => {
    setRespuestas({ ...respuestas, [pregunta.id]: opcionId })
  }

  const handleDesarrollo = (texto: string) => {
    setRespuestas({ ...respuestas, [pregunta.id]: texto })
  }

  const handleEntregar = () => {
    setShowConfirm(false)
    navigate("/alumno/resultado/eval-formal")
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-[#7C3AED]/12 ring-1 ring-[#7C3AED]/15 p-2">
          <BookOpen className="h-5 w-5 text-[#7C3AED]" strokeWidth={2.25} />
        </div>
        <div className="flex-1">
          <h2 className="font-heading text-lg font-bold text-[#0f172a] dark:text-foreground">
            Parcial de Lengua - Análisis Sintáctico
          </h2>
          <p className="text-sm text-muted-foreground">
            Lengua y Literatura · 4° A
          </p>
        </div>
      </div>

      <TimerBar duracionMinutos={60} />

      <div className="flex items-center gap-3">
        <Progress value={progreso} className="flex-1 h-2" />
        <span className="text-sm font-medium text-muted-foreground">
          {preguntaActual + 1}/{totalPreguntas}
        </span>
      </div>

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

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Pregunta {preguntaActual + 1}</Badge>
            <Badge variant="secondary">
              {pregunta.tipo === "multiple_choice"
                ? "Opción múltiple"
                : pregunta.tipo === "verdadero_falso"
                  ? "V / F"
                  : "Desarrollo"}
            </Badge>
          </div>
          <CardTitle className="text-lg mt-2">{pregunta.texto}</CardTitle>
        </CardHeader>
        <CardContent>
          {pregunta.tipo === "desarrollo" ? (
            <Textarea
              placeholder="Escribí tu respuesta acá..."
              rows={6}
              value={respuestas[pregunta.id] || ""}
              onChange={(e) => handleDesarrollo(e.target.value)}
              className="resize-none"
            />
          ) : (
            <div className="space-y-3">
              {pregunta.opciones.map((opcion) => (
                <button
                  key={opcion.id}
                  onClick={() => handleSeleccion(opcion.id)}
                  className={cn(
                    "w-full text-left rounded-xl border-2 p-4 transition-all",
                    respuestas[pregunta.id] === opcion.id
                      ? "border-[#7C3AED] bg-gradient-to-r from-[#7C3AED]/8 to-[#2563EB]/10 shadow-sm"
                      : "border-[#E5E7EB] hover:border-[#7C3AED]/45 hover:bg-[#7C3AED]/[0.04] dark:border-border",
                  )}
                >
                  <span className="text-sm font-medium">{opcion.texto}</span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
          className="gap-2 text-amber-600 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
        >
          <Flag className="h-4 w-4" />
          Entregar ({respondidas}/{totalPreguntas})
        </Button>

        {preguntaActual < totalPreguntas - 1 ? (
          <Button
            onClick={() => setPreguntaActual(preguntaActual + 1)}
            className="gap-2"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={() => setShowConfirm(true)}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Entregar
          </Button>
        )}
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Entregar evaluación?</DialogTitle>
            <DialogDescription>
              Respondiste {respondidas} de {totalPreguntas} preguntas.
              {respondidas < totalPreguntas && (
                <span className="block mt-1 text-amber-600 dark:text-amber-400">
                  Tenés {totalPreguntas - respondidas} preguntas sin
                  responder.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
            >
              Seguir respondiendo
            </Button>
            <Button onClick={handleEntregar}>Confirmar entrega</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
