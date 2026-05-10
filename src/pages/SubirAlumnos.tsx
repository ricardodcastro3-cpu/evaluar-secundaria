import { Link2, Users } from "lucide-react";
import { AlertMessage } from "@/components/AlertMessage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { alumnosConectadosMock, tokenDemo } from "@/lib/alumnoFlowMock";

export function SubirAlumnos() {
  const linkDemo = `${window.location.origin}/eval/${tokenDemo}`;

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="secondary">Alumnos conectados</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Listado automatico de alumnos</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          El docente no genera ni carga listados. Los alumnos aparecen al recibir el link, ingresar al
          sistema y loguearse para rendir.
        </p>
      </div>

      <AlertMessage
        tipo="info"
        titulo="Alta automatica por link"
        descripcion="El sistema ordena alfabeticamente a los alumnos conectados y asigna una version IA diferente para cada uno."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.65fr]">
        <Card>
          <CardHeader>
            <CardTitle>Link de conexion</CardTitle>
            <CardDescription>Comparte este enlace con el curso. El login del alumno crea el registro.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Input readOnly value={linkDemo} aria-label="Link de conexion alumno" />
            <Button type="button">
              <Link2 className="h-4 w-4" />
              Copiar link
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Users className="mb-3 h-6 w-6 text-primary" />
            <p className="text-4xl font-extrabold">{alumnosConectadosMock.length}</p>
            <p className="text-sm text-muted-foreground">Alumnos conectados hasta ahora</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado generado automaticamente</CardTitle>
          <CardDescription>
            Orden alfabetico por apellido. El docente solo monitorea estados y versiones asignadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-2xl border">
            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Apellido</th>
                  <th className="px-4 py-3 font-semibold">Nombre</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Version IA asignada</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {alumnosConectadosMock.map((alumno) => (
                  <tr key={alumno.email} className="bg-card transition hover:bg-muted/60">
                    <td className="px-4 py-4 font-semibold">{alumno.apellido}</td>
                    <td className="px-4 py-4">{alumno.nombre}</td>
                    <td className="px-4 py-4 text-muted-foreground">{alumno.email}</td>
                    <td className="px-4 py-4">
                      <Badge variant={alumno.estado === "Resultado disponible" ? "success" : "secondary"}>
                        {alumno.estado}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 font-semibold">{alumno.version}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
