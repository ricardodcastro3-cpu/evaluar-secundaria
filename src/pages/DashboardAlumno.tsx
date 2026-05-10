import { Award, BookOpen, CalendarCheck, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { tokenDemo } from "@/lib/alumnoFlowMock";
import { useAlumnoStore } from "@/store/alumnoStore";
import { useEvaluacionStore } from "@/store/evaluacionStore";

export function DashboardAlumno() {
  const alumno = useAlumnoStore((state) => state.alumnos[0]);
  const evaluaciones = useEvaluacionStore((state) => state.evaluaciones);
  const resultados = useEvaluacionStore((state) => state.resultados);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-xl shadow-indigo-500/20">
        <CardContent className="p-6 sm:p-8">
          <Badge className="bg-white/15 text-white">Panel alumno</Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Hola, {alumno.nombre}. Estas listo para avanzar?
          </h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Revisa tus evaluaciones disponibles, consulta devoluciones y prepara tu proxima entrega.
          </p>
          <Button asChild variant="secondary" className="mt-6">
            <Link to={`/eval/${tokenDemo}`}>
              <PlayCircle className="h-4 w-4" />
              Comenzar evaluacion
            </Link>
          </Button>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <BookOpen className="mb-3 h-5 w-5 text-primary" />
            <p className="text-3xl font-bold">{evaluaciones.length}</p>
            <p className="text-sm text-muted-foreground">Evaluaciones disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <Award className="mb-3 h-5 w-5 text-primary" />
            <p className="text-3xl font-bold">{alumno.promedio}</p>
            <p className="text-sm text-muted-foreground">Promedio actual</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <CalendarCheck className="mb-3 h-5 w-5 text-primary" />
            <p className="text-3xl font-bold">{resultados.length}</p>
            <p className="text-sm text-muted-foreground">Entregas registradas</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Evaluaciones pendientes</CardTitle>
            <CardDescription>Actividades asignadas por tus docentes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {evaluaciones.map((evaluacion) => (
              <div key={evaluacion.id} className="rounded-xl border p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-semibold">{evaluacion.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {evaluacion.materia} · {evaluacion.duracionMinutos} minutos
                    </p>
                  </div>
                  <Badge variant={evaluacion.estado === "activa" ? "success" : "secondary"}>
                    {evaluacion.estado}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mi progreso</CardTitle>
            <CardDescription>Seguimiento acumulado del trimestre.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avance general</span>
              <span className="font-semibold">{alumno.progreso}%</span>
            </div>
            <Progress value={alumno.progreso} />
            <div className="mt-6 rounded-2xl bg-muted p-4">
              <p className="font-semibold">Proxima recomendacion</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Repasar las devoluciones antes de iniciar una nueva instancia formal.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
