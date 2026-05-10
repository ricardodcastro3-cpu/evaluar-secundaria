import { ArrowRight, CheckCircle2, Clock3, Lock, RotateCcw, X, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  evaluacionAlumnoMock,
  fastTrackItemsMock,
  getFastTrackResultsKey,
  getFormalStartedKey,
  tokenDemo,
  type FastTrackItemMock,
} from "@/lib/alumnoFlowMock";

interface FeedbackItem {
  itemId: string;
  acerto: boolean;
  puntaje: number;
  puntajeMaximo: number;
}

function evaluarRespuesta(item: FastTrackItemMock, respuesta: string): FeedbackItem {
  if (!respuesta.trim()) {
    return {
      itemId: item.id,
      acerto: false,
      puntaje: 0,
      puntajeMaximo: item.puntajeMaximo,
    };
  }

  if (item.tipo === "multiple") {
    const acerto = respuesta === item.respuestaCorrecta;
    return {
      itemId: item.id,
      acerto,
      puntaje: acerto ? item.puntajeMaximo : 0,
      puntajeMaximo: item.puntajeMaximo,
    };
  }

  const longitud = respuesta.trim().length;
  const puntaje = longitud >= 140 ? item.puntajeMaximo : longitud >= 80 ? Math.round(item.puntajeMaximo * 0.6) : 0;

  return {
    itemId: item.id,
    acerto: puntaje >= Math.round(item.puntajeMaximo * 0.6),
    puntaje,
    puntajeMaximo: item.puntajeMaximo,
  };
}

export function FastTrack() {
  const navigate = useNavigate();
  const { token = tokenDemo } = useParams();
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [segundosRestantes, setSegundosRestantes] = useState(18 * 60);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, FeedbackItem>>({});
  const [finalizado, setFinalizado] = useState(false);
  const [formalIniciada, setFormalIniciada] = useState(false);

  const item = fastTrackItemsMock[preguntaActual];
  const totalPreguntas = fastTrackItemsMock.length;
  const progreso = finalizado ? 100 : ((preguntaActual + 1) / totalPreguntas) * 100;
  const feedbackActual = feedback[item.id];
  const puntajeTotal = Object.values(feedback).reduce((total, actual) => total + actual.puntaje, 0);
  const puntajeMaximo = fastTrackItemsMock.reduce((total, actual) => total + actual.puntajeMaximo, 0);

  const tiempoFormateado = useMemo(() => {
    const minutos = Math.floor(segundosRestantes / 60);
    const segundos = segundosRestantes % 60;
    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
  }, [segundosRestantes]);

  useEffect(() => {
    setFormalIniciada(window.localStorage.getItem(getFormalStartedKey(token)) === "true");
  }, [token]);

  useEffect(() => {
    if (finalizado || formalIniciada) {
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
  }, [finalizado, formalIniciada]);

  const cambiarRespuesta = (valor: string) => {
    const resultado = evaluarRespuesta(item, valor);
    setRespuestas((actuales) => ({
      ...actuales,
      [item.id]: valor,
    }));
    setFeedback((actuales) => ({
      ...actuales,
      [item.id]: resultado,
    }));
  };

  const siguiente = () => {
    if (!feedback[item.id]) {
      setFeedback((actuales) => ({
        ...actuales,
        [item.id]: evaluarRespuesta(item, respuestas[item.id] ?? ""),
      }));
    }

    if (preguntaActual === totalPreguntas - 1) {
      setFinalizado(true);
      window.localStorage.setItem(
        getFastTrackResultsKey(token),
        JSON.stringify({ puntajeTotal, puntajeMaximo, feedback }),
      );
      return;
    }

    setPreguntaActual((actual) => actual + 1);
  };

  const reiniciar = () => {
    setPreguntaActual(0);
    setSegundosRestantes(18 * 60);
    setRespuestas({});
    setFeedback({});
    setFinalizado(false);
    window.localStorage.removeItem(getFastTrackResultsKey(token));
  };

  if (formalIniciada) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="max-w-xl text-center">
          <CardContent className="p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-300">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="mt-5 text-2xl font-bold">Fast Track bloqueado</h1>
            <p className="mt-3 text-muted-foreground">
              Al iniciar la evaluacion formal se borran los resultados de practica y ya no se puede
              volver a simular.
            </p>
            <Button asChild className="mt-6">
              <Link to={`/evaluacion/${token}`}>Volver a la evaluacion formal</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (finalizado) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-indigo-50 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
        <div className="mx-auto max-w-5xl space-y-6">
          <Card className="text-center shadow-2xl shadow-emerald-500/10">
            <CardContent className="p-8 sm:p-10">
              <Badge variant="success">Reporte Fast Track - practica no definitiva</Badge>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
                Puntaje de practica: {puntajeTotal}/{puntajeMaximo}
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Este resultado no se considera nota final y no se envia por PDF. Podes practicar
                nuevamente todas las veces que quieras antes de iniciar la evaluacion formal.
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

          <Card>
            <CardHeader>
              <CardTitle>Reporte de lo practicado</CardTitle>
              <CardDescription>Detalle visual de aciertos y puntajes obtenidos en la simulacion.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {fastTrackItemsMock.map((pregunta, index) => {
                const resultado = feedback[pregunta.id] ?? evaluarRespuesta(pregunta, "");
                return (
                  <div key={pregunta.id} className="rounded-2xl border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold">Item {index + 1}</p>
                      <Badge variant={resultado.acerto ? "success" : "warning"}>
                        {resultado.puntaje}/{resultado.puntajeMaximo}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{pregunta.enunciado}</p>
                    <p className="mt-3 text-sm">
                      <span className="font-semibold">Clave:</span> {pregunta.respuestaCorrecta}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_20rem]">
        <section className="space-y-6">
          <Card className="sticky top-4 z-20 border-primary/20 shadow-lg">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Badge variant="success">Practica Fast Track ilimitada</Badge>
                  <p className="mt-2 text-sm text-muted-foreground">
                    10 items de mayor profundidad que la evaluacion formal · No cuenta como nota
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
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{item.profundidad === "muy alta" ? "Muy alta complejidad" : "Alta complejidad"}</Badge>
                <Badge variant="secondary">{evaluacionAlumnoMock.materia}</Badge>
              </div>
              <CardTitle className="mt-2 text-2xl">{item.enunciado}</CardTitle>
              <CardDescription>
                {item.tipo === "multiple"
                  ? "Selecciona una opcion. El panel lateral mostrara si acertaste."
                  : "Desarrolla tu respuesta. El panel lateral estima puntaje por completitud."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {item.tipo === "multiple" ? (
                <div className="grid gap-3">
                  {item.opciones?.map((opcion) => (
                    <label
                      key={opcion}
                      className="flex cursor-pointer items-center gap-4 rounded-2xl border bg-card p-4 transition hover:border-primary hover:bg-secondary"
                    >
                      <input
                        type="radio"
                        name={item.id}
                        value={opcion}
                        checked={respuestas[item.id] === opcion}
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
                    maxLength={900}
                    value={respuestas[item.id] ?? ""}
                    onChange={(event) => cambiarRespuesta(event.target.value)}
                    placeholder="Escribe tu desarrollo..."
                  />
                  <p className="mt-2 text-right text-sm text-muted-foreground">
                    {(respuestas[item.id] ?? "").length}/900 caracteres
                  </p>
                </div>
              )}

              {feedbackActual ? (
                <div
                  className={`rounded-2xl border p-4 ${
                    feedbackActual.acerto
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
                      : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
                  }`}
                >
                  <p className="font-semibold">
                    {feedbackActual.acerto ? "Acierto registrado" : "Respuesta a revisar"} ·{" "}
                    {feedbackActual.puntaje}/{feedbackActual.puntajeMaximo} puntos
                  </p>
                  <p className="mt-1 text-sm opacity-80">{item.explicacion}</p>
                </div>
              ) : null}

              <div className="flex flex-col-reverse justify-between gap-3 border-t pt-5 sm:flex-row">
                <Button variant="ghost" size="sm" onClick={() => navigate(`/eval/${token}`)}>
                  <X className="h-4 w-4" />
                  Cancelar Fast Track
                </Button>
                <Button onClick={siguiente}>
                  {preguntaActual === totalPreguntas - 1 ? "Finalizar practica" : "Siguiente"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Feedback en vivo</CardTitle>
              <CardDescription>Aciertos y puntaje por item mientras practicas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {fastTrackItemsMock.map((pregunta, index) => {
                const resultado = feedback[pregunta.id];
                return (
                  <div key={pregunta.id} className="flex items-center justify-between rounded-xl border p-3">
                    <div className="flex items-center gap-2">
                      {resultado ? (
                        resultado.acerto ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-amber-500" />
                        )
                      ) : (
                        <span className="h-4 w-4 rounded-full border" />
                      )}
                      <span className="text-sm font-medium">Item {index + 1}</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {resultado ? `${resultado.puntaje}/${resultado.puntajeMaximo}` : "-"}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
