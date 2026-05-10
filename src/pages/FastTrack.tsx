import { BrainCircuit, CheckCircle2, WandSparkles } from "lucide-react";
import { AlertMessage } from "@/components/AlertMessage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const pasos = [
  "Selecciona contenido prioritario",
  "Define cantidad de preguntas",
  "Comparte el enlace con el curso",
];

export function FastTrack() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card className="border-0 bg-primary text-primary-foreground shadow-xl shadow-indigo-500/20">
          <CardContent className="p-6 sm:p-8">
            <Badge className="bg-white/15 text-white">Fast Track</Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Diagnosticos rapidos para decidir que reforzar.
            </h1>
            <p className="mt-3 text-white/80">
              Genera una actividad breve para obtener una senal temprana del estado del grupo.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Como funciona</CardTitle>
            <CardDescription>Flujo simple de tres pasos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pasos.map((paso, index) => (
              <div key={paso} className="flex items-center gap-3 rounded-xl bg-muted p-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="text-sm font-medium">{paso}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Configurar diagnostico</CardTitle>
            <CardDescription>Parametros principales del Fast Track.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="materia">Materia</Label>
              <Input id="materia" defaultValue="Historia" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tema">Tema</Label>
              <Input id="tema" defaultValue="Modelo agroexportador argentino" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cantidad">Cantidad de preguntas</Label>
              <Select id="cantidad" defaultValue="5">
                <option value="3">3 preguntas</option>
                <option value="5">5 preguntas</option>
                <option value="8">8 preguntas</option>
              </Select>
            </div>
            <Button className="w-full">
              <WandSparkles className="h-4 w-4" />
              Generar actividad demo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <CardTitle>Vista previa</CardTitle>
            <CardDescription>Consignas generadas visualmente, sin llamada a Gemini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((numero) => (
              <div key={numero} className="rounded-xl border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <p className="font-semibold">Pregunta {numero}</p>
                </div>
                <Textarea defaultValue="Explica con tus palabras una causa y una consecuencia del proceso trabajado." />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <AlertMessage
        tipo="warning"
        titulo="IA pendiente de integracion"
        descripcion="El archivo gemini.ts esta preparado con una funcion mock para conectar la API mas adelante."
      />
    </div>
  );
}
