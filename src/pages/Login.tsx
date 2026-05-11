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

function destinationAfterDocenteLogin() {
  const s = useAuthStore.getState()
  const sol = s.docenteSolicitud
  if (sol?.estado === "pendiente") return "/docente/pendiente"
  if (sol?.estado === "rechazado") return "/docente/rechazado"
  if (s.isDocente) return "/dashboard"
  if (s.isAdmin) return "/admin/docentes"
  return "/alumno"
}

export function Login() {
  const navigate = useNavigate()
  const {
    signInWithGoogle,
    isAuthenticated,
    loading,
    error,
    docenteSolicitud,
    isDocente,
    isAdmin,
  } = useAuthStore()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (loading || !isAuthenticated) return
    navigate(destinationAfterDocenteLogin(), { replace: true })
  }, [isAuthenticated, loading, navigate, docenteSolicitud, isDocente, isAdmin])

  const handleGoogleLogin = async () => {
    await signInWithGoogle()
    const state = useAuthStore.getState()
    if (state.isAuthenticated) {
      navigate(destinationAfterDocenteLogin(), { replace: true })
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 login-animated-gradient" />

      <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
        <div className="absolute top-16 left-[8%] h-80 w-80 rounded-full bg-white blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-[5%] h-96 w-96 rounded-full bg-[#C4B5FD] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-[#2563EB] blur-3xl opacity-60" />
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 rounded-xl text-white/90 hover:text-white hover:bg-white/15 border-0 shadow-none hover:!translate-y-0"
      >
        {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>

      <div className="relative z-10 w-full max-w-md px-4 space-y-8 page-enter">
        <div className="text-center space-y-6">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-2xl glass-panel">
            <GraduationCap className="h-14 w-14 text-white" strokeWidth={2} />
          </div>

          <div className="space-y-2">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
              EVALUACIONES SAN JUAN
            </h1>
            <p className="text-sm text-white/85 max-w-xs mx-auto leading-relaxed font-medium">
              Nivel Secundario — Ciclo Básico y Orientado — San Juan, República Argentina
            </p>
          </div>
        </div>

        <div className="glass-panel glass-panel-elevated rounded-[20px] p-8 sm:p-9">
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="font-heading text-xl font-bold text-white">
                Acceso docente
              </h2>
              <p className="text-sm text-white/75">
                Solo personal docente: ingresá con Google. Si tu correo aún no está autorizado, se enviará una
                solicitud al administrador.
              </p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/25 border border-red-400/40 p-3 text-center backdrop-blur-sm">
                <p className="text-sm text-red-50 font-medium">{error}</p>
              </div>
            )}

            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              variant="secondary"
              className="w-full h-14 bg-white hover:bg-[#F8FAFC] text-slate-900 font-bold text-base rounded-[12px] shadow-[0_20px_50px_-14px_rgba(15,23,42,0.38),0_8px_24px_-8px_rgba(124,58,237,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_56px_-12px_rgba(15,23,42,0.42),0_12px_28px_-6px_rgba(37,99,235,0.2)] active:translate-y-0 border-0"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin spinner-brand" />
                  Conectando...
                </>
              ) : (
                <>
                  <GoogleIcon className="mr-3 h-5 w-5" />
                  Ingresar con Google
                </>
              )}
            </Button>

            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-left">
              <p className="text-xs text-white/90 leading-relaxed">
                <span className="font-subheading text-white">Estudiantes:</span> el acceso no es por esta
                pantalla. Usan el enlace que su docente publica en el tablón del aula (por ejemplo Google Classroom).
                Ese enlace los lleva a practicar con <strong className="font-semibold">Fast Track</strong> o a
                iniciar la <strong className="font-semibold">evaluación formal</strong>, según decidan. Iniciar sesión
                con Google acá es <span className="font-semibold">solo para docentes</span>, para evitar pedidos de
                autorización por error.
              </p>
            </div>

            <p className="text-center text-xs text-white/60 leading-relaxed">
              Al ingresar aceptás los{" "}
              <button type="button" className="underline decoration-white/40 hover:text-white transition-colors font-medium">
                términos de servicio
              </button>{" "}
              y la{" "}
              <button type="button" className="underline decoration-white/40 hover:text-white transition-colors font-medium">
                política de privacidad
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-white/45 max-w-sm mx-auto">
          Diseño de propiedad intelectual del Profesor RICARDO DAMIÁN CASTRO — San Juan, República Argentina
        </p>
      </div>
    </div>
  )
}
