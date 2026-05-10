import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { exchangeOAuthCodeFromUrl } from "@/lib/auth/pkce"
import { isSupabaseConfigured, supabase } from "@/lib/supabase"
import { useAuthStore } from "@/store/authStore"
import { LoadingSpinner } from "@/components/LoadingSpinner"

/**
 * Orden garantizado:
 * 1) exchangeCodeForSession si hay `code` en la URL (antes de montar rutas hijas).
 * 2) checkSession una vez con sesión ya persistida.
 * 3) Suscripción onAuthStateChange (sin INITIAL_SESSION para evitar carreras con el paso 2).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authReady, setAuthReady] = useState(false)
  const authSubRef = useRef<{ unsubscribe: () => void } | null>(null)

  const runBootstrap = useCallback(async () => {
    const checkSession = useAuthStore.getState().checkSession

    if (!isSupabaseConfigured() || !supabase) {
      await checkSession()
      return
    }

    const exchangeResult = await exchangeOAuthCodeFromUrl()
    if (!exchangeResult.ok) {
      useAuthStore.setState({
        error:
          exchangeResult.errorMessage ?? "Error en el intercambio de sesión OAuth.",
        loading: false,
        isAuthenticated: false,
      })
      return
    }

    await checkSession()
  }, [])

  useEffect(() => {
    void (async () => {
      try {
        await runBootstrap()
      } catch (e) {
        console.error("[auth] AuthProvider init failed:", e)
        useAuthStore.setState({
          loading: false,
          error: e instanceof Error ? e.message : "Error al iniciar sesión.",
          isAuthenticated: false,
        })
      } finally {
        setAuthReady(true)
      }

      if (!isSupabaseConfigured() || !supabase) return

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event) => {
        if (event === "INITIAL_SESSION") return
        void useAuthStore.getState().checkSession()
      })
      authSubRef.current = subscription
    })()

    return () => {
      authSubRef.current?.unsubscribe()
      authSubRef.current = null
    }
  }, [runBootstrap])

  if (!authReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" texto="Iniciando aplicación..." />
      </div>
    )
  }

  return <>{children}</>
}
