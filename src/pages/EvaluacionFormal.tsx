import { AlertTriangle, ArrowRight, Clock3, Send, ShieldAlert, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertMessage } from "@/components/AlertMessage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { evaluacionAlumnoMock, tokenDemo } from "@/lib/alumnoFlowMock";

export function EvaluacionFormal() {
  const navigate = useNavigate();
  const { token = tokenDemo } = useParams();
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [segundosRestantes, setSegundosRestantes] = useState(evaluacionAlumnoMock.duracion * 60);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [mostrarAlertaSalida, setMostrarAlertaSalida] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const pregunta = evaluacionAlumnoMock.preguntas[preguntaActual];
  const totalPreguntas = evaluacionAlumnoMock.preguntas.length;
  const progreso = ((preguntaActual + 1) / totalPreguntas) * 100;

  const tiempoFormateado = useMemo(() => {
    const minutos = Math.floor(segundosRestantes / 60);
    const segundos = segundosRestantes % 60;
    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
  }, [segundosRestantes]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSegundosRestantes((actual) => Math.max(0, actual - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const registrarCambio = () => {
      if (document.visibilityState === "hidden") {
        setMostrarAlertaSalida(true);
      }
    };

    document.addEventListener("visibilitychange", registrarCambio);
    return () => document.removeEventListener("visibilitychange", registrarCambio);
  }, []);

  const cambiarRespuesta = (valor: string) => {
    setRespuestas((actuales) => ({
      ...actuales,
      [pregunta.id]: valor,
    }));
  };

  const avanzar = () => {
    if (preguntaActual === totalPreguntas - 1) {
      setMostrarModal(true);
      return;
    }

    setPreguntaActual((actual) => actual + 1);
  };

  const finalizar = () => {
    setMostrarModal(false);
    navigate(`/resultado/${token}`);
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl border border-red-300 bg-red-600 p-4 text-white shadow-lg shadow-red-500/20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-6 w-6 shrink-0" />
              <div>
                <p className="font-extrabold tracking-wide">
                  EVALUACIÓN FORMAL - No se puede pausar ni reiniciar
                </p>
                <p className="text-sm text-white/80">
                  La salida de pantalla queda registrada en esta instancia.
                </p>
              </div>
            </div>
            <Badge className="bg-white/15 text-white">Intento unico</Badge>
          </div>
        </div>

        {mostrarAlertaSalida ? (
          <AlertMessage
            tipo="error"
            titulo="Se registró que saliste de la evaluación"
            descripcion="Esta alerta es visual en la demo; en produccion quedaria registrada en el intento."
          />
        ) : null}

        <Card className="sticky top-4 z-20 border-red-200 shadow-lg">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge variant="outline">Evaluacion Formal</Badge>
                <p className="mt-2 text-sm text-muted-foreground">
                  {evaluacionAlumnoMock.materia} · {evaluacionAlumnoMock.alumno}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-xl font-extrabold text-red-700 dark:bg-red-950/40 dark:text-red-200">
                <Clock3 className="h-5 w-5" />
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
              Responde con atencion. Esta instancia tiene una sola oportunidad.
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
                  maxLength={900}
                  value={respuestas[pregunta.id] ?? ""}
                  onChange={(event) => cambiarRespuesta(event.target.value)}
                  placeholder="Escribe tu respuesta final..."
                />
                <p className="mt-2 text-right text-sm text-muted-foreground">
                  {(respuestas[pregunta.id] ?? "").length}/900 caracteres
                </p>
              </div>
            )}

            <div className="flex justify-end border-t pt-5">
              <Button onClick={avanzar}>
                {preguntaActual === totalPreguntas - 1 ? (
                  <>
                    <Send className="h-4 w-4" />
                    Finalizar
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {mostrarModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg border-red-200 shadow-2xl">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-300">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <CardTitle>¿Estás seguro? Esta acción es irreversible</CardTitle>
              <CardDescription>
                Al finalizar se enviaran tus respuestas y no podras pausar, reiniciar ni repetir la
                evaluacion formal.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setMostrarModal(false)}>
                <X className="h-4 w-4" />
                Revisar respuestas
              </Button>
              <Button variant="destructive" onClick={finalizar}>
                <Send className="h-4 w-4" />
                Finalizar definitivamente
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </main>
  );
}
