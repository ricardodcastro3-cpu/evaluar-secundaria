/**
 * Generador de PDF - Placeholder
 *
 * Se usará para exportar resultados de evaluaciones,
 * informes por alumno y reportes estadísticos.
 */

import type { ResultadoEvaluacion, Evaluacion, Alumno } from "@/types"

export function generarPDFResultado(
  _resultado: ResultadoEvaluacion,
  _evaluacion: Evaluacion,
  _alumno: Alumno,
): void {
  console.info("PDF de resultado: funcionalidad próximamente disponible")
}

export function generarPDFReporte(
  _evaluacion: Evaluacion,
  _resultados: ResultadoEvaluacion[],
): void {
  console.info("PDF de reporte: funcionalidad próximamente disponible")
}

export function generarPDFListaAlumnos(_alumnos: Alumno[]): void {
  console.info(
    "PDF de lista de alumnos: funcionalidad próximamente disponible",
  )
}
