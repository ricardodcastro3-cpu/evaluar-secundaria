import { useEffect, type ReactNode } from "react";
import { Navigate, Outlet, Route, Routes, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Sidebar } from "@/components/Sidebar";
import { tokenDemo } from "@/lib/alumnoFlowMock";
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
  const { user, loading, isDocente } = useAuthStore();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <LoadingSpinner label="Verificando sesion..." />
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isDocente) {
    return <Navigate to={`/eval/${tokenDemo}`} replace />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar variant="docente" />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function TokenProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useParams();
  const { user, loading, isDocente } = useAuthStore();
  const hasValidToken = token === tokenDemo;
  const canAccessAsAlumno = Boolean(user && !isDocente);

  if (loading && !hasValidToken) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <LoadingSpinner label="Validando acceso..." />
      </main>
    );
  }

  if (!hasValidToken && !canAccessAsAlumno) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const { tema, checkSession } = useAuthStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", tema === "dark");
  }, [tema]);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/eval/:token"
        element={
          <TokenProtectedRoute>
            <BienvenidaAlumno />
          </TokenProtectedRoute>
        }
      />
      <Route path="/eval" element={<Navigate to="/eval/demo-4b-matematica" replace />} />
      <Route
        path="/fast-track/:token"
        element={
          <TokenProtectedRoute>
            <FastTrack />
          </TokenProtectedRoute>
        }
      />
      <Route
        path="/evaluacion/:token"
        element={
          <TokenProtectedRoute>
            <EvaluacionFormal />
          </TokenProtectedRoute>
        }
      />
      <Route
        path="/resultado/:token"
        element={
          <TokenProtectedRoute>
            <Resultado />
          </TokenProtectedRoute>
        }
      />
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
