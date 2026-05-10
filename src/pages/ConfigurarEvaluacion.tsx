import { Check, Copy, Link2, Loader2, Sparkles, UploadCloud, Users } from "lucide-react";
import { useState } from "react";
import { AlertMessage } from "@/components/AlertMessage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { alumnosConectadosMock, tokenDemo } from "@/lib/alumnoFlowMock";

const pasos = [
  "Datos basicos",
  "Contenido e IA",
  "Link y alumnos conectados",
];

export function ConfigurarEvaluacion() {
  const [pasoActivo, setPasoActivo] = useState(0);
  const [generando, setGenerando] = useState(false);

  const generarEvaluacion = () => {
    setGenerando(true);
    window.setTimeout(() => setGenerando(false), 1800);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <Badge variant="secondary">Nueva Evaluacion</Badge>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">Configurar Evaluación</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              El docente carga el contenido y comparte el link. Los alumnos aparecen automaticamente
              al ingresar, ordenados alfabeticamente, y cada uno recibe una version IA diferente.
            </p>
          </div>
          <Button
            onClick={generarEvaluacion}
            disabled={generando}
            size="lg"
            className="h-12 shrink-0 shadow-lg shadow-indigo-500/20"
          >
            {generando ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
            {generando ? "Generando..." : "Generar Evaluación con IA"}
          </Button>
        </div>
      </section>

      <Card>
        <CardContent className="p-5">
          <div className="grid gap-3 md:grid-cols-3">
            {pasos.map((paso, index) => {
              const activo = index === pasoActivo;
              const completo = index < pasoActivo;

              return (
                <button
                  key={paso}
                  type="button"
                  onClick={() => setPasoActivo(index)}
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                    activo
                      ? "border-primary bg-secondary shadow-sm"
                      : completo
                        ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30"
                        : "bg-background hover:bg-muted"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      activo || completo
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {completo ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                      Paso {index + 1}
                    </span>
                    <span className="font-semibold">{paso}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {pasoActivo === 0 ? <PasoDatosBasicos /> : null}
      {pasoActivo === 1 ? <PasoContenidos /> : null}
      {pasoActivo === 2 ? <PasoLinkYAlumnos /> : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          disabled={pasoActivo === 0}
          onClick={() => setPasoActivo((paso) => Math.max(0, paso - 1))}
        >
          Anterior
        </Button>
        {pasoActivo < pasos.length - 1 ? (
          <Button onClick={() => setPasoActivo((paso) => Math.min(pasos.length - 1, paso + 1))}>
            Continuar
          </Button>
        ) : (
          <Button onClick={generarEvaluacion} disabled={generando}>
            {generando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {generando ? "Generando evaluacion..." : "Generar Evaluación con IA"}
          </Button>
        )}
      </div>

      <AlertMessage
        tipo="info"
        titulo="Los alumnos no se cargan manualmente"
        descripcion="El listado se forma automaticamente con quienes reciben el link, ingresan al sistema y se loguean para rendir."
      />
    </div>
  );
}

function PasoDatosBasicos() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 1: Datos basicos</CardTitle>
        <CardDescription>Informacion general de la evaluacion y del curso.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="grid gap-2 sm:col-span-2 xl:col-span-3">
          <Label htmlFor="nombre">Nombre evaluacion</Label>
          <Input id="nombre" defaultValue="Funciones lineales y modelizacion" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="materia">Materia</Label>
          <Input id="materia" defaultValue="Matematica" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="curso">Curso</Label>
          <Select id="curso" defaultValue="4">
            <option value="1">1ro</option>
            <option value="2">2do</option>
            <option value="3">3ro</option>
            <option value="4">4to</option>
            <option value="5">5to</option>
            <option value="6">6to</option>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="division">Division</Label>
          <Input id="division" defaultValue="B" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="turno">Turno</Label>
          <Select id="turno" defaultValue="manana">
            <option value="manana">Manana</option>
            <option value="tarde">Tarde</option>
            <option value="noche">Noche</option>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="fecha">Fecha</Label>
          <Input id="fecha" type="date" defaultValue="2026-05-18" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="duracion">Duracion en minutos</Label>
          <Input id="duracion" type="number" defaultValue={45} />
        </div>
      </CardContent>
    </Card>
  );
}

function PasoContenidos() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <CardHeader>
          <CardTitle>Paso 2: Archivo fuente para IA</CardTitle>
          <CardDescription>
            Arrastra material en .pdf, .docx o .xlsx. A partir de ese contenido se genera una
            evaluacion distinta para cada alumno logueado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label
            htmlFor="contenidos"
            className="flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed bg-muted/60 p-8 text-center transition hover:bg-accent"
          >
            <UploadCloud className="mb-4 h-12 w-12 text-primary" />
            <span className="text-lg font-bold">Drag & drop del documento base</span>
            <span className="mt-2 max-w-sm text-sm text-muted-foreground">
              El docente solo adjunta el documento. No carga alumnos ni versiones manuales.
            </span>
            <Input id="contenidos" type="file" className="hidden" accept=".pdf,.docx,.xlsx" />
            <Badge variant="secondary" className="mt-5">
              Programa-matematica-4b.pdf
            </Badge>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurar criterios y puntajes</CardTitle>
          <CardDescription>
            La IA usa estos criterios para armar consignas, respuestas esperadas y rubricas por alumno.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            ["Comprension conceptual", 30],
            ["Procedimiento y resolucion", 40],
            ["Justificacion escrita", 20],
            ["Presentacion", 10],
          ].map(([criterio, puntaje]) => (
            <div key={criterio} className="grid gap-3 rounded-2xl border p-4 sm:grid-cols-[1fr_8rem]">
              <div>
                <Label>{criterio}</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Criterio editable para la rubrica generada por IA.
                </p>
              </div>
              <Input type="number" defaultValue={puntaje} aria-label={`Puntaje ${criterio}`} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function PasoLinkYAlumnos() {
  const linkDemo = `${window.location.origin}/eval/${tokenDemo}`;

  return (
    <Card>
      <CardHeader className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <CardTitle>Paso 3: Link y alumnos conectados</CardTitle>
          <CardDescription>
            Comparte el link. El listado se genera automaticamente con los alumnos que ingresan y se
            loguean.
          </CardDescription>
        </div>
        <Button variant="outline" type="button">
          <Copy className="h-4 w-4" />
          Copiar link
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
          <div className="rounded-2xl border bg-muted/60 p-4">
            <Label htmlFor="link-evaluacion">Link de conexion para alumnos</Label>
            <div className="mt-2 flex gap-2">
              <Input id="link-evaluacion" readOnly value={linkDemo} />
              <Button variant="secondary" size="icon" aria-label="Copiar link">
                <Link2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Al loguearse desde este link, el alumno queda asociado a la evaluacion y recibe una
              version IA unica.
            </p>
          </div>
          <div className="rounded-2xl border bg-secondary p-4">
            <Users className="mb-3 h-5 w-5 text-primary" />
            <p className="text-3xl font-extrabold">{alumnosConectadosMock.length}</p>
            <p className="text-sm text-muted-foreground">Alumnos conectados automaticamente</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border bg-muted/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Listado alfabetico generado por login</p>
              <p className="text-sm text-muted-foreground">
                El docente no importa planillas ni agrega estudiantes manualmente.
              </p>
            </div>
          </div>
          <Badge variant="success">Ordenado A-Z</Badge>
        </div>

        <div className="overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[780px] border-collapse text-left text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Apellido</th>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Version IA</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {alumnosConectadosMock.map((alumno) => (
                <tr key={alumno.email} className="bg-card">
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
  );
}
