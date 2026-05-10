import type { ReporteCursoAlumno } from "@/lib/alumnoFlowMock";

interface ReporteFinalCursoParams {
  escuela: string;
  tituloEvaluacion: string;
  materia: string;
  curso: string;
  division: string;
  fecha: string;
  alumnos: ReporteCursoAlumno[];
}

function escapeHtml(value: string | number) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function descargarReporteFinalCurso({
  escuela,
  tituloEvaluacion,
  materia,
  curso,
  division,
  fecha,
  alumnos,
}: ReporteFinalCursoParams) {
  const alumnosOrdenados = [...alumnos].sort((a, b) =>
    `${a.apellido} ${a.nombre}`.localeCompare(`${b.apellido} ${b.nombre}`),
  );

  const filas = alumnosOrdenados
    .map(
      (alumno, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(`${alumno.apellido}, ${alumno.nombre}`)}</td>
          <td>${alumno.puntajeObtenido}</td>
          <td>${alumno.aprobado ? "APROBADO" : "REPROBADO"}</td>
        </tr>
      `,
    )
    .join("");

  const contenido = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          table { border-collapse: collapse; font-family: Arial, sans-serif; }
          td, th { border: 1px solid #999; padding: 8px; }
          th { background: #4F46E5; color: #fff; font-weight: bold; }
          .label { font-weight: bold; background: #eef2ff; }
          .title { font-size: 18px; font-weight: bold; }
        </style>
      </head>
      <body>
        <table>
          <tr><td class="label">ESCUELA</td><td colspan="3">${escapeHtml(escuela)}</td></tr>
          <tr><td class="label">TITULO</td><td colspan="3" class="title">Evaluación de: ${escapeHtml(tituloEvaluacion)}</td></tr>
          <tr><td class="label">MATERIA</td><td colspan="3">${escapeHtml(materia)}</td></tr>
          <tr><td class="label">CURSO</td><td>${escapeHtml(curso)}</td><td class="label">DIVISION</td><td>${escapeHtml(division)}</td></tr>
          <tr><td class="label">FECHA</td><td colspan="3">${escapeHtml(fecha)}</td></tr>
          <tr></tr>
          <tr>
            <th>NUMERO DE ORDEN</th>
            <th>APELLIDO Y NOMBRE</th>
            <th>PUNTAJE OBTENIDO</th>
            <th>APROBADO / REPROBADO</th>
          </tr>
          ${filas}
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([contenido], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `reporte-final-${materia}-${curso}-${division}.xls`.toLowerCase();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
