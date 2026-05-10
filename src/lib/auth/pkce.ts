import { supabase, isSupabaseConfigured } from "@/lib/supabase"

/** Lee `code` OAuth en query o en hash (#access_token legacy no aplica a PKCE). */
export function readOAuthCodeFromUrl(): string | null {
  if (typeof window === "undefined") return null
  const search = new URLSearchParams(window.location.search).get("code")
  if (search) return search
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash
  return new URLSearchParams(hash).get("code")
}

export function readOAuthErrorFromUrl(): string | null {
  if (typeof window === "undefined") return null
  const q = new URLSearchParams(window.location.search)
  const err = q.get("error_description") || q.get("error")
  if (err) return err
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash
  const hq = new URLSearchParams(hash)
  return hq.get("error_description") || hq.get("error")
}

export function stripOAuthParamsFromUrl(): void {
  if (typeof window === "undefined") return
  const url = new URL(window.location.href)
  url.searchParams.delete("code")
  url.searchParams.delete("state")
  url.searchParams.delete("error")
  url.searchParams.delete("error_description")
  if (url.hash && url.hash.includes("=")) {
    const h = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash
    const p = new URLSearchParams(h)
    p.delete("code")
    p.delete("state")
    p.delete("error")
    p.delete("error_description")
    const rest = p.toString()
    url.hash = rest ? `#${rest}` : ""
  }
  const q = url.searchParams.toString()
  const next = `${url.pathname}${q ? `?${q}` : ""}${url.hash}`
  window.history.replaceState({}, document.title, next)
}

/**
 * Intercambia el `code` PKCE por sesión. Debe ejecutarse antes de cualquier
 * `getSession()` en la vuelta de OAuth.
 */
export async function exchangeOAuthCodeFromUrl(): Promise<{
  ok: boolean
  errorMessage: string | null
}> {
  if (!isSupabaseConfigured() || !supabase) {
    return { ok: false, errorMessage: "Supabase no está configurado." }
  }

  const errParam = readOAuthErrorFromUrl()
  if (errParam) {
    stripOAuthParamsFromUrl()
    return { ok: false, errorMessage: errParam }
  }

  const code = readOAuthCodeFromUrl()
  if (!code) {
    return { ok: true, errorMessage: null }
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  stripOAuthParamsFromUrl()

  if (error) {
    console.error("[auth] exchangeCodeForSession:", error.message)
    return { ok: false, errorMessage: error.message }
  }

  if (!data.session) {
    return {
      ok: false,
      errorMessage: "No se obtuvo sesión tras el intercambio PKCE.",
    }
  }

  return { ok: true, errorMessage: null }
}
