import { Download, Mail, Medal, MessageSquareText } from "lucide-react";
import { AlertMessage } from "@/components/AlertMessage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { prepararResumenPDF } from "@/lib/pdfGenerator";
import { useAlumnoStore } from "@/store/alumnoStore";
import { useEvaluacionStore } from "@/store/evaluacionStore";

export function Resultado() {
  const alumno = useAlumnoStore((state) => state.alumnos[0]);
  const evaluacion = useEvaluacionStore((state) => state.evaluacionActiva);
  const resultado = useEvaluacionStore((state) => state.resultados[0]);

  if (!evaluacion || !resultado) {
    return <AlertMessage tipo="info" titulo="Sin resultados" descripcion="Aun no hay entregas disponibles." />;
  }

  const resumenPDF = prepararResumenPDF(alumno, evaluacion, resultado);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_18rem]">
          <div>
            <Badge variant={resultado.aprobado ? "success" : "warning"}>
              {resultado.aprobado ? "Aprobado" : "A reforzar"}
            </Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">Resultado de evaluacion</h1>
            <p className="mt-2 text-muted-foreground">
              {evaluacion.titulo} · {evaluacion.materia}
            </p>
            <div className="mt-6 max-w-xl">
              <div className="mb-2 flex justify-between text-sm">
                <span>Puntaje obtenido</span>
                <span className="font-semibold">
                  {resultado.puntaje}/{resultado.puntajeMaximo}
                </span>
              </div>
              <Progress value={resultado.porcentaje} />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-3xl bg-secondary p-6 text-center">
            <Medal className="mb-3 h-10 w-10 text-primary" />
            <p className="text-5xl font-extrabold text-primary">{resultado.porcentaje}%</p>
            <p className="mt-2 text-sm text-muted-foreground">Desempeno general</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-primary" />
              Devolucion pedagogica
            </CardTitle>
            <CardDescription>Mensaje claro para orientar la mejora.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="rounded-2xl bg-muted p-4 leading-7 text-muted-foreground">
              {resultado.devolucion}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
            <CardDescription>Preparadas para integraciones futuras.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full">
              <Download className="h-4 w-4" />
              Descargar {resumenPDF.archivo}
            </Button>
            <Button variant="outline" className="w-full">
              <Mail className="h-4 w-4" />
              Enviar por correo
            </Button>
            <div className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">
              PDF y Resend quedan como stubs hasta conectar servicios reales.
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertMessage
        tipo="success"
        titulo="Resumen preparado"
        descripcion={`Reporte listo para ${resumenPDF.alumno} con puntaje ${resumenPDF.puntaje}.`}
      />
    </div>
  );
}
