import { create } from "zustand"
import type {
  Evaluacion,
  ConfiguracionEvaluacion,
  EstadisticasEvaluacion,
} from "@/types"

interface EvaluacionState {
  evaluaciones: Evaluacion[]
  evaluacionActual: Evaluacion | null
  configuracion: ConfiguracionEvaluacion | null
  estadisticas: EstadisticasEvaluacion | null
  isLoading: boolean
  error: string | null
  setEvaluaciones: (evaluaciones: Evaluacion[]) => void
  setEvaluacionActual: (evaluacion: Evaluacion | null) => void
  setConfiguracion: (config: ConfiguracionEvaluacion | null) => void
  setEstadisticas: (stats: EstadisticasEvaluacion | null) => void
  agregarEvaluacion: (evaluacion: Evaluacion) => void
  actualizarEvaluacion: (id: string, data: Partial<Evaluacion>) => void
  eliminarEvaluacion: (id: string) => void
  clearError: () => void
}

const mockEvaluaciones: Evaluacion[] = [
  {
    id: "eval-1",
    titulo: "Parcial de Matemática - Funciones",
    descripcion:
      "Evaluación sobre funciones lineales y cuadráticas para 3er año",
    tipo: "formal",
    estado: "finalizada",
    materia: "Matemática",
    curso: "3°",
    division: "A",
    docente_id: "doc-1",
    fecha_inicio: "2026-04-15T08:00:00Z",
    fecha_fin: "2026-04-15T09:20:00Z",
    duracion_minutos: 80,
    preguntas: [],
    cantidad_preguntas: 10,
    puntaje_total: 100,
    nota_aprobacion: 60,
    created_at: "2026-04-10T10:00:00Z",
    updated_at: "2026-04-15T09:20:00Z",
  },
  {
    id: "eval-2",
    titulo: "FastTrack - Revolución de Mayo",
    descripcion: "Evaluación rápida sobre los hechos de Mayo de 1810",
    tipo: "fasttrack",
    estado: "en_curso",
    materia: "Historia",
    curso: "2°",
    division: "B",
    docente_id: "doc-1",
    duracion_minutos: 15,
    preguntas: [],
    cantidad_preguntas: 5,
    puntaje_total: 50,
    nota_aprobacion: 30,
    created_at: "2026-05-08T14:00:00Z",
    updated_at: "2026-05-08T14:00:00Z",
  },
  {
    id: "eval-3",
    titulo: "Parcial de Lengua - Análisis Sintáctico",
    descripcion: "Evaluación formal sobre oraciones compuestas",
    tipo: "formal",
    estado: "configurada",
    materia: "Lengua y Literatura",
    curso: "4°",
    division: "A",
    docente_id: "doc-1",
    fecha_inicio: "2026-05-20T10:00:00Z",
    duracion_minutos: 60,
    preguntas: [],
    cantidad_preguntas: 8,
    puntaje_total: 80,
    nota_aprobacion: 48,
    created_at: "2026-05-05T09:00:00Z",
    updated_at: "2026-05-05T09:00:00Z",
  },
  {
    id: "eval-4",
    titulo: "FastTrack - Tabla Periódica",
    descripcion: "Quiz rápido sobre elementos químicos",
    tipo: "fasttrack",
    estado: "borrador",
    materia: "Química",
    curso: "3°",
    division: "C",
    docente_id: "doc-1",
    duracion_minutos: 10,
    preguntas: [],
    cantidad_preguntas: 5,
    puntaje_total: 50,
    nota_aprobacion: 30,
    created_at: "2026-05-09T16:00:00Z",
    updated_at: "2026-05-09T16:00:00Z",
  },
]

export const useEvaluacionStore = create<EvaluacionState>((set) => ({
  evaluaciones: mockEvaluaciones,
  evaluacionActual: null,
  configuracion: null,
  estadisticas: null,
  isLoading: false,
  error: null,

  setEvaluaciones: (evaluaciones) => set({ evaluaciones }),
  setEvaluacionActual: (evaluacion) =>
    set({ evaluacionActual: evaluacion }),
  setConfiguracion: (config) => set({ configuracion: config }),
  setEstadisticas: (stats) => set({ estadisticas: stats }),

  agregarEvaluacion: (evaluacion) =>
    set((state) => ({
      evaluaciones: [evaluacion, ...state.evaluaciones],
    })),

  actualizarEvaluacion: (id, data) =>
    set((state) => ({
      evaluaciones: state.evaluaciones.map((e) =>
        e.id === id ? { ...e, ...data } : e,
      ),
    })),

  eliminarEvaluacion: (id) =>
    set((state) => ({
      evaluaciones: state.evaluaciones.filter((e) => e.id !== id),
    })),

  clearError: () => set({ error: null }),
}))
