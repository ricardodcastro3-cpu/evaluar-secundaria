import type { Evaluacion } from "@/types";

export const geminiConfig = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY ?? "",
};

export async function generarDevolucionMock(evaluacion: Evaluacion, porcentaje: number) {
  await new Promise((resolve) => window.setTimeout(resolve, 250));

  if (porcentaje >= 80) {
    return `Muy buen desempeno en ${evaluacion.materia}. Se recomienda profundizar con consignas de transferencia.`;
  }

  if (porcentaje >= 60) {
    return `Buen avance general en ${evaluacion.materia}. Conviene reforzar conceptos clave antes de la proxima instancia.`;
  }

  return `Se detectan contenidos para revisar en ${evaluacion.materia}. Sugerimos una actividad guiada de recuperacion.`;
}
