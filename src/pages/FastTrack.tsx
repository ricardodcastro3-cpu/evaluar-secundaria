import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Zap, ChevronRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TimerBar } from "@/components/TimerBar"
import { cn } from "@/lib/utils"

const preguntasMock = [
  {
    id: "p1",
    texto: "¿Quién fue el primer presidente de la Primera Junta de Gobierno?",
    opciones: [
      { id: "a", texto: "Cornelio Saavedra", es_correcta: true },
      { id: "b", texto: "Mariano Moreno", es_correcta: false },
      { id: "c", texto: "Manuel Belgrano", es_correcta: false },
      { id: "d", texto: "Juan José Castelli", es_correcta: false },
    ],
  },
  {
    id: "p2",
    texto: "¿En qué año se produjo la Revolución de Mayo?",
    opciones: [
      { id: "a", texto: "1816", es_correcta: false },
      { id: "b", texto: "1810", es_correcta: true },
      { id: "c", texto: "1806", es_correcta: false },
      { id: "d", texto: "1820", es_correcta: false },
    ],
  },
  {
    id: "p3",
    texto: "¿Qué se pedía en el Cabildo Abierto del 22 de mayo?",
    opciones: [
      { id: "a", texto: "La independencia de España", es_correcta: false },
      { id: "b", texto: "La destitución del Virrey Cisneros", es_correcta: true },
      { id: "c", texto: "La creación de un ejército", es_correcta: false },
      { id: "d", texto: "La abolición de la esclavitud", es_correcta: false },
    ],
  },
  {
    id: "p4",
    texto: "¿Cuál era el periódico fundado por Mariano Moreno?",
    opciones: [
      { id: "a", texto: "La Nación", es_correcta: false },
      { id: "b", texto: "El Telégrafo Mercantil", es_correcta: false },
      { id: "c", texto: "La Gazeta de Buenos Ayres", es_correcta: true },
      { id: "d", texto: "El Correo de Comercio", es_correcta: false },
    ],
  },
  {
    id: "p5",
    texto: "¿Cuántos miembros tenía la Primera Junta?",
    opciones: [
      { id: "a", texto: "7", es_correcta: false },
      { id: "b", texto: "9", es_correcta: true },
      { id: "c", texto: "5", es_correcta: false },
      { id: "d", texto: "12", es_correcta: false },
    ],
  },
]

export function FastTrack() {
  const navigate = useNavigate()
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [respuestas, setRespuestas] = useState<Record<string, string>>({})
  const [seleccion, setSeleccion] = useState<string | null>(null)
  const [mostrarResultado, setMostrarResultado] = useState(false)
  const [finalizado, setFinalizado] = useState(false)

  const pregunta = preguntasMock[preguntaActual]
  const progreso = ((preguntaActual + 1) / preguntasMock.length) * 100

  const handleSeleccionar = (opcionId: string) => {
    if (mostrarResultado) return
    setSeleccion(opcionId)
  }

  const handleConfirmar = () => {
    if (!seleccion) return

    if (!mostrarResultado) {
      setMostrarResultado(true)
      setRespuestas({ ...respuestas, [pregunta.id]: seleccion })
      return
    }

    if (preguntaActual < preguntasMock.length - 1) {
      setPreguntaActual(preguntaActual + 1)
      setSeleccion(null)
      setMostrarResultado(false)
    } else {
      setFinalizado(true)
    }
  }

  const correctas = Object.entries(respuestas).filter(([pId, oId]) => {
    const p = preguntasMock.find((q) => q.id === pId)
    return p?.opciones.find((o) => o.id === oId)?.es_correcta
  }).length

  if (finalizado) {
    const nota = Math.round((correctas / preguntasMock.length) * 10)
    return (
      <div className="max-w-lg mx-auto space-y-6 py-8">
        <div className="text-center space-y-4">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">¡FastTrack completado!</h2>
          <p className="text-muted-foreground">
            Revolución de Mayo - Historia
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="text-center">
              <p className="text-5xl font-bold text-primary">{nota}</p>
              <p className="text-muted-foreground mt-1">Tu nota</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3">
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {correctas}
                </p>
                <p className="text-xs text-muted-foreground">Correctas</p>
              </div>
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3">
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {preguntasMock.length - correctas}
                </p>
                <p className="text-xs text-muted-foreground">Incorrectas</p>
              </div>
            </div>
            <Badge
              variant={nota >= 6 ? "default" : "destructive"}
              className="w-full justify-center py-2 text-sm"
            >
              {nota >= 6 ? "Aprobado" : "Desaprobado"}
            </Badge>
          </CardContent>
        </Card>

        <Button
          className="w-full"
          onClick={() => navigate("/alumno")}
        >
          Volver al Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-amber-100 dark:bg-amber-900/30 p-2">
          <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold">FastTrack - Revolución de Mayo</h2>
          <p className="text-sm text-muted-foreground">Historia · 2° B</p>
        </div>
      </div>

      <TimerBar duracionMinutos={15} onTimeUp={() => setFinalizado(true)} />

      <div className="flex items-center gap-3">
        <Progress value={progreso} className="flex-1 h-2" />
        <span className="text-sm font-medium text-muted-foreground">
          {preguntaActual + 1}/{preguntasMock.length}
        </span>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">Pregunta {preguntaActual + 1}</Badge>
          </div>
          <CardTitle className="text-lg mt-2">{pregunta.texto}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pregunta.opciones.map((opcion) => {
            const esSeleccionada = seleccion === opcion.id
            const esCorrecta = opcion.es_correcta

            let estiloExtra = ""
            if (mostrarResultado) {
              if (esCorrecta)
                estiloExtra =
                  "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
              else if (esSeleccionada && !esCorrecta)
                estiloExtra =
                  "border-red-500 bg-red-50 dark:bg-red-900/20"
            }

            return (
              <button
                key={opcion.id}
                onClick={() => handleSeleccionar(opcion.id)}
                disabled={mostrarResultado}
                className={cn(
                  "w-full text-left rounded-lg border-2 p-4 transition-all",
                  estiloExtra ||
                    (esSeleccionada
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-accent/50"),
                  mostrarResultado && "cursor-default",
                )}
              >
                <span className="text-sm font-medium">{opcion.texto}</span>
              </button>
            )
          })}
        </CardContent>
      </Card>

      <Button
        className="w-full gap-2"
        size="lg"
        disabled={!seleccion}
        onClick={handleConfirmar}
      >
        {mostrarResultado ? (
          preguntaActual < preguntasMock.length - 1 ? (
            <>
              Siguiente <ChevronRight className="h-4 w-4" />
            </>
          ) : (
            "Ver Resultado"
          )
        ) : (
          "Confirmar Respuesta"
        )}
      </Button>
    </div>
  )
}
