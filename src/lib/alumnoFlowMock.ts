export type TipoPreguntaAlumno = "multiple" | "desarrollo";

export interface RubricaItem {
  criterio: string;
  puntaje: number;
  descripcion: string;
}

export interface PreguntaAlumnoMock {
  id: string;
  tipo: TipoPreguntaAlumno;
  enunciado: string;
  opciones?: string[];
  respuestaCorrecta: string;
  respuestaDada: string;
  puntajeObtenido: number;
  puntajeMaximo: number;
  justificacion: string;
  rubrica: RubricaItem[];
}

export interface FastTrackItemMock {
  id: string;
  tipo: TipoPreguntaAlumno;
  enunciado: string;
  opciones?: string[];
  respuestaCorrecta: string;
  puntajeMaximo: number;
  profundidad: "alta" | "muy alta";
  explicacion: string;
}

export interface ReporteCursoAlumno {
  apellido: string;
  nombre: string;
  puntajeObtenido: number;
  aprobado: boolean;
}

export const evaluacionAlumnoMock = {
  token: "demo-4b-matematica",
  escuela: "E.E.S. Nro. 14 Mariano Moreno",
  alumno: "Mateo Garcia",
  titulo: "Funciones lineales y modelizacion",
  materia: "Matematica",
  curso: "4to",
  division: "B",
  docente: "Marina Fernandez",
  fecha: "18/05/2026",
  duracion: 45,
  puntaje: 85,
  puntajeMaximo: 100,
  versionAsignada: "Version IA 4B-MAT-017",
  origenContenido: "Programa-matematica-4b.pdf",
  preguntas: [
    {
      id: "eval-p1",
      tipo: "multiple",
      enunciado: "Cual es la pendiente de la funcion y = 2x + 3?",
      opciones: ["3", "2", "-2", "No tiene pendiente"],
      respuestaCorrecta: "2",
      respuestaDada: "2",
      puntajeObtenido: 10,
      puntajeMaximo: 10,
      justificacion: "Identificaste correctamente el coeficiente que acompana a x.",
      rubrica: [
        { criterio: "Identificacion de pendiente", puntaje: 10, descripcion: "Reconoce m en y = mx + b." },
      ],
    },
    {
      id: "eval-p2",
      tipo: "multiple",
      enunciado: "Que representa la ordenada al origen en una funcion lineal?",
      opciones: [
        "El valor donde la recta corta el eje y",
        "La inclinacion de la recta",
        "El punto maximo de la funcion",
        "La cantidad de soluciones",
      ],
      respuestaCorrecta: "El valor donde la recta corta el eje y",
      respuestaDada: "El valor donde la recta corta el eje y",
      puntajeObtenido: 10,
      puntajeMaximo: 10,
      justificacion: "La respuesta reconoce el significado grafico de la ordenada.",
      rubrica: [
        { criterio: "Interpretacion grafica", puntaje: 10, descripcion: "Relaciona b con el corte en y." },
      ],
    },
    {
      id: "eval-p3",
      tipo: "desarrollo",
      enunciado:
        "Explica como usarias una funcion lineal para representar el costo de un viaje en taxi.",
      respuestaCorrecta:
        "Debe plantear una tarifa fija mas un costo variable por kilometro, por ejemplo C(x)=b+mx.",
      respuestaDada:
        "Usaria una parte fija para la bajada de bandera y una parte variable que aumenta por cada kilometro recorrido.",
      puntajeObtenido: 18,
      puntajeMaximo: 20,
      justificacion:
        "Diferencia correctamente costo fijo y costo variable. Faltaria escribir una formula completa.",
      rubrica: [
        { criterio: "Modelo lineal", puntaje: 8, descripcion: "Reconoce componente fijo y variable." },
        { criterio: "Contextualizacion", puntaje: 6, descripcion: "Explica que representa cada termino." },
        { criterio: "Expresion algebraica", puntaje: 4, descripcion: "Sugiere una formula adecuada." },
      ],
    },
    {
      id: "eval-p4",
      tipo: "multiple",
      enunciado: "Si una recta tiene pendiente negativa, que ocurre cuando x aumenta?",
      opciones: [
        "La funcion crece",
        "La funcion decrece",
        "La funcion queda constante",
        "No se puede graficar",
      ],
      respuestaCorrecta: "La funcion decrece",
      respuestaDada: "La funcion decrece",
      puntajeObtenido: 10,
      puntajeMaximo: 10,
      justificacion: "Relacionaste pendiente negativa con comportamiento decreciente.",
      rubrica: [
        { criterio: "Comportamiento funcional", puntaje: 10, descripcion: "Vincula signo de pendiente con variacion." },
      ],
    },
    {
      id: "eval-p5",
      tipo: "desarrollo",
      enunciado: "Resuelve e interpreta: una entrada cuesta $1500 y cada consumicion $700.",
      respuestaCorrecta:
        "La funcion es C(x)=1500+700x. Para 3 consumiciones, C(3)=3600. x representa consumiciones.",
      respuestaDada:
        "La funcion seria y = 1500 + 700x. Si compro 3 consumiciones, pago 3600 pesos.",
      puntajeObtenido: 17,
      puntajeMaximo: 20,
      justificacion:
        "El modelo y el calculo son correctos. Se descuenta por no explicitar que x representa consumiciones.",
      rubrica: [
        { criterio: "Planteo", puntaje: 7, descripcion: "Construye la expresion lineal correcta." },
        { criterio: "Calculo", puntaje: 7, descripcion: "Evalua correctamente la funcion." },
        { criterio: "Interpretacion", puntaje: 3, descripcion: "Aclara variables y unidades." },
      ],
    },
  ] satisfies PreguntaAlumnoMock[],
};

export const fastTrackItemsMock: FastTrackItemMock[] = [
  {
    id: "ft-1",
    tipo: "multiple",
    enunciado: "Una funcion lineal pasa por (2, 7) y (5, 16). Cual es su pendiente?",
    opciones: ["2", "3", "4", "9"],
    respuestaCorrecta: "3",
    puntajeMaximo: 10,
    profundidad: "alta",
    explicacion: "La pendiente se calcula como (16-7)/(5-2)=9/3=3.",
  },
  {
    id: "ft-2",
    tipo: "desarrollo",
    enunciado:
      "Plantea una funcion lineal para una cuota fija de $2500 y $850 por clase adicional. Interpreta sus parametros.",
    respuestaCorrecta:
      "C(x)=2500+850x, donde 2500 es costo fijo y 850 el costo por cada clase adicional.",
    puntajeMaximo: 12,
    profundidad: "muy alta",
    explicacion: "Se espera formula, identificacion de variable e interpretacion contextual.",
  },
  {
    id: "ft-3",
    tipo: "multiple",
    enunciado: "Si f(x)= -4x + 12, que representa el 12?",
    opciones: ["Pendiente", "Raiz", "Ordenada al origen", "Dominio"],
    respuestaCorrecta: "Ordenada al origen",
    puntajeMaximo: 8,
    profundidad: "alta",
    explicacion: "En y=mx+b, b es la ordenada al origen.",
  },
  {
    id: "ft-4",
    tipo: "desarrollo",
    enunciado:
      "Compara dos planes: A(x)=1200+300x y B(x)=600+450x. Explica para que cantidad de usos conviene cada uno.",
    respuestaCorrecta:
      "Igualando: 1200+300x=600+450x, x=4. Para menos de 4 usos conviene B; para mas de 4, A.",
    puntajeMaximo: 14,
    profundidad: "muy alta",
    explicacion: "Implica ecuacion, comparacion e interpretacion de intervalos.",
  },
  {
    id: "ft-5",
    tipo: "multiple",
    enunciado: "Una recta decreciente y con corte positivo en y podria ser:",
    opciones: ["y=5x+2", "y=-3x+4", "y=2x-1", "y=-x-6"],
    respuestaCorrecta: "y=-3x+4",
    puntajeMaximo: 10,
    profundidad: "alta",
    explicacion: "Pendiente negativa y ordenada al origen positiva.",
  },
  {
    id: "ft-6",
    tipo: "desarrollo",
    enunciado:
      "Describe una situacion real que se modele con pendiente negativa y explica por que no seria proporcionalidad directa.",
    respuestaCorrecta:
      "Ejemplo: saldo restante de una tarjeta que baja por cada viaje. No es proporcionalidad directa si tiene saldo inicial distinto de cero.",
    puntajeMaximo: 12,
    profundidad: "muy alta",
    explicacion: "Evalua transferencia, pendiente negativa y diferencia con proporcionalidad directa.",
  },
  {
    id: "ft-7",
    tipo: "multiple",
    enunciado: "Cual de estas funciones tiene raiz x=3?",
    opciones: ["y=x+3", "y=2x-6", "y=3x+2", "y=-2x-3"],
    respuestaCorrecta: "y=2x-6",
    puntajeMaximo: 8,
    profundidad: "alta",
    explicacion: "La raiz se obtiene cuando y=0: 2x-6=0, x=3.",
  },
  {
    id: "ft-8",
    tipo: "desarrollo",
    enunciado:
      "A partir de una tabla con valores que aumentan de 5 en 5 por cada unidad de x, explica como hallarias la formula.",
    respuestaCorrecta:
      "La pendiente es 5. Luego se usa un par ordenado de la tabla para hallar b en y=5x+b.",
    puntajeMaximo: 12,
    profundidad: "alta",
    explicacion: "Requiere generalizar desde tabla a formula.",
  },
  {
    id: "ft-9",
    tipo: "multiple",
    enunciado: "Si dos rectas tienen la misma pendiente y distinta ordenada al origen, entonces:",
    opciones: ["Se cortan en el origen", "Son paralelas", "Son perpendiculares", "Son la misma recta"],
    respuestaCorrecta: "Son paralelas",
    puntajeMaximo: 8,
    profundidad: "alta",
    explicacion: "Igual pendiente y distinto b implica rectas paralelas.",
  },
  {
    id: "ft-10",
    tipo: "desarrollo",
    enunciado:
      "Explica que decisiones tomarias para verificar si la respuesta de un problema lineal es razonable en contexto.",
    respuestaCorrecta:
      "Revisaria unidades, signo de la pendiente, valores extremos, interpretacion de variables y coherencia con el enunciado.",
    puntajeMaximo: 16,
    profundidad: "muy alta",
    explicacion: "Integra validacion matematica y lectura contextual.",
  },
];

export const alumnosConectadosMock = [
  { apellido: "Alvarez", nombre: "Julia", email: "julia.alvarez@estudiante.edu.ar", estado: "Fast Track", version: "IA-004" },
  { apellido: "Garcia", nombre: "Mateo", email: "mateo.garcia@estudiante.edu.ar", estado: "Evaluacion formal", version: "IA-017" },
  { apellido: "Molina", nombre: "Sofia", email: "sofia.molina@estudiante.edu.ar", estado: "Resultado disponible", version: "IA-011" },
  { apellido: "Pereyra", nombre: "Tomas", email: "tomas.pereyra@estudiante.edu.ar", estado: "Link recibido", version: "Pendiente" },
].sort((a, b) => `${a.apellido} ${a.nombre}`.localeCompare(`${b.apellido} ${b.nombre}`));

export const reporteFinalCursoMock: ReporteCursoAlumno[] = [
  { apellido: "Alvarez", nombre: "Julia", puntajeObtenido: 78, aprobado: true },
  { apellido: "Garcia", nombre: "Mateo", puntajeObtenido: 85, aprobado: true },
  { apellido: "Molina", nombre: "Sofia", puntajeObtenido: 92, aprobado: true },
  { apellido: "Pereyra", nombre: "Tomas", puntajeObtenido: 58, aprobado: false },
  { apellido: "Rodriguez", nombre: "Lucia", puntajeObtenido: 88, aprobado: true },
].sort((a, b) => `${a.apellido} ${a.nombre}`.localeCompare(`${b.apellido} ${b.nombre}`));

export const tokenDemo = evaluacionAlumnoMock.token;

export function getFormalStartedKey(token: string) {
  return `evalar-formal-started-${token}`;
}

export function getFastTrackResultsKey(token: string) {
  return `evalar-fast-track-results-${token}`;
}
