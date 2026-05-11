import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Ban, LogOut, Mail, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { useTheme } from "@/hooks/useTheme"
import { Moon, Sun } from "lucide-react"

export function RejectedDocente() {
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const {
    user,
    loading,
    isAuthenticated,
    isDocente,
    docenteSolicitud,
    signOut,
    refreshAccessState,
  } = useAuthStore()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated) {
      navigate("/login", { replace: true })
      return
    }
    if (isDocente) {
      navigate("/dashboard", { replace: true })
      return
    }
    if (docenteSolicitud?.estado === "pendiente") {
      navigate("/docente/pendiente", { replace: true })
    }
  }, [loading, isAuthenticated, isDocente, docenteSolicitud, navigate])

  const handleResubmit = async () => {
    if (!isSupabaseConfigured() || !supabase || !user) return
    setBusy(true)
    setMsg(null)
    const full =
      [user.nombre, user.apellido].filter(Boolean).join(" ").trim() || "Docente"
    const { error } = await supabase.rpc("create_docente_solicitud", {
      p_nombre: full,
    })
    setBusy(false)
    if (error) {
      setMsg(error.message)
      return
    }
    await refreshAccessState()
    useAuthStore.setState({ solicitudJustCreated: true })
    navigate("/docente/pendiente", { replace: true })
  }

  if (loading || !isAuthenticated || isDocente) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Cargando…</p>
      </div>
    )
  }

  if (docenteSolicitud?.estado !== "rechazado") {
    return null
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 via-transparent to-[#2563EB]/8" />
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 rounded-xl"
      >
        {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-12">
        <div className="w-full space-y-8 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-red-100 dark:bg-red-950/40 ring-2 ring-red-200/80 dark:ring-red-500/30">
            <Ban className="h-12 w-12 text-red-600 dark:text-red-400" strokeWidth={2} />
          </div>

          <div className="space-y-3">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#0f172a] dark:text-foreground">
              No pudimos habilitar tu acceso
            </h1>
            <p className="text-[#6B7280] dark:text-muted-foreground leading-relaxed">
              Tu solicitud fue revisada y en este momento no está autorizado el ingreso como docente. Si creés
              que es un error, contactá al administrador del sistema por correo o por los canales oficiales de
              la institución.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] dark:border-border bg-white/90 dark:bg-card/90 p-6 shadow-sm flex items-start gap-3 text-left">
            <Mail className="h-5 w-5 text-[#7C3AED] shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Cuando el administrador habilite tu cuenta, vas a poder ingresar desde el acceso docente con
              Google.
            </p>
          </div>

          {msg ? (
            <p className="text-sm text-destructive font-medium">{msg}</p>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={handleResubmit}
              disabled={busy}
              className="gap-2 rounded-xl h-11"
            >
              <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
              Volver a enviar solicitud
            </Button>
            <Button
              variant="outline"
              onClick={() => signOut().then(() => navigate("/login"))}
              className="gap-2 rounded-xl h-11"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
