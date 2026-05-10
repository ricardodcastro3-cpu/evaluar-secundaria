import { AlertTriangle, CalendarDays, Clock3, GraduationCap, PlayCircle, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { evaluacionAlumnoMock, tokenDemo } from "@/lib/alumnoFlowMock";

export function BienvenidaAlumno() {
  const { token = tokenDemo } = useParams();

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center">
        <Card className="glass-card w-full overflow-hidden border-white/60 shadow-2xl shadow-indigo-500/15">
          <CardContent className="grid gap-0 p-0 lg:grid-cols-[1fr_0.85fr]">
            <section className="p-6 sm:p-10">
              <Badge variant="secondary">Acceso de alumno</Badge>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
                Hola, {evaluacionAlumnoMock.alumno}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Tenes una evaluacion asignada. Podes practicar primero con Fast Track o iniciar la
                instancia formal cuando estes listo.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <InfoItem icon={GraduationCap} label="Materia" value={evaluacionAlumnoMock.materia} />
                <InfoItem icon={UserRound} label="Docente" value={evaluacionAlumnoMock.docente} />
                <InfoItem icon={CalendarDays} label="Fecha" value={evaluacionAlumnoMock.fecha} />
                <InfoItem icon={Clock3} label="Duracion" value={`${evaluacionAlumnoMock.duracion} minutos`} />
              </div>

              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                  <p className="font-semibold">
                    La evaluación formal tiene una sola oportunidad. No podrás repetirla.
                  </p>
                </div>
              </div>
            </section>

            <aside className="flex flex-col justify-center bg-primary p-6 text-primary-foreground sm:p-10">
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
                  EvalAr Secundaria
                </p>
                <h2 className="mt-3 text-3xl font-bold">Elegí cómo comenzar</h2>
                <p className="mt-3 text-sm leading-6 text-white/75">
                  Fast Track es una practica ilimitada. La evaluacion formal registra tu entrega
                  definitiva.
                </p>
              </div>

              <div className="mt-6 grid gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-16 bg-emerald-500 text-base text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-600"
                >
                  <Link to={`/fast-track/${token}`}>
                    <PlayCircle className="h-6 w-6" />
                    Practicar con Fast Track
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="h-16 text-base">
                  <Link to={`/evaluacion/${token}`}>
                    <GraduationCap className="h-6 w-6" />
                    Iniciar Evaluación Formal
                  </Link>
                </Button>
              </div>
            </aside>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof GraduationCap;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-card/80 p-4">
      <Icon className="mb-3 h-5 w-5 text-primary" />
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
