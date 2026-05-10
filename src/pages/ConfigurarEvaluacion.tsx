import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  FileText,
  FileSpreadsheet,
  File,
  X,
  Sparkles,
  Loader2,
  Eye,
  Link2,
  Copy,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const materias = [
  "Matemática", "Lengua y Literatura", "Historia", "Geografía",
  "Biología", "Física", "Química", "Inglés", "Educación Cívica",
  "Informática I", "Informática II", "Informática III",
  "Tecnología I", "Tecnología II", "Tecnología III",
]
const cursos = ["1°", "2°", "3°", "4°", "5°", "6°"]
const divisiones = ["A", "B", "C", "D"]
const turnos = ["Mañana", "Tarde", "Noche"]

interface ArchivoSubido {
  nombre: string
  tipo: string
  tamano: string
}

const steps = [
  { num: 1, label: "Datos básicos" },
  { num: 2, label: "Contenidos y generación" },
]

export function ConfigurarEvaluacion() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)

  const [nombre, setNombre] = useState("")
  const [materia, setMateria] = useState("")
  const [curso, setCurso] = useState("")
  const [division, setDivision] = useState("")
  const [turno, setTurno] = useState("")
  const [fecha, setFecha] = useState("")
  const [duracion, setDuracion] = useState("60")

  const [archivos, setArchivos] = useState<ArchivoSubido[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [puntajeTotal, setPuntajeTotal] = useState("100")
  const [puntajeAprobacion, setPuntajeAprobacion] = useState("60")
  const [cantidadPreguntas, setCantidadPreguntas] = useState("10")

  const [generando, setGenerando] = useState(false)
  const [generado, setGenerado] = useState(false)
  const [linkCopiado, setLinkCopiado] = useState(false)
  const [tokenGenerado] = useState(() => `eval-${Date.now().toString(36)}`)

  const linkAlumnos = `${window.location.origin}/eval/${tokenGenerado}`

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    const nuevos: ArchivoSubido[] = files.map((f) => ({
      nombre: f.name,
      tipo: f.name.split(".").pop()?.toUpperCase() ?? "FILE",
      tamano: f.size < 1024 * 1024
        ? `${(f.size / 1024).toFixed(1)} KB`
        : `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
    }))
    setArchivos((prev) => [...prev, ...nuevos])
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    const nuevos: ArchivoSubido[] = files.map((f) => ({
      nombre: f.name,
      tipo: f.name.split(".").pop()?.toUpperCase() ?? "FILE",
      tamano: f.size < 1024 * 1024
        ? `${(f.size / 1024).toFixed(1)} KB`
        : `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
    }))
    setArchivos((prev) => [...prev, ...nuevos])
  }

  const quitarArchivo = (index: number) => {
    setArchivos((prev) => prev.filter((_a, i) => i !== index))
  }

  const handleGenerar = () => {
    setGenerando(true)
    setTimeout(() => {
      setGenerando(false)
      setGenerado(true)
    }, 3000)
  }

  const handleCopiarLink = () => {
    navigator.clipboard.writeText(linkAlumnos)
    setLinkCopiado(true)
    setTimeout(() => setLinkCopiado(false), 2000)
  }

  const getFileIcon = (tipo: string) => {
    if (tipo === "PDF") return <FileText className="h-5 w-5 text-red-500" />
    if (tipo === "DOCX" || tipo === "DOC") return <File className="h-5 w-5 text-blue-500" />
    if (tipo === "XLSX" || tipo === "XLS") return <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
    return <File className="h-5 w-5 text-muted-foreground" />
  }

  const canNext = () => {
    if (paso === 1) return nombre && materia && curso && division && fecha && duracion
    return true
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => paso > 1 ? setPaso(paso - 1) : navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nueva Evaluación</h2>
          <p className="text-muted-foreground">Configurá tu evaluación y generá el link para los alumnos</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-0">
        {steps.map((step, i) => (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all",
                  paso > step.num
                    ? "bg-primary text-primary-foreground"
                    : paso === step.num
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {paso > step.num ? <Check className="h-5 w-5" /> : step.num}
              </div>
              <span className={cn(
                "text-xs font-medium whitespace-nowrap",
                paso >= step.num ? "text-primary" : "text-muted-foreground",
              )}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "h-0.5 w-16 sm:w-24 mx-2 mt-[-1.25rem] rounded-full transition-colors",
                paso > step.num ? "bg-primary" : "bg-muted",
              )} />
            )}
          </div>
        ))}
      </div>

      {paso === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Datos de la evaluación</CardTitle>
            <CardDescription>Completá la información general</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la evaluación *</Label>
              <Input
                id="nombre"
                placeholder="Ej: Parcial de Matemática - Funciones Lineales"
                value={nombre}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Materia *</Label>
                <Select value={materia} onValueChange={(v) => v && setMateria(v)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Seleccioná materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {materias.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label>Curso *</Label>
                  <Select value={curso} onValueChange={(v) => v && setCurso(v)}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>
                      {cursos.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>División *</Label>
                  <Select value={division} onValueChange={(v) => v && setDivision(v)}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>
                      {divisiones.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Turno</Label>
                  <Select value={turno} onValueChange={(v) => v && setTurno(v)}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>
                      {turnos.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha de evaluación *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={fecha}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFecha(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duracion">Duración (minutos) *</Label>
                <Input
                  id="duracion"
                  type="number"
                  min="5"
                  max="180"
                  value={duracion}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuracion(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {paso === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subir contenidos</CardTitle>
              <CardDescription>
                Subí el archivo con el material. La IA generará una evaluación diferente para cada alumno a partir de este documento.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all cursor-pointer",
                  isDragging
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50",
                )}
              >
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.xlsx,.xls"
                  onChange={handleFileInput}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="rounded-2xl bg-primary/10 p-4 mb-4">
                  <Upload className={cn("h-8 w-8", isDragging ? "text-primary animate-bounce" : "text-primary")} />
                </div>
                <p className="text-base font-semibold">
                  {isDragging ? "Soltá los archivos acá" : "Arrastrá archivos o hacé click para seleccionar"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  PDF, DOCX, XLSX · Máximo 10 MB por archivo
                </p>
              </div>

              {archivos.length > 0 && (
                <div className="space-y-2">
                  {archivos.map((archivo, index) => (
                    <div
                      key={`${archivo.nombre}-${index}`}
                      className="flex items-center gap-3 rounded-lg border bg-card p-3"
                    >
                      {getFileIcon(archivo.tipo)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{archivo.nombre}</p>
                        <p className="text-xs text-muted-foreground">{archivo.tipo} · {archivo.tamano}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => quitarArchivo(index)} className="shrink-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurar puntajes</CardTitle>
              <CardDescription>Definí la estructura de puntuación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cant-preg">Cantidad de preguntas</Label>
                  <Input
                    id="cant-preg"
                    type="number"
                    min="1"
                    max="50"
                    value={cantidadPreguntas}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCantidadPreguntas(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="puntaje-total">Puntaje total</Label>
                  <Input
                    id="puntaje-total"
                    type="number"
                    min="1"
                    value={puntajeTotal}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPuntajeTotal(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="puntaje-aprob">Puntaje aprobación (%)</Label>
                  <Input
                    id="puntaje-aprob"
                    type="number"
                    min="1"
                    max="100"
                    value={puntajeAprobacion}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPuntajeAprobacion(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {!generado ? (
            <Card className={cn(
              "border-2 transition-all",
              generando ? "border-primary/50 bg-primary/5" : "border-dashed border-primary/30 hover:border-primary/50",
            )}>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                {generando ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                      <div className="relative rounded-full bg-primary/10 p-5">
                        <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">Generando evaluaciones con IA...</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Creando una evaluación diferente para cada alumno que se conecte
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Esto puede tardar unos segundos
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-full bg-primary/10 p-5">
                      <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">Todo listo para generar</p>
                      <p className="text-sm text-muted-foreground mt-1 max-w-md">
                        La IA creará {cantidadPreguntas} preguntas basadas en los contenidos subidos.
                        Cada alumno recibirá una evaluación diferente.
                      </p>
                    </div>
                    <Button onClick={handleGenerar} size="lg" className="gap-2 shadow-lg shadow-primary/25 mt-2">
                      <Sparkles className="h-5 w-5" />
                      Generar Evaluación con IA
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card className="border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10">
                <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                  <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-5">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                      ¡Evaluación generada exitosamente!
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Se generarán {cantidadPreguntas} preguntas diferentes para cada alumno que se conecte
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-primary" />
                    Link de acceso para alumnos
                  </CardTitle>
                  <CardDescription>
                    Compartí este link con tus alumnos. Al acceder, se registrarán automáticamente
                    y el listado se generará en orden alfabético.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={linkAlumnos}
                      className="font-mono text-sm bg-muted"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopiarLink}
                      className="shrink-0"
                    >
                      {linkCopiado ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {linkCopiado && (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      ¡Link copiado al portapapeles!
                    </p>
                  )}
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>¿Cómo funciona?</strong> Los alumnos acceden al link, se loguean con su cuenta,
                      y automáticamente quedan registrados en la evaluación. El listado se ordena alfabéticamente.
                      Cada alumno recibe una evaluación diferente generada por IA.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  Volver al Dashboard
                </Button>
                <Button className="gap-2">
                  <Eye className="h-4 w-4" />
                  Ver Evaluación
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {!(paso === 2 && generado) && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            onClick={() => paso > 1 ? setPaso(paso - 1) : navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {paso === 1 ? "Cancelar" : "Anterior"}
          </Button>

          <div className="flex items-center gap-1.5">
            {steps.map((s) => (
              <div
                key={s.num}
                className={cn(
                  "h-2 rounded-full transition-all",
                  s.num === paso ? "w-6 bg-primary" : "w-2 bg-muted",
                )}
              />
            ))}
          </div>

          {paso < 2 ? (
            <Button onClick={() => setPaso(paso + 1)} disabled={!canNext()} className="gap-2">
              Siguiente
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Badge variant="secondary" className="text-sm px-3 py-1.5">
              Paso final
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
