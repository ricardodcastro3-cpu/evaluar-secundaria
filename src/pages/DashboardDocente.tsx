import { ArrowUpRight, ClipboardList, GraduationCap, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAlumnoStore } from "@/store/alumnoStore";
import { useEvaluacionStore } from "@/store/evaluacionStore";
import type { EstadisticaDocente } from "@/types";

const estadisticas: EstadisticaDocente[] = [
  { etiqueta: "Cursos activos", valor: "4", detalle: "2 con evaluaciones esta semana", tendencia: "positiva" },
  { etiqueta: "Evaluaciones", valor: "12", detalle: "3 en borrador", tendencia: "neutral" },
  { etiqueta: "Promedio general", valor: "7.8", detalle: "+0.6 vs trimestre anterior", tendencia: "positiva" },
];

export function DashboardDocente() {
  const alumnos = useAlumnoStore((state) => state.alumnos);
  const evaluaciones = useEvaluacionStore((state) => state.evaluaciones);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card className="overflow-hidden border-0 bg-primary text-primary-foreground shadow-xl shadow-indigo-500/20">
          <CardContent className="p-6 sm:p-8">
            <Badge className="mb-4 bg-white/15 text-white">Panel docente</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Gestiona tus evaluaciones con seguimiento claro del aula.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
              Configura criterios, revisa avances y prepara devoluciones accionables para tus
              estudiantes de secundaria.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link to="/configurar-evaluacion">Crear evaluacion</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link to="/subir-alumnos">Cargar alumnos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
            <CardDescription>Resumen del ciclo lectivo 2026</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Entregas revisadas</span>
              <span className="font-semibold">68%</span>
            </div>
            <Progress value={68} />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl bg-muted p-3">
                <Users className="mb-2 h-4 w-4 text-primary" />
                <p className="text-2xl font-bold">{alumnos.length}</p>
                <p className="text-xs text-muted-foreground">Alumnos demo</p>
              </div>
              <div className="rounded-xl bg-muted p-3">
                <ClipboardList className="mb-2 h-4 w-4 text-primary" />
                <p className="text-2xl font-bold">{evaluaciones.length}</p>
                <p className="text-xs text-muted-foreground">Evaluaciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {estadisticas.map((item) => (
          <Card key={item.etiqueta}>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{item.etiqueta}</p>
                {item.tendencia === "positiva" ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-3xl font-bold">{item.valor}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.detalle}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evaluaciones proximas</CardTitle>
            <CardDescription>Acceso rapido a estados y materias.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {evaluaciones.map((evaluacion) => (
              <div key={evaluacion.id} className="flex items-center justify-between rounded-xl border p-4">
                <div>
                  <p className="font-semibold">{evaluacion.titulo}</p>
                  <p className="text-sm text-muted-foreground">
                    {evaluacion.materia} · {evaluacion.duracionMinutos} min
                  </p>
                </div>
                <Badge variant={evaluacion.estado === "activa" ? "success" : "secondary"}>
                  {evaluacion.estado}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alumnos destacados</CardTitle>
            <CardDescription>Seguimiento por progreso y promedio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alumnos.map((alumno) => (
              <div key={alumno.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-medium">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    {alumno.apellido}, {alumno.nombre}
                  </span>
                  <span className="text-sm text-muted-foreground">{alumno.promedio}</span>
                </div>
                <Progress value={alumno.progreso} />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
