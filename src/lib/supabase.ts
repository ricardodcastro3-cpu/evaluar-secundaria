import { createClient, SupabaseClient } from "@supabase/supabase-js"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ""
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ""

export function isSupabaseConfigured(): boolean {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY)
}

// Only create client if Supabase is configured
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    })
  : null

/**
 * Tras OAuth, Supabase redirige con ?code=… (PKCE). Si getSession() corre antes de que
 * el cliente intercambie el código, la sesión queda vacía y la app vuelve al login en bucle.
 * Intercambiamos explícitamente y limpiamos la URL antes del primer render.
 */
export async function exchangeOAuthCodeIfPresent(): Promise<void> {
  if (typeof window === "undefined") return
  if (!isSupabaseConfigured() || !supabase) return

  const params = new URLSearchParams(window.location.search)
  const code = params.get("code")
  if (!code) return

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    console.error("[auth] PKCE exchange failed:", error.message)
    return
  }

  const url = new URL(window.location.href)
  url.searchParams.delete("code")
  url.searchParams.delete("state")
  const q = url.searchParams.toString()
  const next = `${url.pathname}${q ? `?${q}` : ""}${url.hash}`
  window.history.replaceState({}, document.title, next)
}

export default supabase
