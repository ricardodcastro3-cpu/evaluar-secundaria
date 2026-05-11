import { supabase, isSupabaseConfigured } from "@/lib/supabase"

/** Lee `code` OAuth en query o en hash. */
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

type ExchangeResult = { ok: boolean; errorMessage: string | null }

/** Una sola promesa si main.tsx y otro caller disparan a la vez (poco habitual). */
let exchangeInFlight: Promise<ExchangeResult> | null = null

/**
 * Intercambia `code` PKCE por sesión. Ejecutar **antes** de React para evitar carreras
 * con getSession / rutas protegidas.
 */
export async function exchangeOAuthCodeFromUrl(): Promise<ExchangeResult> {
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

  if (exchangeInFlight) return exchangeInFlight

  exchangeInFlight = (async (): Promise<ExchangeResult> => {
    const client = supabase
    try {
      const { data, error } = await client.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("[auth] exchangeCodeForSession:", error.message)
        stripOAuthParamsFromUrl()
        return { ok: false, errorMessage: error.message }
      }

      if (!data.session) {
        stripOAuthParamsFromUrl()
        return {
          ok: false,
          errorMessage: "No se obtuvo sesión tras el intercambio PKCE.",
        }
      }

      // Refuerzo persistencia (algunos entornos no devuelven sesión estable en el primer getSession).
      const { error: setErr } = await client.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      })
      if (setErr) {
        console.error("[auth] setSession tras PKCE:", setErr.message)
        stripOAuthParamsFromUrl()
        return { ok: false, errorMessage: setErr.message }
      }

      stripOAuthParamsFromUrl()
      return { ok: true, errorMessage: null }
    } finally {
      exchangeInFlight = null
    }
  })()

  return exchangeInFlight
}
