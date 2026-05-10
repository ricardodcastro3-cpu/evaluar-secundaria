import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { resolvePostOAuthPath } from "@/lib/auth/postLoginNavigation"
import { useAuthStore } from "@/store/authStore"
import { LoadingSpinner } from "@/components/LoadingSpinner"

/** Solo navega: PKCE + sesión ya resueltos en AuthProvider antes de montar esta ruta. */
export function AuthCallback() {
  const navigate = useNavigate()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const { isAuthenticated, error } = useAuthStore.getState()

    if (!isAuthenticated) {
      const msg =
        error ?? "No se pudo completar el inicio de sesión."
      navigate(`/login?error=${encodeURIComponent(msg)}`, { replace: true })
      return
    }

    const dest = resolvePostOAuthPath(useAuthStore.getState())
    navigate(dest, { replace: true })
  }, [navigate])

  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner size="lg" texto="Completando inicio de sesión..." />
    </div>
  )
}
