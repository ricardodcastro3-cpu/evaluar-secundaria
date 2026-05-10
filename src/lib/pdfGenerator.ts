import type { Alumno, Evaluacion, ResultadoEvaluacion } from "@/types";

export function generarNombreBoletin(alumno: Alumno, evaluacion: Evaluacion) {
  const apellido = alumno.apellido.toLowerCase().replace(/\s+/g, "-");
  const titulo = evaluacion.titulo.toLowerCase().replace(/\s+/g, "-");
  return `evalar-${apellido}-${titulo}.pdf`;
}

export function prepararResumenPDF(
  alumno: Alumno,
  evaluacion: Evaluacion,
  resultado: ResultadoEvaluacion,
) {
  return {
    archivo: generarNombreBoletin(alumno, evaluacion),
    titulo: evaluacion.titulo,
    alumno: `${alumno.apellido}, ${alumno.nombre}`,
    puntaje: `${resultado.puntaje}/${resultado.puntajeMaximo}`,
    devolucion: resultado.devolucion,
  };
}
