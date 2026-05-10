import { create } from "zustand"
import type { Usuario, Rol } from "@/types"

interface AuthState {
  usuario: Usuario | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUsuario: (usuario: Usuario | null) => void
  clearError: () => void
}

const mockDocente: Usuario = {
  id: "doc-1",
  email: "docente@evaluar.edu.ar",
  nombre: "María",
  apellido: "González",
  rol: "docente" as Rol,
  avatar_url: undefined,
  created_at: new Date().toISOString(),
}

const mockAlumno: Usuario = {
  id: "alu-1",
  email: "alumno@evaluar.edu.ar",
  nombre: "Juan",
  apellido: "Pérez",
  rol: "alumno" as Rol,
  avatar_url: undefined,
  created_at: new Date().toISOString(),
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, _password: string) => {
    set({ isLoading: true, error: null })
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (email.includes("docente")) {
      set({ usuario: mockDocente, isAuthenticated: true, isLoading: false })
    } else if (email.includes("alumno")) {
      set({ usuario: mockAlumno, isAuthenticated: true, isLoading: false })
    } else {
      set({ error: "Credenciales inválidas", isLoading: false })
    }
  },

  logout: () => {
    set({ usuario: null, isAuthenticated: false, error: null })
  },

  setUsuario: (usuario) => {
    set({ usuario, isAuthenticated: !!usuario })
  },

  clearError: () => set({ error: null }),
}))
