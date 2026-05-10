export type RolUsuario = "docente" | "alumno";

export type TipoEvaluacion = "fast-track" | "formal";

export type EstadoEvaluacion = "borrador" | "activa" | "finalizada";

export type NivelDificultad = "basico" | "intermedio" | "avanzado";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
}

export interface Curso {
  id: string;
  nombre: string;
  division: string;
  turno: "manana" | "tarde" | "noche";
  cicloLectivo: number;
}

export interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  email?: string;
  cursoId: string;
  progreso: number;
  promedio: number;
}

export interface CriterioEvaluacion {
  id: string;
  nombre: string;
  descripcion: string;
  puntajeMaximo: number;
}

export interface Pregunta {
  id: string;
  consigna: string;
  opciones?: string[];
  respuestaCorrecta?: string;
  puntaje: number;
}

export interface Evaluacion {
  id: string;
  titulo: string;
  materia: string;
  cursoId: string;
  tipo: TipoEvaluacion;
  estado: EstadoEvaluacion;
  dificultad: NivelDificultad;
  duracionMinutos: number;
  fecha: string;
  criterios: CriterioEvaluacion[];
  preguntas: Pregunta[];
}

export interface ResultadoEvaluacion {
  id: string;
  evaluacionId: string;
  alumnoId: string;
  puntaje: number;
  puntajeMaximo: number;
  porcentaje: number;
  aprobado: boolean;
  devolucion: string;
  entregadoEn: string;
}

export interface EstadisticaDocente {
  etiqueta: string;
  valor: string;
  detalle: string;
  tendencia: "positiva" | "neutral" | "negativa";
}

export interface MensajeAlerta {
  tipo: "info" | "success" | "warning" | "error";
  titulo: string;
  descripcion?: string;
}
