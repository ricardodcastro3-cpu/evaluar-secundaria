import { CheckCircle2, Download, Home, MessageSquareText } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { evaluacionAlumnoMock, tokenDemo } from "@/lib/alumnoFlowMock";

export function Resultado() {
  const { token = tokenDemo } = useParams();
  const porcentaje = Math.round(
    (evaluacionAlumnoMock.puntaje / evaluacionAlumnoMock.puntajeMaximo) * 100,
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card className="overflow-hidden shadow-2xl shadow-indigo-500/10">
          <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_19rem]">
            <section>
              <Badge variant="success">Resultado final</Badge>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
                {evaluacionAlumnoMock.puntaje}/{evaluacionAlumnoMock.puntajeMaximo}
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                {evaluacionAlumnoMock.alumno} · {evaluacionAlumnoMock.materia}
              </p>
              <div className="mt-6 max-w-xl">
                <div className="mb-2 flex justify-between text-sm">
                  <span>Desempeno general</span>
                  <span className="font-semibold">{porcentaje}%</span>
                </div>
                <Progress value={porcentaje} />
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button size="lg">
                  <Download className="h-5 w-5" />
                  Descargar PDF
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to={`/eval/${token}`}>
                    <Home className="h-5 w-5" />
                    Volver al inicio
                  </Link>
                </Button>
              </div>
            </section>

            <aside className="flex flex-col items-center justify-center rounded-3xl bg-primary p-6 text-center text-primary-foreground">
              <CheckCircle2 className="mb-4 h-14 w-14" />
              <p className="text-6xl font-black">{porcentaje}%</p>
              <p className="mt-2 text-sm text-white/80">Aprobado con muy buen desempeno</p>
            </aside>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-primary" />
              Detalle por pregunta
            </CardTitle>
            <CardDescription>
              Enunciado, respuesta dada, puntaje obtenido y justificacion breve.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {evaluacionAlumnoMock.preguntas.map((pregunta, index) => (
              <article key={pregunta.id} className="rounded-2xl border bg-card p-4 sm:p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <Badge variant="outline">Pregunta {index + 1}</Badge>
                    <h2 className="mt-3 text-lg font-bold">{pregunta.enunciado}</h2>
                  </div>
                  <div className="rounded-2xl bg-secondary px-4 py-3 text-center">
                    <p className="text-xs text-muted-foreground">Puntaje</p>
                    <p className="text-xl font-extrabold text-primary">
                      {pregunta.puntajeObtenido}/{pregunta.puntajeMaximo}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl bg-muted p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Respuesta dada
                    </p>
                    <p className="mt-2 text-sm leading-6">{pregunta.respuestaDada}</p>
                  </div>
                  <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-100">
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
                      Justificacion breve
                    </p>
                    <p className="mt-2 text-sm leading-6">{pregunta.justificacion}</p>
                  </div>
                </div>
              </article>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
