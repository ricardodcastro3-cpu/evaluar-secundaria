import { CalendarDays, Clock3, Download, FileText, Plus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { descargarReporteFinalCurso } from "@/lib/excelReport";
import { evaluacionAlumnoMock, reporteFinalCursoMock } from "@/lib/alumnoFlowMock";

const evaluacionesActivas = [
  {
    id: "eva-mat-4b",
    materia: "Matematica",
    curso: "4to B",
    fecha: "18/05/2026",
    alumnos: 31,
    estado: "activa",
    titulo: "Funciones lineales y modelizacion",
  },
  {
    id: "eva-len-3a",
    materia: "Lengua",
    curso: "3ro A",
    fecha: "22/05/2026",
    alumnos: 27,
    estado: "borrador",
    titulo: "Textos argumentativos",
  },
  {
    id: "eva-his-5c",
    materia: "Historia",
    curso: "5to C",
    fecha: "08/05/2026",
    alumnos: 24,
    estado: "finalizada",
    titulo: "Modelo agroexportador",
  },
];

const seguimientoAlumnos = [
  {
    alumno: "Garcia, Mateo",
    estado: "Entregado",
    intentosFastTrack: 2,
    nota: "8.2",
    tiempo: "38 min",
  },
  {
    alumno: "Molina, Sofia",
    estado: "En progreso",
    intentosFastTrack: 1,
    nota: "-",
    tiempo: "21 min",
  },
  {
    alumno: "Pereyra, Tomas",
    estado: "Pendiente",
    intentosFastTrack: 3,
    nota: "-",
    tiempo: "0 min",
  },
  {
    alumno: "Rodriguez, Lucia",
    estado: "Entregado",
    intentosFastTrack: 1,
    nota: "9.1",
    tiempo: "35 min",
  },
];

const estadoVariant = {
  activa: "success",
  borrador: "warning",
  finalizada: "secondary",
} as const;

export function DashboardDocente() {
  const descargarReporte = () => {
    descargarReporteFinalCurso({
      escuela: evaluacionAlumnoMock.escuela,
      tituloEvaluacion: evaluacionAlumnoMock.titulo,
      materia: evaluacionAlumnoMock.materia,
      curso: evaluacionAlumnoMock.curso,
      division: evaluacionAlumnoMock.division,
      fecha: evaluacionAlumnoMock.fecha,
      alumnos: reporteFinalCursoMock,
    });
  };

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-4 rounded-3xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <Badge variant="secondary">Dashboard docente</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Mis Evaluaciones</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Vista general de evaluaciones activas y alumnos que se conectan automaticamente desde
            el link compartido.
          </p>
        </div>
        <Button asChild size="lg" className="h-12 shrink-0 shadow-lg shadow-indigo-500/20">
          <Link to="/nueva-evaluacion">
            <Plus className="h-5 w-5" />
            Nueva Evaluacion
          </Link>
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {evaluacionesActivas.map((evaluacion) => (
          <Card key={evaluacion.id} className="overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">{evaluacion.materia}</CardTitle>
                  <CardDescription className="mt-1">{evaluacion.titulo}</CardDescription>
                </div>
                <Badge variant={estadoVariant[evaluacion.estado as keyof typeof estadoVariant]}>
                  {evaluacion.estado}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-muted p-3">
                  <FileText className="mb-2 h-4 w-4 text-primary" />
                  <p className="text-xs text-muted-foreground">Curso</p>
                  <p className="font-semibold">{evaluacion.curso}</p>
                </div>
                <div className="rounded-2xl bg-muted p-3">
                  <Users className="mb-2 h-4 w-4 text-primary" />
                  <p className="text-xs text-muted-foreground">Alumnos</p>
                  <p className="font-semibold">{evaluacion.alumnos}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                Fecha: <span className="font-semibold text-foreground">{evaluacion.fecha}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="border-primary/20">
        <CardHeader className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <Badge variant="secondary">Reporte final del curso</Badge>
            <CardTitle className="mt-3">
              Evaluación de: {evaluacionAlumnoMock.materia} · {evaluacionAlumnoMock.curso}{" "}
              {evaluacionAlumnoMock.division}
            </CardTitle>
            <CardDescription>
              A medida que los alumnos finalizan, se consolida una planilla Excel con escuela,
              materia, curso, division, fecha y resultado aprobado/reprobado.
            </CardDescription>
          </div>
          <Button onClick={descargarReporte} className="shrink-0">
            <Download className="h-4 w-4" />
            Descargar Excel
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-muted p-3">
              <p className="text-xs text-muted-foreground">Escuela</p>
              <p className="text-sm font-semibold">{evaluacionAlumnoMock.escuela}</p>
            </div>
            <div className="rounded-2xl bg-muted p-3">
              <p className="text-xs text-muted-foreground">Fecha</p>
              <p className="text-sm font-semibold">{evaluacionAlumnoMock.fecha}</p>
            </div>
            <div className="rounded-2xl bg-muted p-3">
              <p className="text-xs text-muted-foreground">Finalizados</p>
              <p className="text-sm font-semibold">{reporteFinalCursoMock.length} alumnos</p>
            </div>
            <div className="rounded-2xl bg-muted p-3">
              <p className="text-xs text-muted-foreground">Orden</p>
              <p className="text-sm font-semibold">Alfabetico por apellido y nombre</p>
            </div>
          </div>
          <div className="overflow-x-auto rounded-2xl border">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Numero de orden</th>
                  <th className="px-4 py-3 font-semibold">Apellido y nombre</th>
                  <th className="px-4 py-3 font-semibold">Puntaje obtenido</th>
                  <th className="px-4 py-3 font-semibold">Aprobado / Reprobado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {reporteFinalCursoMock.map((alumno, index) => (
                  <tr key={`${alumno.apellido}-${alumno.nombre}`} className="bg-card transition hover:bg-muted/60">
                    <td className="px-4 py-4 font-semibold">{index + 1}</td>
                    <td className="px-4 py-4">
                      {alumno.apellido}, {alumno.nombre}
                    </td>
                    <td className="px-4 py-4 font-semibold">{alumno.puntajeObtenido}</td>
                    <td className="px-4 py-4">
                      <Badge variant={alumno.aprobado ? "success" : "warning"}>
                        {alumno.aprobado ? "APROBADO" : "REPROBADO"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Seguimiento de alumnos</CardTitle>
            <CardDescription>
              Tabla demo con estado, intentos FastTrack, nota y tiempo de resolucion.
            </CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link to="/subir-alumnos">Ver alumnos conectados</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-2xl border">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Alumno</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Intentos FastTrack</th>
                  <th className="px-4 py-3 font-semibold">Nota</th>
                  <th className="px-4 py-3 font-semibold">Tiempo</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {seguimientoAlumnos.map((fila) => (
                  <tr key={fila.alumno} className="bg-card transition hover:bg-muted/60">
                    <td className="px-4 py-4 font-semibold">{fila.alumno}</td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={
                          fila.estado === "Entregado"
                            ? "success"
                            : fila.estado === "En progreso"
                              ? "warning"
                              : "outline"
                        }
                      >
                        {fila.estado}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">{fila.intentosFastTrack}</td>
                    <td className="px-4 py-4 font-semibold">{fila.nota}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-primary" />
                        {fila.tiempo}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
