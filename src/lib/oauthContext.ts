const INTENT_KEY = "evaluar:oauth_intent"

export type OauthIntent = "docente" | "alumno"

/** Llamar antes de iniciar OAuth (mismo origen conserva sessionStorage tras redirect). */
export function setOauthIntent(intent: OauthIntent) {
  sessionStorage.setItem(INTENT_KEY, intent)
}

/** Lectura sin borrar (p. ej. antes de `checkSession` en `/auth/callback`). */
export function peekOauthIntent(): OauthIntent | null {
  const v = sessionStorage.getItem(INTENT_KEY)
  if (v === "docente" || v === "alumno") return v
  return null
}

/**
 * Lee y borra la intención. Si no hay valor (refresh de sesión), devuelve null.
 */
export function consumeOauthIntent(): OauthIntent | null {
  const v = sessionStorage.getItem(INTENT_KEY)
  sessionStorage.removeItem(INTENT_KEY)
  if (v === "docente" || v === "alumno") return v
  return null
}
