import type { AuthState } from "@/store/authStore"

/** Destino después de OAuth exitoso (callback). */
export function resolvePostOAuthPath(state: Pick<
  AuthState,
  | "lastOAuthEntry"
  | "isDocente"
  | "isAdmin"
  | "docenteSolicitud"
>): string {
  if (state.lastOAuthEntry === "alumno") {
    return state.isDocente ? "/dashboard" : "/alumno"
  }

  const sol = state.docenteSolicitud
  if (sol?.estado === "pendiente") return "/docente/pendiente"
  if (sol?.estado === "rechazado") return "/docente/rechazado"
  if (state.isDocente) return "/dashboard"
  if (state.isAdmin) return "/admin/docentes"
  return "/alumno"
}
