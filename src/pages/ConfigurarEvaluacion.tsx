import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Save, Sparkles, FileText, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertMessage } from "@/components/AlertMessage"
import { useEvaluacionStore } from "@/store/evaluacionStore"
import type { Evaluacion, TipoEvaluacion, NivelDificultad } from "@/types"

const materias = [
  "Matemática",
  "Lengua y Literatura",
  "Historia",
  "Geografía",
  "Biología",
  "Física",
  "Química",
  "Inglés",
  "Educación Cívica",
  "Tecnología",
]

const cursos = ["1°", "2°", "3°", "4°", "5°", "6°"]
const divisiones = ["A", "B", "C", "D"]

export function ConfigurarEvaluacion() {
  const navigate = useNavigate()
  const { agregarEvaluacion } = useEvaluacionStore()
  const [saved, setSaved] = useState(false)

  const [tipo, setTipo] = useState<TipoEvaluacion>("formal")
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [materia, setMateria] = useState("")
  const [curso, setCurso] = useState("")
  const [division, setDivision] = useState("")
  const [duracion, setDuracion] = useState(tipo === "fasttrack" ? "15" : "60")
  const [cantidadPreguntas, setCantidadPreguntas] = useState(
    tipo === "fasttrack" ? "5" : "10",
  )
  const [dificultad, setDificultad] = useState<NivelDificultad>("medio")
  const [temas, setTemas] = useState("")
  const [notaAprobacion, setNotaAprobacion] = useState("60")
  const [mezclarPreguntas, setMezclarPreguntas] = useState(true)
  const [mezclarOpciones, setMezclarOpciones] = useState(true)
  const [resultadoInmediato, setResultadoInmediato] = useState(false)

  const handleTipoChange = (nuevoTipo: string) => {
    const t = nuevoTipo as TipoEvaluacion
    setTipo(t)
    if (t === "fasttrack") {
      setDuracion("15")
      setCantidadPreguntas("5")
      setResultadoInmediato(true)
    } else {
      setDuracion("60")
      setCantidadPreguntas("10")
      setResultadoInmediato(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const nuevaEvaluacion: Evaluacion = {
      id: `eval-${Date.now()}`,
      titulo,
      descripcion,
      tipo,
      estado: "borrador",
      materia,
      curso,
      division,
      docente_id: "doc-1",
      duracion_minutos: parseInt(duracion),
      preguntas: [],
      cantidad_preguntas: parseInt(cantidadPreguntas),
      puntaje_total: parseInt(cantidadPreguntas) * 10,
      nota_aprobacion: parseInt(notaAprobacion),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    agregarEvaluacion(nuevaEvaluacion)
    setSaved(true)
    setTimeout(() => navigate("/docente"), 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Configurar Evaluación
          </h2>
          <p className="text-muted-foreground">
            Creá una nueva evaluación para tus alumnos
          </p>
        </div>
      </div>

      {saved && (
        <AlertMessage
          tipo="success"
          titulo="¡Evaluación creada!"
          mensaje="La evaluación se guardó como borrador. Redirigiendo al dashboard..."
        />
      )}

      <form onSubmit={handleSubmit}>
        <Tabs
          value={tipo}
          onValueChange={handleTipoChange}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="formal" className="gap-2">
              <FileText className="h-4 w-4" />
              Formal
            </TabsTrigger>
            <TabsTrigger value="fasttrack" className="gap-2">
              <Zap className="h-4 w-4" />
              FastTrack
            </TabsTrigger>
          </TabsList>

          <TabsContent value="formal" className="mt-0">
            <AlertMessage
              tipo="info"
              mensaje="La evaluación formal permite preguntas de desarrollo, multiple choice y más. Ideal para parciales y exámenes."
            />
          </TabsContent>
          <TabsContent value="fasttrack" className="mt-0">
            <AlertMessage
              tipo="info"
              mensaje="FastTrack es una evaluación rápida con preguntas de opción múltiple. Ideal para repasos y evaluaciones diarias."
            />
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 lg:grid-cols-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>
                Datos básicos de la evaluación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  placeholder="Ej: Parcial de Matemática - Funciones"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Descripción opcional de la evaluación..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Materia *</Label>
                <Select value={materia} onValueChange={(v) => v && setMateria(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná una materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {materias.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Curso *</Label>
                  <Select value={curso} onValueChange={(v) => v && setCurso(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {cursos.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>División *</Label>
                  <Select
                    value={division}
                    onValueChange={(v) => v && setDivision(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Div." />
                    </SelectTrigger>
                    <SelectContent>
                      {divisiones.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temas">
                  Temas a evaluar{" "}
                  <span className="text-muted-foreground font-normal">
                    (separados por coma)
                  </span>
                </Label>
                <Input
                  id="temas"
                  placeholder="Ej: funciones lineales, cuadráticas, dominio"
                  value={temas}
                  onChange={(e) => setTemas(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
              <CardDescription>
                Parámetros de la evaluación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duracion">Duración (minutos)</Label>
                  <Input
                    id="duracion"
                    type="number"
                    min="5"
                    max="180"
                    value={duracion}
                    onChange={(e) => setDuracion(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preguntas">Cant. Preguntas</Label>
                  <Input
                    id="preguntas"
                    type="number"
                    min="1"
                    max="50"
                    value={cantidadPreguntas}
                    onChange={(e) => setCantidadPreguntas(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dificultad</Label>
                <Select
                  value={dificultad}
                  onValueChange={(v) =>
                    setDificultad(v as NivelDificultad)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facil">Fácil</SelectItem>
                    <SelectItem value="medio">Medio</SelectItem>
                    <SelectItem value="dificil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nota">Nota de aprobación (%)</Label>
                <Input
                  id="nota"
                  type="number"
                  min="1"
                  max="100"
                  value={notaAprobacion}
                  onChange={(e) => setNotaAprobacion(e.target.value)}
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mezclar preguntas</Label>
                    <p className="text-xs text-muted-foreground">
                      Orden aleatorio para cada alumno
                    </p>
                  </div>
                  <Switch
                    checked={mezclarPreguntas}
                    onCheckedChange={setMezclarPreguntas}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mezclar opciones</Label>
                    <p className="text-xs text-muted-foreground">
                      Opciones en distinto orden
                    </p>
                  </div>
                  <Switch
                    checked={mezclarOpciones}
                    onCheckedChange={setMezclarOpciones}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Resultado inmediato</Label>
                    <p className="text-xs text-muted-foreground">
                      Mostrar nota al finalizar
                    </p>
                  </div>
                  <Switch
                    checked={resultadoInmediato}
                    onCheckedChange={setResultadoInmediato}
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 mt-2"
                disabled
              >
                <Sparkles className="h-4 w-4" />
                Generar preguntas con IA
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  Próximamente
                </Badge>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Guardar Evaluación
          </Button>
        </div>
      </form>
    </div>
  )
}
