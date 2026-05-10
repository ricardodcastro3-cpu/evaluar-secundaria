export type Rol = "docente" | "alumno"

export type TipoEvaluacion = "fasttrack" | "formal"

export type EstadoEvaluacion =
  | "borrador"
  | "configurada"
  | "en_curso"
  | "finalizada"

export type NivelDificultad = "facil" | "medio" | "dificil"

export type TipoPregunta =
  | "multiple_choice"
  | "verdadero_falso"
  | "desarrollo"
  | "completar"

export interface Usuario {
  id: string
  email: string
  nombre: string
  apellido: string
  rol: Rol
  avatar_url?: string
  created_at: string
}

export interface Docente extends Usuario {
  rol: "docente"
  materias: string[]
  escuela: string
}

export interface Alumno {
  id: string
  nombre: string
  apellido: string
  dni: string
  email?: string
  curso: string
  division: string
  evaluacion_id?: string
  nota_final?: number
  created_at: string
}

export interface Materia {
  id: string
  nombre: string
  anio: number
}

export interface Pregunta {
  id: string
  texto: string
  tipo: TipoPregunta
  opciones?: OpcionPregunta[]
  respuesta_correcta?: string
  puntaje: number
  nivel: NivelDificultad
}

export interface OpcionPregunta {
  id: string
  texto: string
  es_correcta: boolean
}

export interface Evaluacion {
  id: string
  titulo: string
  descripcion?: string
  tipo: TipoEvaluacion
  estado: EstadoEvaluacion
  materia: string
  curso: string
  division: string
  docente_id: string
  fecha_inicio?: string
  fecha_fin?: string
  duracion_minutos?: number
  preguntas: Pregunta[]
  cantidad_preguntas: number
  puntaje_total: number
  nota_aprobacion: number
  created_at: string
  updated_at: string
}

export interface RespuestaAlumno {
  id: string
  alumno_id: string
  evaluacion_id: string
  pregunta_id: string
  respuesta: string
  es_correcta?: boolean
  puntaje_obtenido: number
  tiempo_respuesta_segundos: number
}

export interface ResultadoEvaluacion {
  id: string
  alumno_id: string
  evaluacion_id: string
  nota_final: number
  puntaje_obtenido: number
  puntaje_total: number
  porcentaje: number
  aprobado: boolean
  tiempo_total_segundos: number
  respuestas: RespuestaAlumno[]
  feedback_ia?: string
  created_at: string
}

export interface EstadisticasEvaluacion {
  evaluacion_id: string
  total_alumnos: number
  alumnos_aprobados: number
  alumnos_desaprobados: number
  promedio_general: number
  nota_maxima: number
  nota_minima: number
  porcentaje_aprobacion: number
}

export interface ConfiguracionEvaluacion {
  titulo: string
  descripcion: string
  materia: string
  curso: string
  division: string
  tipo: TipoEvaluacion
  duracion_minutos: number
  cantidad_preguntas: number
  nivel_dificultad: NivelDificultad
  nota_aprobacion: number
  temas: string[]
  mezclar_preguntas: boolean
  mezclar_opciones: boolean
  mostrar_resultado_inmediato: boolean
}
