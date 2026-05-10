import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Plus,
  Clock,
  CheckCircle2,
  Users,
  FileText,
  BarChart3,
  BookOpen,
  Zap,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  CalendarDays,
  Search,
  Filter,
  Download,
} from "lucide-react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { EstadoEvaluacion } from "@/types"

interface EvalCard {
  id: string
  titulo: string
  materia: string
  curso: string
  division: string
  fecha: string
  cantidadAlumnos: number
  estado: EstadoEvaluacion
  tipo: "formal" | "fasttrack"
  promedioNota: number | null
  aprobados: number | null
}

const evaluacionesMock: EvalCard[] = [
  {
    id: "eval-1",
    titulo: "Parcial de Matemática - Funciones",
    materia: "Matemática",
    curso: "3°",
    division: "A",
    fecha: "15/04/2026",
    cantidadAlumnos: 28,
    estado: "finalizada",
    tipo: "formal",
    promedioNota: 6.8,
    aprobados: 21,
  },
  {
    id: "eval-2",
    titulo: "FastTrack - Revolución de Mayo",
    materia: "Historia",
    curso: "2°",
    division: "B",
    fecha: "08/05/2026",
    cantidadAlumnos: 32,
    estado: "en_curso",
    tipo: "fasttrack",
    promedioNota: null,
    aprobados: null,
  },
  {
    id: "eval-3",
    titulo: "Parcial de Lengua - Análisis Sintáctico",
    materia: "Lengua y Literatura",
    curso: "4°",
    division: "A",
    fecha: "20/05/2026",
    cantidadAlumnos: 25,
    estado: "configurada",
    tipo: "formal",
    promedioNota: null,
    aprobados: null,
  },
  {
    id: "eval-4",
    titulo: "FastTrack - Tabla Periódica",
    materia: "Química",
    curso: "3°",
    division: "C",
    fecha: "22/05/2026",
    cantidadAlumnos: 30,
    estado: "borrador",
    tipo: "fasttrack",
    promedioNota: null,
    aprobados: null,
  },
  {
    id: "eval-5",
    titulo: "Parcial de Biología - Genética",
    materia: "Biología",
    curso: "5°",
    division: "A",
    fecha: "10/04/2026",
    cantidadAlumnos: 22,
    estado: "finalizada",
    tipo: "formal",
    promedioNota: 7.2,
    aprobados: 18,
  },
  {
    id: "eval-6",
    titulo: "FastTrack - Verbos Irregulares",
    materia: "Inglés",
    curso: "2°",
    division: "A",
    fecha: "12/05/2026",
    cantidadAlumnos: 29,
    estado: "en_curso",
    tipo: "fasttrack",
    promedioNota: null,
    aprobados: null,
  },
]

interface AlumnoRow {
  id: string
  nombre: string
  apellido: string
  estado: "completado" | "en_curso" | "pendiente" | "no_iniciado"
  intentosFastTrack: number
  nota: number | null
  tiempo: string | null
  puntaje: number
}

const alumnosMock: AlumnoRow[] = [
  { id: "1", nombre: "Juan", apellido: "Pérez", estado: "completado", intentosFastTrack: 3, nota: 8, tiempo: "45:20", puntaje: 78 },
  { id: "2", nombre: "María", apellido: "López", estado: "completado", intentosFastTrack: 1, nota: 9, tiempo: "38:15", puntaje: 88 },
  { id: "3", nombre: "Carlos", apellido: "García", estado: "en_curso", intentosFastTrack: 2, nota: null, tiempo: null, puntaje: 55 },
  { id: "4", nombre: "Lucía", apellido: "Martínez", estado: "completado", intentosFastTrack: 1, nota: 7, tiempo: "52:40", puntaje: 72 },
  { id: "5", nombre: "Tomás", apellido: "Rodríguez", estado: "pendiente", intentosFastTrack: 0, nota: null, tiempo: null, puntaje: 63 },
  { id: "6", nombre: "Valentina", apellido: "Fernández", estado: "completado", intentosFastTrack: 2, nota: 5, tiempo: "60:00", puntaje: 48 },
  { id: "7", nombre: "Mateo", apellido: "Gómez", estado: "no_iniciado", intentosFastTrack: 0, nota: null, tiempo: null, puntaje: 42 },
  { id: "8", nombre: "Sofía", apellido: "Díaz", estado: "completado", intentosFastTrack: 1, nota: 10, tiempo: "32:10", puntaje: 95 },
  { id: "9", nombre: "Benjamín", apellido: "Ruiz", estado: "completado", intentosFastTrack: 4, nota: 4, tiempo: "59:50", puntaje: 35 },
  { id: "10", nombre: "Camila", apellido: "Torres", estado: "pendiente", intentosFastTrack: 0, nota: null, tiempo: null, puntaje: 58 },
]

const estadoConfig: Record<string, { label: string; color: string; bg: string }> = {
  borrador: {
    label: "Borrador",
    color: "text-slate-700 dark:text-slate-200",
    bg: "bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-600",
  },
  configurada: {
    label: "Configurada",
    color: "text-violet-800 dark:text-violet-200",
    bg: "bg-violet-100 dark:bg-violet-950/50 border border-violet-200/80 dark:border-violet-500/30",
  },
  en_curso: {
    label: "Activa",
    color: "text-amber-900 dark:text-amber-100",
    bg: "bg-amber-100 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-500/25",
  },
  finalizada: {
    label: "Finalizada",
    color: "text-emerald-900 dark:text-emerald-100",
    bg: "bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-500/25",
  },
}

const estadoAlumnoConfig: Record<
  string,
  { label: string; variant: "success" | "warning" | "outline" | "destructive" }
> = {
  completado: { label: "Completado", variant: "success" },
  en_curso: { label: "En curso", variant: "warning" },
  pendiente: { label: "Pendiente", variant: "outline" },
  no_iniciado: { label: "No iniciado", variant: "destructive" },
}

const reporteEval = evaluacionesMock[0]

const alumnosReporte = [...alumnosMock]
  .sort((a, b) => {
    const nameA = `${a.apellido}, ${a.nombre}`
    const nameB = `${b.apellido}, ${b.nombre}`
    return nameA.localeCompare(nameB, "es")
  })
  .map((a, i) => ({
    orden: i + 1,
    nombreCompleto: `${a.apellido}, ${a.nombre}`,
    puntaje: a.puntaje,
    resultado: a.puntaje >= 60 ? "APROBADO" : "REPROBADO",
  }))

function descargarExcel() {
  const wb = XLSX.utils.book_new()

  const headerRows = [
    ["ESCUELA:", "E.E.S. N° 1 - San Martín"],
    ["Evaluación de:", `${reporteEval.titulo}`],
    ["MATERIA:", reporteEval.materia],
    ["CURSO:", reporteEval.curso],
    ["DIVISIÓN:", reporteEval.division],
    ["FECHA:", reporteEval.fecha],
    [],
    ["N° DE ORDEN", "APELLIDO Y NOMBRE", "PUNTAJE OBTENIDO", "APROBADO / REPROBADO"],
  ]

  const dataRows = alumnosReporte.map((a) => [
    a.orden,
    a.nombreCompleto,
    a.puntaje,
    a.resultado,
  ])

  const wsData = [...headerRows, ...dataRows]
  const ws = XLSX.utils.aoa_to_sheet(wsData)

  ws["!cols"] = [
    { wch: 14 },
    { wch: 30 },
    { wch: 20 },
    { wch: 24 },
  ]

  XLSX.utils.book_append_sheet(wb, ws, "Reporte Final")
  XLSX.writeFile(wb, "reporte_final_evaluacion.xlsx")
}

function ReportesTab() {
  const totalAprobados = alumnosReporte.filter((a) => a.resultado === "APROBADO").length
  const totalReprobados = alumnosReporte.length - totalAprobados

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5" />
            Reporte Final de la Evaluación del Curso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <div>
              <span className="text-muted-foreground">Evaluación:</span>{" "}
              <span className="font-medium">{reporteEval.titulo}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Materia:</span>{" "}
              <span className="font-medium">{reporteEval.materia}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Curso:</span>{" "}
              <span className="font-medium">{reporteEval.curso}</span>
            </div>
            <div>
              <span className="text-muted-foreground">División:</span>{" "}
              <span className="font-medium">{reporteEval.division}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Fecha:</span>{" "}
              <span className="font-medium">{reporteEval.fecha}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Escuela:</span>{" "}
              <span className="font-medium">E.E.S. N° 1 - San Martín</span>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2 border-t border-border text-sm">
            <Badge variant="success">
              {totalAprobados} aprobados
            </Badge>
            <Badge variant="destructive">
              {totalReprobados} reprobados
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg">Vista previa del reporte</CardTitle>
            <Button onClick={descargarExcel} className="gap-2">
              <Download className="h-4 w-4" />
              Descargar Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-zebra w-full text-sm">
                <thead>
                  <tr className="border-b border-border table-head-gradient">
                    <th className="text-center font-heading font-bold text-[#0f172a] dark:text-foreground px-4 py-3 w-20">N° DE ORDEN</th>
                    <th className="text-left font-heading font-bold text-[#0f172a] dark:text-foreground px-4 py-3">APELLIDO Y NOMBRE</th>
                    <th className="text-center font-heading font-bold text-[#0f172a] dark:text-foreground px-4 py-3">PUNTAJE OBTENIDO</th>
                    <th className="text-center font-heading font-bold text-[#0f172a] dark:text-foreground px-4 py-3">APROBADO / REPROBADO</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnosReporte.map((a) => (
                    <tr key={a.orden} className="border-b border-border/80 last:border-0 hover:bg-[#7C3AED]/[0.04] transition-colors">
                      <td className="px-4 py-3 text-center font-mono">{a.orden}</td>
                      <td className="px-4 py-3 font-medium">{a.nombreCompleto}</td>
                      <td className="px-4 py-3 text-center font-mono">{a.puntaje}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={a.resultado === "APROBADO" ? "success" : "destructive"}>
                          {a.resultado}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function DashboardDocente() {
  const navigate = useNavigate()
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")
  const [searchAlumnos, setSearchAlumnos] = useState("")

  const evalsFiltradas = filtroEstado === "todos"
    ? evaluacionesMock
    : evaluacionesMock.filter((e) => e.estado === filtroEstado)

  const alumnosFiltrados = alumnosMock.filter(
    (a) =>
      a.nombre.toLowerCase().includes(searchAlumnos.toLowerCase()) ||
      a.apellido.toLowerCase().includes(searchAlumnos.toLowerCase()),
  )

  const totalActivas = evaluacionesMock.filter((e) => e.estado === "en_curso").length
  const totalFinalizadas = evaluacionesMock.filter((e) => e.estado === "finalizada").length
  const totalAlumnos = alumnosMock.length
  const promedioGeneral = alumnosMock
    .filter((a) => a.nota !== null)
    .reduce((acc, a, _i, arr) => acc + (a.nota ?? 0) / arr.length, 0)
    .toFixed(1)

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-[#0f172a] dark:text-foreground">Mis Evaluaciones</h2>
          <p className="text-muted-foreground">Gestioná y seguí el progreso de tus evaluaciones</p>
        </div>
        <Button onClick={() => navigate("/nueva-evaluacion")} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Nueva Evaluación
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Evaluaciones",
            value: evaluacionesMock.length,
            icon: FileText,
            color: "text-[#7C3AED]",
            bg: "bg-gradient-to-br from-[#7C3AED]/20 via-violet-400/15 to-[#2563EB]/10 ring-1 ring-[#7C3AED]/20",
          },
          {
            label: "Activas",
            value: totalActivas,
            icon: Clock,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-gradient-to-br from-amber-200/80 to-amber-400/25 dark:from-amber-900/50 dark:to-amber-700/20 ring-1 ring-amber-300/50 dark:ring-amber-500/25",
          },
          {
            label: "Finalizadas",
            value: totalFinalizadas,
            icon: CheckCircle2,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-gradient-to-br from-emerald-200/70 to-emerald-400/20 dark:from-emerald-900/45 dark:to-emerald-800/15 ring-1 ring-emerald-300/50 dark:ring-emerald-500/25",
          },
          {
            label: "Alumnos Totales",
            value: totalAlumnos,
            icon: Users,
            color: "text-[#2563EB]",
            bg: "bg-gradient-to-br from-[#2563EB]/18 via-sky-300/15 to-[#7C3AED]/10 ring-1 ring-[#2563EB]/22",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-sm ${stat.bg}`}
              >
                <stat.icon className={`h-9 w-9 ${stat.color}`} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-2xl font-bold text-[#0f172a] dark:text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs: Evaluaciones / Alumnos */}
      <Tabs defaultValue="evaluaciones" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="evaluaciones" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Evaluaciones
            </TabsTrigger>
            <TabsTrigger value="alumnos" className="gap-2">
              <Users className="h-4 w-4" />
              Alumnos
            </TabsTrigger>
            <TabsTrigger value="reportes" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Reportes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="evaluaciones" className="mt-0">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filtroEstado} onValueChange={(v) => v && setFiltroEstado(v)}>
                <SelectTrigger className="w-40 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="borrador">Borrador</SelectItem>
                  <SelectItem value="configurada">Configurada</SelectItem>
                  <SelectItem value="en_curso">Activa</SelectItem>
                  <SelectItem value="finalizada">Finalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </div>

        {/* Evaluaciones Grid */}
        <TabsContent value="evaluaciones" className="mt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {evalsFiltradas.map((ev) => {
              const estado = estadoConfig[ev.estado]
              return (
                <Card key={ev.id} className="group hover:shadow-[0_12px_40px_-12px_rgba(124,58,237,0.18)] transition-all hover:ring-[#7C3AED]/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`rounded-xl p-1.5 ring-1 ${ev.tipo === "fasttrack" ? "bg-amber-100 dark:bg-amber-900/35 ring-amber-200/70" : "bg-[#7C3AED]/10 ring-[#7C3AED]/20"}`}>
                          {ev.tipo === "fasttrack" ? (
                            <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" strokeWidth={2.25} />
                          ) : (
                            <BookOpen className="h-4 w-4 text-[#7C3AED]" strokeWidth={2.25} />
                          )}
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${estado.color} ${estado.bg}`}>
                          {estado.label}
                        </span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="rounded-xl p-1.5 opacity-0 group-hover:opacity-100 hover:bg-[#7C3AED]/8 transition-all">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />Ver detalle</DropdownMenuItem>
                          <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-base mt-2 line-clamp-2">{ev.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{ev.materia}</span>
                      <span>{ev.curso} {ev.division}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {ev.fecha}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {ev.cantidadAlumnos} alumnos
                      </span>
                    </div>
                    {ev.estado === "finalizada" && ev.promedioNota !== null && (
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-xs text-muted-foreground">
                          Promedio: <span className="font-semibold text-foreground">{ev.promedioNota}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Aprobados: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{ev.aprobados}/{ev.cantidadAlumnos}</span>
                        </div>
                      </div>
                    )}
                    {ev.estado === "en_curso" && (
                      <div className="pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Evaluación en progreso</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Alumnos Table */}
        <TabsContent value="alumnos" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  Alumnos · Parcial de Matemática - Funciones
                  <Badge variant="secondary">3° A</Badge>
                </CardTitle>
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar alumno..."
                    value={searchAlumnos}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchAlumnos(e.target.value)}
                    className="pl-10 h-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="table-zebra w-full text-sm">
                    <thead>
                      <tr className="border-b border-border table-head-gradient">
                        <th className="text-left font-heading font-bold text-[#0f172a] dark:text-foreground px-4 py-3">Alumno</th>
                        <th className="text-left font-heading font-bold text-[#0f172a] dark:text-foreground px-4 py-3">Estado</th>
                        <th className="text-center font-heading font-bold text-[#0f172a] dark:text-foreground px-4 py-3">Intentos FT</th>
                        <th className="text-center font-heading font-bold text-[#0f172a] dark:text-foreground px-4 py-3">Nota</th>
                        <th className="text-center font-heading font-bold text-[#0f172a] dark:text-foreground px-4 py-3">Tiempo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alumnosFiltrados.map((alumno) => {
                        const estadoAl = estadoAlumnoConfig[alumno.estado]
                        return (
                          <tr key={alumno.id} className="border-b border-border/80 last:border-0 hover:bg-[#7C3AED]/[0.04] transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED]/18 to-[#2563EB]/22 text-[#6d28d9] dark:from-[#a78bfa]/25 dark:to-[#2563EB]/25 dark:text-[#C4B5FD] font-bold text-xs ring-1 ring-[#7C3AED]/15">
                                  {alumno.nombre[0]}{alumno.apellido[0]}
                                </div>
                                <span className="font-medium">{alumno.apellido}, {alumno.nombre}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={estadoAl.variant}>{estadoAl.label}</Badge>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={alumno.intentosFastTrack > 2 ? "text-amber-600 dark:text-amber-400 font-semibold" : ""}>
                                {alumno.intentosFastTrack}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {alumno.nota !== null ? (
                                <span className={`font-bold ${alumno.nota >= 6 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                                  {alumno.nota}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center font-mono text-xs">
                              {alumno.tiempo ?? <span className="text-muted-foreground">—</span>}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <span>{alumnosFiltrados.length} alumnos</span>
                <span>Promedio general: <strong className="text-foreground">{promedioGeneral}</strong></span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reportes */}
        <TabsContent value="reportes" className="mt-0">
          <ReportesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
