import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { isSupabaseConfigured, supabase } from "@/lib/supabase"
import { useAuthStore } from "@/store/authStore"
import { LoadingSpinner } from "@/components/LoadingSpinner"

/**
 * El intercambio PKCE ocurre en main.tsx. Aquí solo hidratamos el store y
 * escuchamos cambios de sesión (sin INITIAL_SESSION para no duplicar trabajo).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authReady, setAuthReady] = useState(false)
  const authSubRef = useRef<{ unsubscribe: () => void } | null>(null)

  const runBootstrap = useCallback(async () => {
    await useAuthStore.getState().checkSession()
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
