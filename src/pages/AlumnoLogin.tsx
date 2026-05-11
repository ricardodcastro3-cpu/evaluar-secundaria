import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
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

export function AlumnoLogin() {
  const navigate = useNavigate()
  const {
    signInWithGoogleAsAlumno,
    isAuthenticated,
    isDocente,
    loading,
    error,
  } = useAuthStore()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (loading || !isAuthenticated) return
    navigate(isDocente ? "/dashboard" : "/alumno", { replace: true })
  }, [isAuthenticated, isDocente, loading, navigate])

  const handleGoogle = async () => {
    await signInWithGoogleAsAlumno()
    const s = useAuthStore.getState()
    if (s.isAuthenticated) {
      navigate(s.isDocente ? "/dashboard" : "/alumno", { replace: true })
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background dark:bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/12 via-transparent to-[#2563EB]/12" />

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 rounded-xl"
      >
        {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>

      <div className="relative z-10 w-full max-w-md px-4 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#2563EB] shadow-lg">
            <GraduationCap className="h-9 w-9 text-white" strokeWidth={2} />
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#0f172a] dark:text-foreground">
            Acceso alumno
          </h1>
          <p className="text-sm text-muted-foreground">
            Ingresá con Google para ver tus evaluaciones. Si sos docente, usá el{" "}
            <Link to="/login" className="font-semibold text-[#7C3AED] hover:underline">
              acceso docente
            </Link>
            .
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] dark:border-border bg-white dark:bg-card p-8 shadow-[0_8px_32px_-8px_rgba(124,58,237,0.1)] space-y-4">
          {error ? (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 text-sm text-red-800 dark:text-red-200">
              {error}
            </div>
          ) : null}
          <Button
            onClick={handleGoogle}
            disabled={loading}
            variant="secondary"
            className="w-full h-12 bg-white hover:bg-background text-[#0f172a] font-semibold rounded-xl border border-[#E5E7EB] shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin spinner-brand" />
                Conectando…
              </>
            ) : (
              <>
                <GoogleIcon className="mr-2 h-5 w-5" />
                Continuar con Google
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
