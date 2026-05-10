import { create } from "zustand"
import type { Alumno, ResultadoEvaluacion } from "@/types"

interface AlumnoState {
  alumnos: Alumno[]
  alumnoActual: Alumno | null
  resultados: ResultadoEvaluacion[]
  isLoading: boolean
  error: string | null
  setAlumnos: (alumnos: Alumno[]) => void
  setAlumnoActual: (alumno: Alumno | null) => void
  agregarAlumno: (alumno: Alumno) => void
  agregarAlumnos: (alumnos: Alumno[]) => void
  eliminarAlumno: (id: string) => void
  setResultados: (resultados: ResultadoEvaluacion[]) => void
  clearError: () => void
}

const mockAlumnos: Alumno[] = [
  {
    id: "alu-1",
    nombre: "Juan",
    apellido: "Pérez",
    dni: "45123456",
    email: "juan.perez@alumno.edu.ar",
    curso: "3°",
    division: "A",
    nota_final: 8,
    created_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "alu-2",
    nombre: "María",
    apellido: "López",
    dni: "45234567",
    email: "maria.lopez@alumno.edu.ar",
    curso: "3°",
    division: "A",
    nota_final: 9,
    created_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "alu-3",
    nombre: "Carlos",
    apellido: "García",
    dni: "45345678",
    curso: "3°",
    division: "A",
    nota_final: 5,
    created_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "alu-4",
    nombre: "Lucía",
    apellido: "Martínez",
    dni: "45456789",
    email: "lucia.martinez@alumno.edu.ar",
    curso: "3°",
    division: "A",
    nota_final: 7,
    created_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "alu-5",
    nombre: "Tomás",
    apellido: "Rodríguez",
    dni: "45567890",
    curso: "3°",
    division: "A",
    nota_final: 4,
    created_at: "2026-03-01T10:00:00Z",
  },
]

export const useAlumnoStore = create<AlumnoState>((set) => ({
  alumnos: mockAlumnos,
  alumnoActual: null,
  resultados: [],
  isLoading: false,
  error: null,

  setAlumnos: (alumnos) => set({ alumnos }),
  setAlumnoActual: (alumno) => set({ alumnoActual: alumno }),

  agregarAlumno: (alumno) =>
    set((state) => ({ alumnos: [...state.alumnos, alumno] })),

  agregarAlumnos: (nuevos) =>
    set((state) => ({ alumnos: [...state.alumnos, ...nuevos] })),

  eliminarAlumno: (id) =>
    set((state) => ({
      alumnos: state.alumnos.filter((a) => a.id !== id),
    })),

  setResultados: (resultados) => set({ resultados }),
  clearError: () => set({ error: null }),
}))
