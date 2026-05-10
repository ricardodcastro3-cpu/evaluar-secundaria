import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Layout } from "@/components/Layout"
import { Login } from "@/pages/Login"
import { AuthCallback } from "@/pages/AuthCallback"
import { AlumnoLogin } from "@/pages/AlumnoLogin"
import { PendingDocente } from "@/pages/PendingDocente"
import { RejectedDocente } from "@/pages/RejectedDocente"
import { AdminDocentes } from "@/pages/AdminDocentes"
import { DashboardDocente } from "@/pages/DashboardDocente"
import { ConfigurarEvaluacion } from "@/pages/ConfigurarEvaluacion"
import { DashboardAlumno } from "@/pages/DashboardAlumno"
import { FastTrack } from "@/pages/FastTrack"
import { EvaluacionFormal } from "@/pages/EvaluacionFormal"
import { Resultado } from "@/pages/Resultado"
import { BienvenidaAlumno } from "@/pages/BienvenidaAlumno"
import { FastTrackAlumno } from "@/pages/FastTrackAlumno"
import { EvaluacionFormalAlumno } from "@/pages/EvaluacionFormalAlumno"
import { ResultadoAlumno } from "@/pages/ResultadoAlumno"
import { useAuthStore } from "@/store/authStore"
import { LoadingSpinner } from "@/components/LoadingSpinner"

function DocenteRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isDocente, isAdmin, loading, docenteSolicitud } = useAuthStore()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" texto="Verificando sesión..." />
      </div>
    )
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isDocente && !isAdmin) {
    if (docenteSolicitud?.estado === "pendiente") {
      return <Navigate to="/docente/pendiente" replace />
    }
    if (docenteSolicitud?.estado === "rechazado") {
      return <Navigate to="/docente/rechazado" replace />
    }
    return <Navigate to="/alumno" replace />
  }

  return <>{children}</>
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" texto="Verificando sesión..." />
      </div>
    )
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/alumno/login" element={<AlumnoLogin />} />
      <Route path="/docente/pendiente" element={<PendingDocente />} />
      <Route path="/docente/rechazado" element={<RejectedDocente />} />
      <Route path="/admin/docentes" element={<AdminDocentes />} />

      <Route
        element={
          <AuthRoute>
            <Layout />
          </AuthRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <DocenteRoute>
              <DashboardDocente />
            </DocenteRoute>
          }
        />
        <Route
          path="/nueva-evaluacion"
          element={
            <DocenteRoute>
              <ConfigurarEvaluacion />
            </DocenteRoute>
          }
        />
        <Route
          path="/docente/resultado/:id"
          element={
            <DocenteRoute>
              <Resultado />
            </DocenteRoute>
          }
        />

        <Route path="/alumno" element={<DashboardAlumno />} />
        <Route path="/alumno/fasttrack" element={<FastTrack />} />
        <Route path="/alumno/evaluacion" element={<EvaluacionFormal />} />
        <Route path="/alumno/resultado/:id" element={<Resultado />} />
      </Route>

      <Route path="/eval/:token" element={<BienvenidaAlumno />} />
      <Route path="/fast-track/:token" element={<FastTrackAlumno />} />
      <Route path="/evaluacion/:token" element={<EvaluacionFormalAlumno />} />
      <Route path="/resultado/:token" element={<ResultadoAlumno />} />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/docente" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <AppRoutes />
      </TooltipProvider>
    </BrowserRouter>
  )
}
