import { create } from "zustand"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

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
  isAuthenticated: boolean
  error: string | null

  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  checkSession: () => Promise<void>
  clearError: () => void
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

async function resolveRol(user: User): Promise<"docente" | "alumno"> {
  if (!isSupabaseConfigured() || !supabase) return "docente"

  const { data } = await supabase
    .from("docentes")
    .select("id")
    .eq("email", user.email ?? "")
    .maybeSingle()

  return data ? "docente" : "alumno"
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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isDocente: false,
  isAuthenticated: false,
  error: null,

  signInWithGoogle: async () => {
    if (!isSupabaseConfigured() || !supabase) {
      set({ loading: true, error: null })
      await new Promise((r) => setTimeout(r, 600))
      set({
        user: mockDocente,
        isDocente: true,
        isAuthenticated: true,
        loading: false,
      })
      return
    }

    set({ loading: true, error: null })
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    })

    if (error) {
      set({ error: error.message, loading: false })
    }
  },

  signOut: async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut()
    }
    set({
      user: null,
      isDocente: false,
      isAuthenticated: false,
      error: null,
      loading: false,
    })
  },

  checkSession: async () => {
    if (!isSupabaseConfigured() || !supabase) {
      set({ loading: false })
      return
    }

    set({ loading: true })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user) {
      const rol = await resolveRol(session.user)
      const mapped = mapSupabaseUser(session.user)
      mapped.rol = rol
      set({
        user: mapped,
        isDocente: rol === "docente",
        isAuthenticated: true,
        loading: false,
      })
    } else {
      set({
        user: null,
        isDocente: false,
        isAuthenticated: false,
        loading: false,
      })
    }
  },

  clearError: () => set({ error: null }),
}))

export { mockDocente, mockAlumno }
export type { AuthUser }
