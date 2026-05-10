import { Send, ShieldQuestion } from "lucide-react";
import { TimerBar } from "@/components/TimerBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useEvaluacionStore } from "@/store/evaluacionStore";

export function EvaluacionFormal() {
  const evaluacion = useEvaluacionStore((state) => state.evaluacionActiva);

  if (!evaluacion) {
    return (
      <Card>
        <CardContent className="p-6">No hay evaluacion activa.</CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <main className="space-y-6">
        <Card>
          <CardHeader>
            <Badge variant="secondary" className="w-fit">Evaluacion formal</Badge>
            <CardTitle className="mt-2 text-3xl">{evaluacion.titulo}</CardTitle>
            <CardDescription>
              {evaluacion.materia} · Dificultad {evaluacion.dificultad} · {evaluacion.duracionMinutos} minutos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
              Lee cada consigna con atencion. Tus respuestas se guardaran cuando la plataforma
              este conectada al backend.
            </div>
          </CardContent>
        </Card>

        {evaluacion.preguntas.map((pregunta, index) => (
          <Card key={pregunta.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldQuestion className="h-5 w-5 text-primary" />
                  Consigna {index + 1}
                </CardTitle>
                <Badge variant="outline">{pregunta.puntaje} pts</Badge>
              </div>
              <CardDescription>{pregunta.consigna}</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Escribe tu respuesta aqui..." className="min-h-40" />
            </CardContent>
          </Card>
        ))}
      </main>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <TimerBar minutosTotales={evaluacion.duracionMinutos} minutosRestantes={32} />
        <Card>
          <CardHeader>
            <CardTitle>Entrega</CardTitle>
            <CardDescription>Revisa tus respuestas antes de enviar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
              2 consignas pendientes de guardar en esta demo visual.
            </div>
            <Button className="w-full">
              <Send className="h-4 w-4" />
              Enviar evaluacion
            </Button>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
