import { useState } from "react"
import {
  ArrowLeft,
  Upload,
  UserPlus,
  Trash2,
  Download,
  Search,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertMessage } from "@/components/AlertMessage"
import { useAlumnoStore } from "@/store/alumnoStore"
import type { Alumno } from "@/types"

export function SubirAlumnos() {
  const navigate = useNavigate()
  const { alumnos, agregarAlumno, eliminarAlumno } = useAlumnoStore()
  const [search, setSearch] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [dni, setDni] = useState("")
  const [email, setEmail] = useState("")
  const [curso, setCurso] = useState("3°")
  const [division, setDivision] = useState("A")
  const [showSuccess, setShowSuccess] = useState(false)

  const filtrados = alumnos.filter(
    (a) =>
      a.nombre.toLowerCase().includes(search.toLowerCase()) ||
      a.apellido.toLowerCase().includes(search.toLowerCase()) ||
      a.dni.includes(search),
  )

  const handleAgregar = (e: React.FormEvent) => {
    e.preventDefault()
    const nuevo: Alumno = {
      id: `alu-${Date.now()}`,
      nombre,
      apellido,
      dni,
      email: email || undefined,
      curso,
      division,
      created_at: new Date().toISOString(),
    }
    agregarAlumno(nuevo)
    setShowDialog(false)
    setNombre("")
    setApellido("")
    setDni("")
    setEmail("")
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alumnos</h2>
          <p className="text-muted-foreground">
            Gestioná la lista de alumnos de tus cursos
          </p>
        </div>
      </div>

      {showSuccess && (
        <AlertMessage
          tipo="success"
          mensaje="Alumno agregado correctamente"
          dismissible
        />
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, apellido o DNI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" disabled>
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Importar CSV</span>
          </Button>
          <Button variant="outline" className="gap-2" disabled>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Agregar</span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Alumno</DialogTitle>
                <DialogDescription>
                  Completá los datos del alumno
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAgregar} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido *</Label>
                    <Input
                      id="apellido"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI *</Label>
                  <Input
                    id="dni"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-alumno">Email (opcional)</Label>
                  <Input
                    id="email-alumno"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="curso-alumno">Curso</Label>
                    <Input
                      id="curso-alumno"
                      value={curso}
                      onChange={(e) => setCurso(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="division-alumno">División</Label>
                    <Input
                      id="division-alumno"
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Agregar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Lista de Alumnos
            <Badge variant="secondary">{filtrados.length} alumnos</Badge>
          </CardTitle>
          <CardDescription>
            Alumnos registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filtrados.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {search
                  ? "No se encontraron alumnos"
                  : "No hay alumnos cargados"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtrados.map((alumno) => (
                <div
                  key={alumno.id}
                  className="flex items-center gap-4 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {alumno.nombre[0]}
                    {alumno.apellido[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      {alumno.apellido}, {alumno.nombre}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      DNI: {alumno.dni} · {alumno.curso} {alumno.division}
                      {alumno.email && ` · ${alumno.email}`}
                    </p>
                  </div>
                  {alumno.nota_final != null && (
                    <Badge
                      variant={alumno.nota_final >= 6 ? "default" : "destructive"}
                    >
                      {alumno.nota_final}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => eliminarAlumno(alumno.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
