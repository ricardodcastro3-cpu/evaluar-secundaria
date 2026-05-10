import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { exchangeOAuthCodeIfPresent, isSupabaseConfigured, supabase } from "@/lib/supabase"
import { useAuthStore } from "@/store/authStore"
import { peekOauthIntent } from "@/lib/oauthContext"
import type { OauthIntent } from "@/lib/oauthContext"
import { LoadingSpinner } from "@/components/LoadingSpinner"

function destinationAfterCallback(intent: OauthIntent | null) {
  const s = useAuthStore.getState()
  if (intent === "alumno") {
    return s.isDocente ? "/dashboard" : "/alumno"
  }
  const sol = s.docenteSolicitud
  if (sol?.estado === "pendiente") return "/docente/pendiente"
  if (sol?.estado === "rechazado") return "/docente/rechazado"
  if (s.isDocente) return "/dashboard"
  if (s.isAdmin) return "/admin/docentes"
  return "/alumno"
}

export function AuthCallback() {
  const navigate = useNavigate()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    void (async () => {
      if (!isSupabaseConfigured() || !supabase) {
        navigate("/login", { replace: true })
        return
      }

      const intent = peekOauthIntent()

      await exchangeOAuthCodeIfPresent()
      await useAuthStore.getState().checkSession()

      const { isAuthenticated, error } = useAuthStore.getState()
      if (!isAuthenticated) {
        const msg = error ?? "No se pudo completar el inicio de sesión."
        const base = intent === "alumno" ? "/alumno/login" : "/login"
        navigate(`${base}?error=${encodeURIComponent(msg)}`, { replace: true })
        return
      }

      navigate(destinationAfterCallback(intent), { replace: true })
    })()
  }, [navigate])

  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner size="lg" texto="Completando inicio de sesión..." />
    </div>
  )
}
