import { BookOpenCheck, CheckCircle2, GraduationCap, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { tokenDemo } from "@/lib/alumnoFlowMock";
import { useAuthStore } from "@/store/authStore";

const beneficios = [
  "Evaluaciones formales con criterios claros",
  "Seguimiento por curso, division y turno",
  "Reportes listos para compartir con estudiantes",
];

export function Login() {
  const navigate = useNavigate();
  const { user, loading, isDocente, signInWithGoogle, checkSession } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!user || loading) {
      return;
    }

    navigate(isDocente ? "/dashboard" : `/eval/${tokenDemo}`, { replace: true });
  }, [isDocente, loading, navigate, user]);

  const ingresarConGoogle = async () => {
    setError(null);

    try {
      await signInWithGoogle();
    } catch {
      setError("No se pudo iniciar sesion con Google. Revisa la configuracion de Supabase.");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-slate-100 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-700/20" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl dark:bg-blue-800/20" />

      <Card className="glass-card relative w-full max-w-xl border-white/60 shadow-2xl shadow-indigo-500/15">
        <CardContent className="p-8 text-center sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-indigo-500/30">
            <BookOpenCheck className="h-10 w-10" />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.28em] text-primary">EvalAr</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Sistema de Evaluación Secundaria Argentina
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            Plataforma profesional para que docentes creen evaluaciones, administren alumnos y
            revisen resultados con datos de ejemplo.
          </p>

          <Button
            onClick={ingresarConGoogle}
            disabled={loading}
            size="lg"
            className="mt-8 h-14 w-full text-base"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-lg font-black text-slate-900">
                G
              </span>
            )}
            {loading ? "Conectando..." : "Ingresar con Google"}
          </Button>

          {error ? (
            <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </p>
          ) : null}

          <div className="mt-8 grid gap-3 text-left">
            {beneficios.map((beneficio) => (
              <div key={beneficio} className="flex items-center gap-3 rounded-2xl border bg-card/80 p-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm font-medium">{beneficio}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-secondary p-4">
              <ShieldCheck className="mx-auto mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">OAuth seguro</p>
              <p className="mt-1 text-xs text-muted-foreground">Con Supabase Auth</p>
            </div>
            <div className="rounded-2xl bg-secondary p-4">
              <GraduationCap className="mx-auto mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">Redireccion por rol</p>
              <p className="mt-1 text-xs text-muted-foreground">Docente o alumno</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
