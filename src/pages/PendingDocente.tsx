import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Clock, Mail, LogOut, RefreshCw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"
import { useTheme } from "@/hooks/useTheme"
import { Moon, Sun } from "lucide-react"

/** Ilustración ligera (aula / espera) — tonos cálidos acordes a la marca */
function PendingIllustration() {
  return (
    <div className="mx-auto w-full max-w-[240px] rounded-2xl border border-amber-200/70 bg-gradient-to-b from-amber-50/95 via-white to-sky-50/80 p-4 shadow-[0_12px_32px_-8px_rgba(245,158,11,0.2)] dark:border-amber-500/25 dark:from-amber-950/35 dark:via-card dark:to-[#1a142e]/90">
      <svg viewBox="0 0 220 120" className="h-auto w-full" aria-hidden>
        <defs>
          <linearGradient id="pend-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <rect x="12" y="24" width="196" height="72" rx="14" fill="url(#pend-grad)" opacity="0.9" />
        <rect x="22" y="34" width="176" height="52" rx="8" fill="white" fillOpacity="0.95" />
        <circle cx="52" cy="60" r="14" fill="#F59E0B" fillOpacity="0.35" />
        <path
          d="M46 68c4-8 12-8 16 0"
          stroke="#7C3AED"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="88" y="48" width="96" height="8" rx="4" fill="#CBD5E1" />
        <rect x="88" y="64" width="72" height="8" rx="4" fill="#CBD5E1" />
        <circle cx="188" cy="38" r="6" fill="#F59E0B" />
        <circle cx="168" cy="22" r="4" fill="#10B981" />
        <circle cx="200" cy="24" r="3" fill="#7C3AED" />
      </svg>
      <p className="mt-2 text-center text-[11px] font-medium leading-snug text-amber-900/80 dark:text-amber-100/85">
        Estamos revisando tu solicitud con calma y cuidado
      </p>
    </div>
  )
}

export function PendingDocente() {
  const navigate = useNavigate()
  const highlightNuevaRef = useRef(useAuthStore.getState().solicitudJustCreated)
  const {
    user,
    loading,
    isAuthenticated,
    isDocente,
    docenteSolicitud,
    signOut,
    refreshAccessState,
    clearSolicitudJustCreated,
  } = useAuthStore()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    clearSolicitudJustCreated()
  }, [clearSolicitudJustCreated])

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
    if (docenteSolicitud?.estado === "rechazado") {
      navigate("/docente/rechazado", { replace: true })
    }
  }, [loading, isAuthenticated, isDocente, docenteSolicitud, navigate])

  const handleRefresh = async () => {
    await refreshAccessState()
    const s = useAuthStore.getState()
    if (s.isDocente) navigate("/dashboard", { replace: true })
  }

  if (loading || !isAuthenticated || isDocente) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Cargando…</p>
      </div>
    )
  }

  if (docenteSolicitud?.estado !== "pendiente") {
    return null
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/14 via-[#FEF3C7]/35 to-[#2563EB]/12 dark:from-[#7C3AED]/22 dark:via-background dark:to-[#2563EB]/12" />
      <div className="absolute top-20 left-[12%] h-48 w-48 rounded-full bg-[#F59E0B]/20 blur-3xl pointer-events-none" />
      <div className="absolute top-24 right-[10%] h-64 w-64 rounded-full bg-[#C4B5FD]/28 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-[8%] h-72 w-72 rounded-full bg-[#2563EB]/12 blur-3xl pointer-events-none" />

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 rounded-xl text-foreground hover:bg-black/5"
      >
        {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-12">
        <div className="w-full space-y-8 text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#2563EB] shadow-xl shadow-[rgba(124,58,237,0.35)] ring-4 ring-[#F59E0B]/25">
            <div className="relative">
              <Clock className="h-14 w-14 text-white opacity-95" strokeWidth={1.75} />
              <Mail className="absolute -right-1 -bottom-1 h-8 w-8 text-white/90 drop-shadow" strokeWidth={2} />
            </div>
          </div>

          <PendingIllustration />

          <div className="space-y-3">
            {highlightNuevaRef.current ? (
              <p className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-4 py-1.5 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                <Sparkles className="h-4 w-4" />
                Solicitud enviada
              </p>
            ) : null}
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              Tu solicitud está siendo revisada
            </h1>
            <p className="text-base text-[#6B7280] dark:text-muted-foreground leading-relaxed max-w-md mx-auto">
              El administrador del sistema revisará tu solicitud y te notificará cuando estés habilitado para
              usar la plataforma como docente.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] dark:border-border bg-white/90 dark:bg-card/90 backdrop-blur-md p-6 shadow-[0_12px_40px_-10px_rgba(124,58,237,0.14)] text-left space-y-3">
            <p className="text-sm font-semibold text-foreground">Mientras tanto…</p>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li>Podés cerrar sesión y volver más tarde.</li>
              <li>Cuando recibas la confirmación, tocá &quot;Ya estoy habilitado&quot; para entrar.</li>
              <li>Si tenés dudas, contactá a tu administrador.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button onClick={handleRefresh} className="gap-2 rounded-xl h-11">
              <RefreshCw className="h-4 w-4" />
              Ya estoy habilitado
            </Button>
            <Button
              variant="outline"
              onClick={() => signOut().then(() => navigate("/login"))}
              className="gap-2 rounded-xl h-11 border-[#E5E7EB]"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>

          {user ? (
            <p className="text-xs text-muted-foreground">
              Sesión: <span className="font-medium text-foreground">{user.email}</span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
