import { ArrowRight, CheckCircle2, Clock3, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { evaluacionAlumnoMock, tokenDemo } from "@/lib/alumnoFlowMock";

export function FastTrack() {
  const navigate = useNavigate();
  const { token = tokenDemo } = useParams();
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [segundosRestantes, setSegundosRestantes] = useState(8 * 60);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [finalizado, setFinalizado] = useState(false);

  const pregunta = evaluacionAlumnoMock.preguntas[preguntaActual];
  const totalPreguntas = evaluacionAlumnoMock.preguntas.length;
  const progreso = finalizado ? 100 : ((preguntaActual + 1) / totalPreguntas) * 100;

  const tiempoFormateado = useMemo(() => {
    const minutos = Math.floor(segundosRestantes / 60);
    const segundos = segundosRestantes % 60;
    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
  }, [segundosRestantes]);

  useEffect(() => {
    if (finalizado) {
      return;
    }

    const interval = window.setInterval(() => {
      setSegundosRestantes((actual) => {
        if (actual <= 1) {
          window.clearInterval(interval);
          setFinalizado(true);
          return 0;
        }

        return actual - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [finalizado]);

  const cambiarRespuesta = (valor: string) => {
    setRespuestas((actuales) => ({
      ...actuales,
      [pregunta.id]: valor,
    }));
  };

  const siguiente = () => {
    if (preguntaActual === totalPreguntas - 1) {
      setFinalizado(true);
      return;
    }

    setPreguntaActual((actual) => actual + 1);
  };

  const reiniciar = () => {
    setPreguntaActual(0);
    setSegundosRestantes(8 * 60);
    setRespuestas({});
    setFinalizado(false);
  };

  if (finalizado) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-indigo-50 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center">
          <Card className="w-full text-center shadow-2xl shadow-emerald-500/10">
            <CardContent className="p-8 sm:p-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
                <CheckCircle2 className="h-11 w-11" />
              </div>
              <Badge variant="success" className="mt-6">Fast Track completado</Badge>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight">Puntaje: 82/100</h1>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Buen desempeno general. Recomendamos repasar interpretacion de problemas antes de
                iniciar la evaluacion formal.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Button onClick={reiniciar} variant="outline" size="lg">
                  <RotateCcw className="h-5 w-5" />
                  Volver a practicar
                </Button>
                <Button asChild size="lg">
                  <Link to={`/evaluacion/${token}`}>
                    Ir a Evaluación Formal
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card className="sticky top-4 z-20 border-primary/20 shadow-lg">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge variant="success">Practica Fast Track</Badge>
                <p className="mt-2 text-sm text-muted-foreground">
                  {evaluacionAlumnoMock.materia} · {evaluacionAlumnoMock.alumno}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-xl font-extrabold">
                <Clock3 className="h-5 w-5 text-primary" />
                {tiempoFormateado}
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold">
                  Pregunta {preguntaActual + 1} de {totalPreguntas}
                </span>
                <span className="text-muted-foreground">{Math.round(progreso)}%</span>
              </div>
              <Progress value={progreso} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{pregunta.enunciado}</CardTitle>
            <CardDescription>
              {pregunta.tipo === "multiple"
                ? "Selecciona una de las opciones."
                : "Escribe una respuesta breve y clara."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {pregunta.tipo === "multiple" ? (
              <div className="grid gap-3">
                {pregunta.opciones?.map((opcion) => (
                  <label
                    key={opcion}
                    className="flex cursor-pointer items-center gap-4 rounded-2xl border bg-card p-4 transition hover:border-primary hover:bg-secondary"
                  >
                    <input
                      type="radio"
                      name={pregunta.id}
                      value={opcion}
                      checked={respuestas[pregunta.id] === opcion}
                      onChange={(event) => cambiarRespuesta(event.target.value)}
                      className="h-6 w-6 accent-[#4F46E5]"
                    />
                    <span className="text-base font-semibold">{opcion}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div>
                <Textarea
                  className="min-h-48 text-base"
                  maxLength={600}
                  value={respuestas[pregunta.id] ?? ""}
                  onChange={(event) => cambiarRespuesta(event.target.value)}
                  placeholder="Escribe tu respuesta..."
                />
                <p className="mt-2 text-right text-sm text-muted-foreground">
                  {(respuestas[pregunta.id] ?? "").length}/600 caracteres
                </p>
              </div>
            )}

            <div className="flex flex-col-reverse justify-between gap-3 border-t pt-5 sm:flex-row">
              <Button variant="ghost" size="sm" onClick={() => navigate(`/eval/${token}`)}>
                <X className="h-4 w-4" />
                Cancelar Fast Track
              </Button>
              <Button onClick={siguiente}>
                {preguntaActual === totalPreguntas - 1 ? "Finalizar" : "Siguiente"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
