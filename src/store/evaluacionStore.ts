import { create } from "zustand";
import type { Evaluacion, ResultadoEvaluacion } from "@/types";

interface EvaluacionState {
  evaluaciones: Evaluacion[];
  resultados: ResultadoEvaluacion[];
  evaluacionActiva: Evaluacion | null;
  seleccionarEvaluacion: (id: string) => void;
  guardarEvaluacion: (evaluacion: Evaluacion) => void;
  registrarResultado: (resultado: ResultadoEvaluacion) => void;
}

const evaluacionesDemo: Evaluacion[] = [
  {
    id: "eva-1",
    titulo: "Funciones lineales y modelizacion",
    materia: "Matematica",
    cursoId: "curso-4b",
    tipo: "formal",
    estado: "activa",
    dificultad: "intermedio",
    duracionMinutos: 45,
    fecha: "2026-05-18",
    criterios: [
      {
        id: "cri-1",
        nombre: "Procedimiento",
        descripcion: "Aplica metodos adecuados y justifica cada paso.",
        puntajeMaximo: 4,
      },
      {
        id: "cri-2",
        nombre: "Interpretacion",
        descripcion: "Relaciona los resultados con el contexto del problema.",
        puntajeMaximo: 3,
      },
    ],
    preguntas: [
      {
        id: "pre-1",
        consigna: "Representa la funcion y = 2x + 3 e identifica pendiente y ordenada.",
        puntaje: 4,
      },
      {
        id: "pre-2",
        consigna: "Resuelve un problema contextual usando una funcion lineal.",
        puntaje: 6,
      },
    ],
  },
  {
    id: "eva-2",
    titulo: "Lectura critica de textos argumentativos",
    materia: "Lengua",
    cursoId: "curso-4b",
    tipo: "fast-track",
    estado: "borrador",
    dificultad: "basico",
    duracionMinutos: 15,
    fecha: "2026-05-22",
    criterios: [],
    preguntas: [
      {
        id: "pre-3",
        consigna: "Identifica tesis, argumentos y conectores principales.",
        puntaje: 10,
      },
    ],
  },
];

const resultadosDemo: ResultadoEvaluacion[] = [
  {
    id: "res-1",
    evaluacionId: "eva-1",
    alumnoId: "alu-1",
    puntaje: 82,
    puntajeMaximo: 100,
    porcentaje: 82,
    aprobado: true,
    devolucion: "Solida comprension de la pendiente y buena interpretacion grafica.",
    entregadoEn: "2026-05-18T14:20:00.000Z",
  },
];

export const useEvaluacionStore = create<EvaluacionState>((set, get) => ({
  evaluaciones: evaluacionesDemo,
  resultados: resultadosDemo,
  evaluacionActiva: evaluacionesDemo[0],
  seleccionarEvaluacion: (id) =>
    set({
      evaluacionActiva: get().evaluaciones.find((evaluacion) => evaluacion.id === id) ?? null,
    }),
  guardarEvaluacion: (evaluacion) =>
    set((state) => {
      const existe = state.evaluaciones.some((item) => item.id === evaluacion.id);

      return {
        evaluaciones: existe
          ? state.evaluaciones.map((item) => (item.id === evaluacion.id ? evaluacion : item))
          : [evaluacion, ...state.evaluaciones],
        evaluacionActiva: evaluacion,
      };
    }),
  registrarResultado: (resultado) =>
    set((state) => ({
      resultados: [resultado, ...state.resultados],
    })),
}));
