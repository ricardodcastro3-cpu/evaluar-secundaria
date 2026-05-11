/**
 * Cliente de Google Gemini AI - Placeholder
 *
 * Se usará para generar preguntas automáticamente
 * y proveer feedback personalizado a los alumnos.
 *
 * Configurar: VITE_GEMINI_API_KEY
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ""

export function isGeminiConfigured(): boolean {
  return !!GEMINI_API_KEY
}

export async function generarPreguntas(
  _materia: string,
  _tema: string,
  _cantidad: number,
  _dificultad: string,
): Promise<string> {
  if (!isGeminiConfigured()) {
    return "Gemini API no está configurada. Agregá VITE_GEMINI_API_KEY en .env"
  }
  return "Funcionalidad próximamente disponible"
}

export async function generarFeedback(
  _respuestas: unknown,
): Promise<string> {
  if (!isGeminiConfigured()) {
    return "Gemini API no está configurada"
  }
  return "Feedback próximamente disponible"
}
