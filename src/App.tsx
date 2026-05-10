import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Layout } from "@/components/Layout"
import { Login } from "@/pages/Login"
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
  const { isAuthenticated, isDocente, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" texto="Verificando sesión..." />
      </div>
    )
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isDocente) return <Navigate to="/alumno" replace />

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
  const { checkSession } = useAuthStore()

  useEffect(() => {
    checkSession()
  }, [checkSession])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <AuthRoute>
            <Layout />
          </AuthRoute>
        }
      >
        {/* Rutas Docente */}
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

        {/* Rutas Alumno (requieren sesión, cualquier rol) */}
        <Route path="/alumno" element={<DashboardAlumno />} />
        <Route path="/alumno/fasttrack" element={<FastTrack />} />
        <Route path="/alumno/evaluacion" element={<EvaluacionFormal />} />
        <Route path="/alumno/resultado/:id" element={<Resultado />} />
      </Route>

      {/* Rutas públicas del flujo alumno por token */}
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
