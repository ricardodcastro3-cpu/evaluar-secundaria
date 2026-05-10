import { FileSpreadsheet, UploadCloud, UserPlus } from "lucide-react";
import { AlertMessage } from "@/components/AlertMessage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAlumnoStore } from "@/store/alumnoStore";

export function SubirAlumnos() {
  const alumnos = useAlumnoStore((state) => state.alumnos);

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="secondary">Gestion de cursos</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Subir alumnos</h1>
        <p className="mt-2 text-muted-foreground">
          Carga manual o importa una planilla para preparar las evaluaciones.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-dashed">
          <CardHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
              <UploadCloud className="h-6 w-6" />
            </div>
            <CardTitle>Importar planilla</CardTitle>
            <CardDescription>Formato sugerido: nombre, apellido, DNI, email y curso.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label
              htmlFor="archivo"
              className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/60 p-6 text-center transition hover:bg-accent"
            >
              <FileSpreadsheet className="mb-3 h-10 w-10 text-primary" />
              <span className="font-semibold">Arrastra un CSV/XLSX o selecciona un archivo</span>
              <span className="mt-1 text-sm text-muted-foreground">Carga demo, sin envio a servidor</span>
              <Input id="archivo" type="file" className="hidden" accept=".csv,.xlsx" />
            </label>
            <Button className="w-full">
              <UploadCloud className="h-4 w-4" />
              Procesar archivo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Carga manual</CardTitle>
            <CardDescription>Agrega estudiantes individuales al curso seleccionado.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" placeholder="Lucia" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" placeholder="Rodriguez" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dni">DNI</Label>
              <Input id="dni" placeholder="45111222" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mail">Email</Label>
              <Input id="mail" type="email" placeholder="lucia@estudiante.edu.ar" />
            </div>
            <Button className="sm:col-span-2">
              <UserPlus className="h-4 w-4" />
              Agregar alumno
            </Button>
          </CardContent>
        </Card>
      </div>

      <AlertMessage
        tipo="success"
        titulo="Curso demo listo"
        descripcion={`${alumnos.length} alumnos disponibles para probar el flujo de evaluacion.`}
      />

      <Card>
        <CardHeader>
          <CardTitle>Alumnos cargados</CardTitle>
          <CardDescription>Vista previa de datos importados.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alumnos.map((alumno) => (
            <div
              key={alumno.id}
              className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_9rem] sm:items-center"
            >
              <div>
                <p className="font-semibold">
                  {alumno.apellido}, {alumno.nombre}
                </p>
                <p className="text-sm text-muted-foreground">DNI {alumno.dni} · {alumno.email}</p>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                  <span>Progreso</span>
                  <span>{alumno.progreso}%</span>
                </div>
                <Progress value={alumno.progreso} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
