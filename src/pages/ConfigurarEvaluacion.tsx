import { CalendarDays, Plus, Save } from "lucide-react";
import { AlertMessage } from "@/components/AlertMessage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEvaluacionStore } from "@/store/evaluacionStore";

export function ConfigurarEvaluacion() {
  const evaluacionActiva = useEvaluacionStore((state) => state.evaluacionActiva);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Badge variant="secondary">Constructor de evaluaciones</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Configurar evaluacion</h1>
          <p className="mt-2 text-muted-foreground">
            Define datos generales, criterios y consignas para una instancia formal.
          </p>
        </div>
        <Button>
          <Save className="h-4 w-4" />
          Guardar borrador
        </Button>
      </div>

      <AlertMessage
        tipo="info"
        titulo="Estructura visual lista"
        descripcion="Los campos son demostrativos. La persistencia se conectara cuando Supabase este habilitado."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Datos generales</CardTitle>
              <CardDescription>Informacion principal que vera el curso.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="titulo">Titulo</Label>
                <Input id="titulo" defaultValue={evaluacionActiva?.titulo} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="materia">Materia</Label>
                <Input id="materia" defaultValue={evaluacionActiva?.materia} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="curso">Curso</Label>
                <Select id="curso" defaultValue="curso-4b">
                  <option value="curso-4b">4to B - Turno manana</option>
                  <option value="curso-5a">5to A - Turno tarde</option>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select id="tipo" defaultValue={evaluacionActiva?.tipo}>
                  <option value="formal">Evaluacion formal</option>
                  <option value="fast-track">Fast Track</option>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duracion">Duracion</Label>
                <Input id="duracion" type="number" defaultValue={evaluacionActiva?.duracionMinutos} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Criterios de evaluacion</CardTitle>
              <CardDescription>Rubrica sugerida para una devolucion transparente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Comprension conceptual", "Resolucion y procedimiento", "Comunicacion escrita"].map(
                (criterio, index) => (
                  <div key={criterio} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_7rem]">
                    <div>
                      <Input defaultValue={criterio} aria-label={`Criterio ${index + 1}`} />
                      <Textarea
                        className="mt-3"
                        defaultValue="Describe evidencias esperadas y aspectos a retroalimentar."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Puntaje</Label>
                      <Input type="number" defaultValue={index === 0 ? 4 : 3} />
                    </div>
                  </div>
                ),
              )}
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4" />
                Agregar criterio
              </Button>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Programacion</CardTitle>
              <CardDescription>Fecha, dificultad y estado.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="fecha">Fecha</Label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="fecha" type="date" className="pl-9" defaultValue={evaluacionActiva?.fecha} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dificultad">Dificultad</Label>
                <Select id="dificultad" defaultValue={evaluacionActiva?.dificultad}>
                  <option value="basico">Basico</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </Select>
              </div>
              <Button className="w-full">Publicar evaluacion</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consignas</CardTitle>
              <CardDescription>Vista previa de preguntas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {evaluacionActiva?.preguntas.map((pregunta) => (
                <div key={pregunta.id} className="rounded-xl bg-muted p-3">
                  <p className="text-sm font-medium">{pregunta.consigna}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{pregunta.puntaje} puntos</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
