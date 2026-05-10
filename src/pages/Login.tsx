import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { GraduationCap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"
import { useTheme } from "@/hooks/useTheme"
import { Moon, Sun } from "lucide-react"

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function Login() {
  const navigate = useNavigate()
  const { signInWithGoogle, checkSession, isAuthenticated, isDocente, loading, error } =
    useAuthStore()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    checkSession()
  }, [checkSession])

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isDocente ? "/dashboard" : "/alumno", { replace: true })
    }
  }, [isAuthenticated, isDocente, navigate])

  const handleGoogleLogin = async () => {
    await signInWithGoogle()
    const state = useAuthStore.getState()
    if (state.isAuthenticated) {
      navigate(state.isDocente ? "/dashboard" : "/alumno", { replace: true })
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#0097A7] dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0D47A1]" />

      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-white blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white blur-3xl" />
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="fixed top-4 right-4 rounded-full text-white/70 hover:text-white hover:bg-white/10 z-50"
      >
        {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>

      <div className="relative z-10 w-full max-w-md px-4 space-y-8">
        <div className="text-center space-y-6">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm shadow-2xl shadow-black/10 border border-white/20">
            <GraduationCap className="h-14 w-14 text-white" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              EVALUACIONES SAN JUAN
            </h1>
            <p className="text-sm text-sky-200/80 max-w-xs mx-auto leading-relaxed">
              Nivel Secundario — Ciclo Básico y Orientado — San Juan, República Argentina
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 shadow-2xl shadow-black/10">
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold text-white">
                Bienvenido/a
              </h2>
              <p className="text-sm text-sky-200/80">
                Ingresá con tu cuenta institucional
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/20 border border-red-400/30 p-3 text-center">
                <p className="text-sm text-red-100">{error}</p>
              </div>
            )}

            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-14 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-base rounded-xl shadow-lg shadow-black/10 transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] border-0"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <GoogleIcon className="mr-3 h-5 w-5" />
                  Ingresar con Google
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-transparent px-3 text-sky-200/60">
                  acceso exclusivo para docentes
                </span>
              </div>
            </div>

            <p className="text-center text-xs text-sky-200/50 leading-relaxed">
              Al ingresar aceptás los{" "}
              <button type="button" className="underline hover:text-white transition-colors">
                términos de servicio
              </button>{" "}
              y la{" "}
              <button type="button" className="underline hover:text-white transition-colors">
                política de privacidad
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-sky-200/40">
          Diseño de propiedad intelectual del Profesor RICARDO DAMIÁN CASTRO — San Juan, República Argentina
        </p>
      </div>
    </div>
  )
}
