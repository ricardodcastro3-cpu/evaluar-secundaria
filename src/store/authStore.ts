import { create } from "zustand"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { consumeOauthIntent, setOauthIntent } from "@/lib/oauthContext"
import type { User } from "@supabase/supabase-js"
import type { SolicitudDocente } from "@/types/docentes"

interface AuthUser {
  id: string
  email: string
  nombre: string
  apellido: string
  rol: "docente" | "alumno"
  avatar_url?: string
}

interface AuthState {
  user: AuthUser | null
  loading: boolean
  isDocente: boolean
  isAdmin: boolean
  isAuthenticated: boolean
  error: string | null
  docenteSolicitud: SolicitudDocente | null
  /** True solo la primera vez que se crea la fila de solicitud en esta sesión. */
  solicitudJustCreated: boolean

  signInWithGoogle: () => Promise<void>
  signInWithGoogleAsAlumno: () => Promise<void>
  signOut: () => Promise<void>
  checkSession: () => Promise<void>
  clearError: () => void
  refreshAccessState: () => Promise<void>
  clearSolicitudJustCreated: () => void
}

function mapSupabaseUser(user: User): AuthUser {
  const meta = user.user_metadata ?? {}
  const fullName: string = meta.full_name || meta.name || ""
  const parts = fullName.split(" ")
  const nombre = parts[0] || ""
  const apellido = parts.slice(1).join(" ") || ""

  return {
    id: user.id,
    email: user.email ?? "",
    nombre,
    apellido,
    rol: "docente",
    avatar_url: meta.avatar_url || meta.picture,
  }
}

function fullNameFromUser(user: User): string {
  const meta = user.user_metadata ?? {}
  return (
    (meta.full_name as string) ||
    (meta.name as string) ||
    [meta.given_name, meta.family_name].filter(Boolean).join(" ") ||
    "Docente"
  )
}

const mockDocente: AuthUser = {
  id: "doc-1",
  email: "docente@evaluar.edu.ar",
  nombre: "María",
  apellido: "González",
  rol: "docente",
  avatar_url: undefined,
}

const mockAlumno: AuthUser = {
  id: "alu-1",
  email: "alumno@evaluar.edu.ar",
  nombre: "Juan",
  apellido: "Pérez",
  rol: "alumno",
  avatar_url: undefined,
}

async function oauthGoogle(
  redirectPath: string,
  loadingSetter: (v: boolean) => void,
  errSetter: (e: string | null) => void,
) {
  if (!isSupabaseConfigured() || !supabase) return
  loadingSetter(true)
  errSetter(null)
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}${redirectPath}`,
    },
  })
  if (error) {
    errSetter(error.message)
    loadingSetter(false)
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  isDocente: false,
  isAdmin: false,
  isAuthenticated: false,
  error: null,
  docenteSolicitud: null,
  solicitudJustCreated: false,

  clearSolicitudJustCreated: () => set({ solicitudJustCreated: false }),

  signInWithGoogle: async () => {
    setOauthIntent("docente")
    if (!isSupabaseConfigured() || !supabase) {
      set({ loading: true, error: null })
      await new Promise((r) => setTimeout(r, 600))
      set({
        user: mockDocente,
        isDocente: true,
        isAdmin: true,
        isAuthenticated: true,
        docenteSolicitud: null,
        solicitudJustCreated: false,
        loading: false,
      })
      return
    }
    await oauthGoogle(
      "/login",
      (v) => set({ loading: v }),
      (e) => set({ error: e, loading: false }),
    )
  },

  signInWithGoogleAsAlumno: async () => {
    setOauthIntent("alumno")
    if (!isSupabaseConfigured() || !supabase) {
      set({ loading: true, error: null })
      await new Promise((r) => setTimeout(r, 600))
      set({
        user: mockAlumno,
        isDocente: false,
        isAdmin: false,
        isAuthenticated: true,
        docenteSolicitud: null,
        solicitudJustCreated: false,
        loading: false,
      })
      return
    }
    await oauthGoogle(
      "/alumno/login",
      (v) => set({ loading: v }),
      (e) => set({ error: e, loading: false }),
    )
  },

  signOut: async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut()
    }
    set({
      user: null,
      isDocente: false,
      isAdmin: false,
      isAuthenticated: false,
      error: null,
      docenteSolicitud: null,
      solicitudJustCreated: false,
      loading: false,
    })
  },

  clearError: () => set({ error: null }),

  refreshAccessState: async () => {
    await get().checkSession()
  },

  checkSession: async () => {
    if (!isSupabaseConfigured() || !supabase) {
      set({ loading: false })
      return
    }

    set({ loading: true, error: null })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      set({
        user: null,
        isDocente: false,
        isAdmin: false,
        isAuthenticated: false,
        docenteSolicitud: null,
        solicitudJustCreated: false,
        loading: false,
      })
      return
    }

    const intent = consumeOauthIntent()
    const mapped = mapSupabaseUser(session.user)
    const email = (session.user.email ?? "").toLowerCase().trim()

    const { data: isAdminRpc } = await supabase.rpc("is_admin")
    const isAdmin = Boolean(isAdminRpc)

    const { data: docenteRow } = await supabase
      .from("docentes")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    const isInDocentes = Boolean(docenteRow)

    if (intent === "alumno" || intent === null) {
      mapped.rol = isInDocentes ? "docente" : "alumno"
      let solicitud: SolicitudDocente | null = null
      if (!isInDocentes && intent === null) {
        const { data: sol } = await supabase
          .from("solicitudes_docentes")
          .select("*")
          .eq("email", email)
          .maybeSingle()
        solicitud = sol as SolicitudDocente | null
      }
      set({
        user: mapped,
        isDocente: isInDocentes,
        isAdmin,
        isAuthenticated: true,
        docenteSolicitud: solicitud,
        solicitudJustCreated: false,
        loading: false,
      })
      return
    }

    // Login explícito como docente (Google desde /login)
    if (isAdmin) {
      mapped.rol = "docente"
      set({
        user: mapped,
        isDocente: isInDocentes,
        isAdmin: true,
        isAuthenticated: true,
        docenteSolicitud: null,
        solicitudJustCreated: false,
        loading: false,
      })
      return
    }

    if (isInDocentes) {
      mapped.rol = "docente"
      set({
        user: mapped,
        isDocente: true,
        isAdmin,
        isAuthenticated: true,
        docenteSolicitud: null,
        solicitudJustCreated: false,
        loading: false,
      })
      return
    }

    const { data: existingSolRaw } = await supabase
      .from("solicitudes_docentes")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    let sol = existingSolRaw as SolicitudDocente | null

    if (!sol) {
      const { data: created, error: rpcErr } = await supabase.rpc(
        "create_docente_solicitud",
        { p_nombre: fullNameFromUser(session.user) },
      )
      if (rpcErr) {
        set({
          user: mapped,
          isDocente: false,
          isAdmin,
          isAuthenticated: true,
          docenteSolicitud: null,
          solicitudJustCreated: false,
          error: rpcErr.message,
          loading: false,
        })
        return
      }
      sol = created as unknown as SolicitudDocente
      set({
        user: mapped,
        isDocente: false,
        isAdmin,
        isAuthenticated: true,
        docenteSolicitud: sol,
        solicitudJustCreated: true,
        loading: false,
      })
      return
    } else if (sol.estado === "pendiente") {
      const { error: rpcErr } = await supabase.rpc("create_docente_solicitud", {
        p_nombre: fullNameFromUser(session.user),
      })
      if (rpcErr) {
        set({
          user: mapped,
          isDocente: false,
          isAdmin,
          isAuthenticated: true,
          docenteSolicitud: sol,
          solicitudJustCreated: false,
          error: rpcErr.message,
          loading: false,
        })
        return
      }
      const { data: refreshed } = await supabase
        .from("solicitudes_docentes")
        .select("*")
        .eq("email", email)
        .maybeSingle()
      sol = refreshed as SolicitudDocente | null
    }

    mapped.rol = "docente"
    set({
      user: mapped,
      isDocente: false,
      isAdmin,
      isAuthenticated: true,
      docenteSolicitud: sol,
      solicitudJustCreated: false,
      loading: false,
    })
  },
}))

export { mockDocente, mockAlumno }
export type { AuthUser }
