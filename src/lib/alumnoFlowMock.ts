export type TipoPreguntaAlumno = "multiple" | "desarrollo";

export interface PreguntaAlumnoMock {
  id: string;
  tipo: TipoPreguntaAlumno;
  enunciado: string;
  opciones?: string[];
  respuestaDada: string;
  puntajeObtenido: number;
  puntajeMaximo: number;
  justificacion: string;
}

export const evaluacionAlumnoMock = {
  token: "demo-4b-matematica",
  alumno: "Mateo Garcia",
  materia: "Matematica",
  docente: "Marina Fernandez",
  fecha: "18/05/2026",
  duracion: 45,
  puntaje: 85,
  puntajeMaximo: 100,
  preguntas: [
    {
      id: "p1",
      tipo: "multiple",
      enunciado: "Cual es la pendiente de la funcion y = 2x + 3?",
      opciones: ["3", "2", "-2", "No tiene pendiente"],
      respuestaDada: "2",
      puntajeObtenido: 10,
      puntajeMaximo: 10,
      justificacion: "Identificaste correctamente el coeficiente que acompana a x.",
    },
    {
      id: "p2",
      tipo: "multiple",
      enunciado: "Que representa la ordenada al origen en una funcion lineal?",
      opciones: [
        "El valor donde la recta corta el eje y",
        "La inclinacion de la recta",
        "El punto maximo de la funcion",
        "La cantidad de soluciones",
      ],
      respuestaDada: "El valor donde la recta corta el eje y",
      puntajeObtenido: 10,
      puntajeMaximo: 10,
      justificacion: "La respuesta reconoce el significado grafico de la ordenada.",
    },
    {
      id: "p3",
      tipo: "desarrollo",
      enunciado:
        "Explica como usarias una funcion lineal para representar el costo de un viaje en taxi.",
      respuestaDada:
        "Usaria una parte fija para la bajada de bandera y una parte variable que aumenta por cada kilometro recorrido.",
      puntajeObtenido: 18,
      puntajeMaximo: 20,
      justificacion:
        "La explicacion diferencia correctamente costo fijo y costo variable. Faltaria escribir una formula completa.",
    },
    {
      id: "p4",
      tipo: "multiple",
      enunciado: "Si una recta tiene pendiente negativa, que ocurre cuando x aumenta?",
      opciones: [
        "La funcion crece",
        "La funcion decrece",
        "La funcion queda constante",
        "No se puede graficar",
      ],
      respuestaDada: "La funcion decrece",
      puntajeObtenido: 10,
      puntajeMaximo: 10,
      justificacion: "Relacionaste pendiente negativa con comportamiento decreciente.",
    },
    {
      id: "p5",
      tipo: "desarrollo",
      enunciado: "Resuelve e interpreta: una entrada cuesta $1500 y cada consumicion $700.",
      respuestaDada:
        "La funcion seria y = 1500 + 700x. Si compro 3 consumiciones, pago 3600 pesos.",
      puntajeObtenido: 17,
      puntajeMaximo: 20,
      justificacion:
        "El modelo es correcto. Se descuenta un punto menor por no indicar claramente que x es la cantidad de consumiciones.",
    },
  ] satisfies PreguntaAlumnoMock[],
};

export const tokenDemo = evaluacionAlumnoMock.token;
