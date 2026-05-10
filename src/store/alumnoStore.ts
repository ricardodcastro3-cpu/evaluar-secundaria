import { create } from "zustand";
import type { Alumno, Curso } from "@/types";

interface AlumnoState {
  cursos: Curso[];
  alumnos: Alumno[];
  agregarAlumnos: (alumnos: Alumno[]) => void;
  actualizarProgreso: (alumnoId: string, progreso: number) => void;
}

const cursoDemo: Curso = {
  id: "curso-4b",
  nombre: "4to",
  division: "B",
  turno: "manana",
  cicloLectivo: 2026,
};

const alumnosDemo: Alumno[] = [
  {
    id: "alu-1",
    nombre: "Mateo",
    apellido: "Garcia",
    dni: "45123456",
    email: "mateo.garcia@estudiante.edu.ar",
    cursoId: cursoDemo.id,
    progreso: 72,
    promedio: 8.1,
  },
  {
    id: "alu-2",
    nombre: "Sofia",
    apellido: "Molina",
    dni: "45234567",
    email: "sofia.molina@estudiante.edu.ar",
    cursoId: cursoDemo.id,
    progreso: 88,
    promedio: 9.0,
  },
  {
    id: "alu-3",
    nombre: "Tomas",
    apellido: "Pereyra",
    dni: "45345678",
    email: "tomas.pereyra@estudiante.edu.ar",
    cursoId: cursoDemo.id,
    progreso: 54,
    promedio: 6.7,
  },
];

export const useAlumnoStore = create<AlumnoState>((set) => ({
  cursos: [cursoDemo],
  alumnos: alumnosDemo,
  agregarAlumnos: (alumnos) =>
    set((state) => ({
      alumnos: [...state.alumnos, ...alumnos],
    })),
  actualizarProgreso: (alumnoId, progreso) =>
    set((state) => ({
      alumnos: state.alumnos.map((alumno) =>
        alumno.id === alumnoId ? { ...alumno, progreso } : alumno,
      ),
    })),
}));
