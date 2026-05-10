import { ArrowRight, BookOpenCheck, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import type { RolUsuario } from "@/types";

const beneficios = [
  "Criterios claros para evaluaciones formales",
  "Fast Track para diagnosticos rapidos",
  "Resultados listos para comunicar a estudiantes",
];

export function Login() {
  const navigate = useNavigate();
  const loginDemo = useAuthStore((state) => state.loginDemo);

  const ingresar = (rol: RolUsuario) => {
    loginDemo(rol);
    navigate(rol === "docente" ? "/docente" : "/alumno");
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            Plataforma demo sin conexion a Supabase
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            EvalAr Secundaria para docentes de Argentina.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Crea evaluaciones, carga cursos, acompana el progreso de tus estudiantes y comunica
            devoluciones con una experiencia moderna, simple y responsive.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {beneficios.map((beneficio) => (
              <div key={beneficio} className="rounded-2xl border bg-card/80 p-4 shadow-sm">
                <ShieldCheck className="mb-3 h-5 w-5 text-primary" />
                <p className="text-sm font-medium">{beneficio}</p>
              </div>
            ))}
          </div>
        </section>

        <Card className="glass-card border-white/40 shadow-2xl shadow-indigo-500/10">
          <CardHeader>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <BookOpenCheck className="h-7 w-7" />
            </div>
            <CardTitle>Ingresar a EvalAr</CardTitle>
            <CardDescription>
              Usa los accesos demo para recorrer el panel docente o la vista de estudiante.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo institucional</Label>
              <Input id="email" type="email" placeholder="docente@escuela.edu.ar" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contrasena</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button onClick={() => ingresar("docente")} className="w-full">
                Soy docente
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button onClick={() => ingresar("alumno")} variant="outline" className="w-full">
                Soy alumno
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Autenticacion real pendiente para una proxima integracion.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
