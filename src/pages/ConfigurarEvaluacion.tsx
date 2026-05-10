import { Check, FileUp, Loader2, Sparkles, UploadCloud, Users } from "lucide-react";
import { useState } from "react";
import { AlertMessage } from "@/components/AlertMessage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const pasos = [
  "Datos basicos",
  "Contenidos y puntajes",
  "Lista de alumnos",
];

const alumnosMock = [
  {
    nombre: "Mateo",
    apellido: "Garcia",
    dni: "45123456",
    email: "mateo.garcia@estudiante.edu.ar",
    division: "B",
  },
  {
    nombre: "Sofia",
    apellido: "Molina",
    dni: "45234567",
    email: "sofia.molina@estudiante.edu.ar",
    division: "B",
  },
  {
    nombre: "Tomas",
    apellido: "Pereyra",
    dni: "45345678",
    email: "tomas.pereyra@estudiante.edu.ar",
    division: "B",
  },
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
              Formulario guiado de 3 pasos para cargar datos, contenidos y alumnos antes de generar
              una evaluacion con IA.
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
      {pasoActivo === 2 ? <PasoAlumnos /> : null}

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
        titulo="Sin backend por ahora"
        descripcion="Todos los datos son mock. La carga de archivos, Excel e IA quedan listos visualmente para conectar mas adelante."
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
          <CardTitle>Paso 2: Subir archivo de contenidos</CardTitle>
          <CardDescription>Arrastra material en .pdf, .docx o .xlsx para generar consignas.</CardDescription>
        </CardHeader>
        <CardContent>
          <label
            htmlFor="contenidos"
            className="flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed bg-muted/60 p-8 text-center transition hover:bg-accent"
          >
            <UploadCloud className="mb-4 h-12 w-12 text-primary" />
            <span className="text-lg font-bold">Drag & drop de contenidos</span>
            <span className="mt-2 max-w-sm text-sm text-muted-foreground">
              Selecciona o arrastra archivos .pdf, .docx o .xlsx. En esta demo no se suben a ningun
              servidor.
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
          <CardTitle>Configurar puntajes</CardTitle>
          <CardDescription>Distribucion sugerida para una evaluacion de 100 puntos.</CardDescription>
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

function PasoAlumnos() {
  return (
    <Card>
      <CardHeader className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <CardTitle>Paso 3: Cargar lista de alumnos</CardTitle>
          <CardDescription>
            Tabla editable o upload de Excel con columnas: nombre, apellido, DNI, email y division.
          </CardDescription>
        </div>
        <Button variant="outline">
          <FileUp className="h-4 w-4" />
          Upload Excel
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-col gap-3 rounded-2xl border border-dashed bg-muted/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Planilla de alumnos 4to B</p>
              <p className="text-sm text-muted-foreground">Datos mock editables en pantalla.</p>
            </div>
          </div>
          <Badge variant="success">{alumnosMock.length} alumnos cargados</Badge>
        </div>

        <div className="overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Apellido</th>
                <th className="px-4 py-3 font-semibold">DNI</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Division</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {alumnosMock.map((alumno) => (
                <tr key={alumno.dni} className="bg-card">
                  <td className="px-4 py-3">
                    <Input defaultValue={alumno.nombre} aria-label="Nombre alumno" />
                  </td>
                  <td className="px-4 py-3">
                    <Input defaultValue={alumno.apellido} aria-label="Apellido alumno" />
                  </td>
                  <td className="px-4 py-3">
                    <Input defaultValue={alumno.dni} aria-label="DNI alumno" />
                  </td>
                  <td className="px-4 py-3">
                    <Input defaultValue={alumno.email} type="email" aria-label="Email alumno" />
                  </td>
                  <td className="px-4 py-3">
                    <Input defaultValue={alumno.division} aria-label="Division alumno" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
