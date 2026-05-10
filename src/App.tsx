import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { BienvenidaAlumno } from "@/pages/BienvenidaAlumno";
import { ConfigurarEvaluacion } from "@/pages/ConfigurarEvaluacion";
import { DashboardAlumno } from "@/pages/DashboardAlumno";
import { DashboardDocente } from "@/pages/DashboardDocente";
import { EvaluacionFormal } from "@/pages/EvaluacionFormal";
import { FastTrack } from "@/pages/FastTrack";
import { Login } from "@/pages/Login";
import { Resultado } from "@/pages/Resultado";
import { SubirAlumnos } from "@/pages/SubirAlumnos";
import { useAuthStore } from "@/store/authStore";

function AppLayout() {
  const usuario = useAuthStore((state) => state.usuario);

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar variant={usuario.rol} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const tema = useAuthStore((state) => state.tema);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", tema === "dark");
  }, [tema]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/eval/:token" element={<BienvenidaAlumno />} />
      <Route path="/eval" element={<Navigate to="/eval/demo-4b-matematica" replace />} />
      <Route path="/fast-track/:token" element={<FastTrack />} />
      <Route path="/evaluacion/:token" element={<EvaluacionFormal />} />
      <Route path="/resultado/:token" element={<Resultado />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardDocente />} />
        <Route path="/nueva-evaluacion" element={<ConfigurarEvaluacion />} />
        <Route path="/docente" element={<Navigate to="/dashboard" replace />} />
        <Route path="/configurar-evaluacion" element={<Navigate to="/nueva-evaluacion" replace />} />
        <Route path="/subir-alumnos" element={<SubirAlumnos />} />
        <Route path="/alumno" element={<DashboardAlumno />} />
        <Route path="/fast-track" element={<FastTrack />} />
        <Route path="/evaluacion-formal" element={<Navigate to="/evaluacion/demo-4b-matematica" replace />} />
        <Route path="/resultado" element={<Resultado />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
