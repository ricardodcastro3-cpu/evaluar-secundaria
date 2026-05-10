import { create } from "zustand";
import type { RolUsuario, Usuario } from "@/types";

interface AuthState {
  usuario: Usuario | null;
  tema: "light" | "dark";
  loginDemo: (rol: RolUsuario) => void;
  logout: () => void;
  toggleTema: () => void;
}

const docentesDemo: Record<RolUsuario, Usuario> = {
  docente: {
    id: "doc-1",
    nombre: "Marina Fernandez",
    email: "marina.fernandez@escuela.edu.ar",
    rol: "docente",
  },
  alumno: {
    id: "alu-1",
    nombre: "Mateo Garcia",
    email: "mateo.garcia@estudiante.edu.ar",
    rol: "alumno",
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  tema: "light",
  loginDemo: (rol) => set({ usuario: docentesDemo[rol] }),
  logout: () => set({ usuario: null }),
  toggleTema: () =>
    set((state) => ({
      tema: state.tema === "light" ? "dark" : "light",
    })),
}));
