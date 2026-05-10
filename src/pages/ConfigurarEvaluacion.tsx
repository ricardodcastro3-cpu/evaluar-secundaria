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
  UserPlus,
  Trash2,
  GripVertical,
  Eye,
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
  "Biología", "Física", "Química", "Inglés", "Educación Cívica", "Tecnología",
]
const cursos = ["1°", "2°", "3°", "4°", "5°", "6°"]
const divisiones = ["A", "B", "C", "D"]
const turnos = ["Mañana", "Tarde", "Noche"]

interface ArchivoSubido {
  nombre: string
  tipo: string
  tamano: string
}

interface AlumnoFila {
  id: string
  nombre: string
  apellido: string
  dni: string
  email: string
  division: string
}

const alumnosIniciales: AlumnoFila[] = [
  { id: "1", nombre: "Juan", apellido: "Pérez", dni: "45123456", email: "juan.perez@alumno.edu.ar", division: "A" },
  { id: "2", nombre: "María", apellido: "López", dni: "45234567", email: "maria.lopez@alumno.edu.ar", division: "A" },
  { id: "3", nombre: "Carlos", apellido: "García", dni: "45345678", email: "carlos.garcia@alumno.edu.ar", division: "A" },
  { id: "4", nombre: "Lucía", apellido: "Martínez", dni: "45456789", email: "lucia.martinez@alumno.edu.ar", division: "A" },
  { id: "5", nombre: "Tomás", apellido: "Rodríguez", dni: "45567890", email: "tomas.rodriguez@alumno.edu.ar", division: "A" },
  { id: "6", nombre: "Valentina", apellido: "Fernández", dni: "45678901", email: "valentina.f@alumno.edu.ar", division: "A" },
  { id: "7", nombre: "Mateo", apellido: "Gómez", dni: "45789012", email: "mateo.gomez@alumno.edu.ar", division: "A" },
  { id: "8", nombre: "Sofía", apellido: "Díaz", dni: "45890123", email: "sofia.diaz@alumno.edu.ar", division: "A" },
]

const steps = [
  { num: 1, label: "Datos básicos" },
  { num: 2, label: "Contenidos" },
  { num: 3, label: "Alumnos" },
]

export function ConfigurarEvaluacion() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)

  // Paso 1
  const [nombre, setNombre] = useState("")
  const [materia, setMateria] = useState("")
  const [curso, setCurso] = useState("")
  const [division, setDivision] = useState("")
  const [turno, setTurno] = useState("")
  const [fecha, setFecha] = useState("")
  const [duracion, setDuracion] = useState("60")

  // Paso 2
  const [archivos, setArchivos] = useState<ArchivoSubido[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [puntajeTotal, setPuntajeTotal] = useState("100")
  const [puntajeAprobacion, setPuntajeAprobacion] = useState("60")
  const [cantidadPreguntas, setCantidadPreguntas] = useState("10")

  // Paso 3
  const [alumnos, setAlumnos] = useState<AlumnoFila[]>(alumnosIniciales)

  // Generación IA
  const [generando, setGenerando] = useState(false)
  const [generado, setGenerado] = useState(false)

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

  const agregarAlumnoVacio = () => {
    setAlumnos((prev) => [
      ...prev,
      { id: `new-${Date.now()}`, nombre: "", apellido: "", dni: "", email: "", division: division || "A" },
    ])
  }

  const actualizarAlumno = (id: string, field: keyof AlumnoFila, value: string) => {
    setAlumnos((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)))
  }

  const eliminarAlumno = (id: string) => {
    setAlumnos((prev) => prev.filter((a) => a.id !== id))
  }

  const handleGenerar = () => {
    setGenerando(true)
    setTimeout(() => {
      setGenerando(false)
      setGenerado(true)
    }, 3000)
  }

  const getFileIcon = (tipo: string) => {
    if (tipo === "PDF") return <FileText className="h-5 w-5 text-red-500" />
    if (tipo === "DOCX" || tipo === "DOC") return <File className="h-5 w-5 text-blue-500" />
    if (tipo === "XLSX" || tipo === "XLS") return <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
    return <File className="h-5 w-5 text-muted-foreground" />
  }

  const canNext = () => {
    if (paso === 1) return nombre && materia && curso && division && fecha && duracion
    if (paso === 2) return true
    return alumnos.length > 0
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => paso > 1 ? setPaso(paso - 1) : navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nueva Evaluación</h2>
          <p className="text-muted-foreground">Configurá tu evaluación en 3 simples pasos</p>
        </div>
      </div>

      {/* Stepper */}
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

      {/* Paso 1: Datos básicos */}
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

      {/* Paso 2: Contenidos */}
      {paso === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subir contenidos</CardTitle>
              <CardDescription>
                Subí los archivos con el material de la evaluación. La IA generará las preguntas a partir de estos contenidos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drop zone */}
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

              {/* Lista de archivos */}
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
              <CardDescription>Definí la estructura de puntuación de la evaluación</CardDescription>
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
        </div>
      )}

      {/* Paso 3: Alumnos */}
      {paso === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle>Lista de alumnos</CardTitle>
                  <CardDescription>
                    Cargá la lista de alumnos que rendirán la evaluación
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                    Importar Excel
                    <input type="file" accept=".xlsx,.xls,.csv" className="hidden" />
                  </label>
                  <Button onClick={agregarAlumnoVacio} variant="outline" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Agregar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="w-10 px-2 py-3" />
                        <th className="text-left font-medium text-muted-foreground px-3 py-3">Nombre</th>
                        <th className="text-left font-medium text-muted-foreground px-3 py-3">Apellido</th>
                        <th className="text-left font-medium text-muted-foreground px-3 py-3">DNI</th>
                        <th className="text-left font-medium text-muted-foreground px-3 py-3">Email</th>
                        <th className="text-left font-medium text-muted-foreground px-3 py-3">Div.</th>
                        <th className="w-10 px-2 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {alumnos.map((alumno) => (
                        <tr key={alumno.id} className="border-b last:border-0 group hover:bg-accent/30">
                          <td className="px-2 py-2 text-center">
                            <GripVertical className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={alumno.nombre}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => actualizarAlumno(alumno.id, "nombre", e.target.value)}
                              placeholder="Nombre"
                              className="h-8 border-0 bg-transparent px-1 focus-visible:bg-background focus-visible:border focus-visible:px-2"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={alumno.apellido}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => actualizarAlumno(alumno.id, "apellido", e.target.value)}
                              placeholder="Apellido"
                              className="h-8 border-0 bg-transparent px-1 focus-visible:bg-background focus-visible:border focus-visible:px-2"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={alumno.dni}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => actualizarAlumno(alumno.id, "dni", e.target.value)}
                              placeholder="DNI"
                              className="h-8 border-0 bg-transparent px-1 font-mono text-xs focus-visible:bg-background focus-visible:border focus-visible:px-2"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={alumno.email}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => actualizarAlumno(alumno.id, "email", e.target.value)}
                              placeholder="email@alumno.edu.ar"
                              className="h-8 border-0 bg-transparent px-1 text-xs focus-visible:bg-background focus-visible:border focus-visible:px-2"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={alumno.division}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => actualizarAlumno(alumno.id, "division", e.target.value)}
                              placeholder="A"
                              className="h-8 w-12 border-0 bg-transparent px-1 text-center focus-visible:bg-background focus-visible:border focus-visible:px-2"
                            />
                          </td>
                          <td className="px-2 py-2 text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                              onClick={() => eliminarAlumno(alumno.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                <span>{alumnos.length} alumnos cargados</span>
                <Button variant="link" size="sm" onClick={agregarAlumnoVacio} className="text-primary gap-1 px-0">
                  <UserPlus className="h-3.5 w-3.5" />
                  Agregar fila
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Botón Generar */}
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
                      <p className="text-lg font-semibold">Generando evaluación con IA...</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Analizando contenidos y creando preguntas personalizadas
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
                        La IA creará {cantidadPreguntas} preguntas basadas en los contenidos subidos,
                        adaptadas al nivel de {curso} {division}
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
            <Card className="border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-5">
                  <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                    ¡Evaluación generada exitosamente!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Se generaron {cantidadPreguntas} preguntas para {alumnos.length} alumnos
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => navigate("/dashboard")}>
                    Volver al Dashboard
                  </Button>
                  <Button className="gap-2">
                    <Eye className="h-4 w-4" />
                    Ver Evaluación
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Navigation buttons */}
      {!(paso === 3 && generado) && (
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

          {paso < 3 ? (
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
