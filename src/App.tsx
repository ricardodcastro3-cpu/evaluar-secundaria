import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Layout } from "@/components/Layout"
import { Login } from "@/pages/Login"
import { DashboardDocente } from "@/pages/DashboardDocente"
import { ConfigurarEvaluacion } from "@/pages/ConfigurarEvaluacion"
import { SubirAlumnos } from "@/pages/SubirAlumnos"
import { DashboardAlumno } from "@/pages/DashboardAlumno"
import { FastTrack } from "@/pages/FastTrack"
import { EvaluacionFormal } from "@/pages/EvaluacionFormal"
import { Resultado } from "@/pages/Resultado"
import { useAuthStore } from "@/store/authStore"

function ProtectedRoute({
  children,
  rol,
}: {
  children: React.ReactNode
  rol?: "docente" | "alumno"
}) {
  const { isAuthenticated, usuario } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (rol && usuario?.rol !== rol) {
    return <Navigate to={usuario?.rol === "docente" ? "/docente" : "/alumno"} replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Rutas Docente */}
            <Route
              path="/docente"
              element={
                <ProtectedRoute rol="docente">
                  <DashboardDocente />
                </ProtectedRoute>
              }
            />
            <Route
              path="/docente/configurar"
              element={
                <ProtectedRoute rol="docente">
                  <ConfigurarEvaluacion />
                </ProtectedRoute>
              }
            />
            <Route
              path="/docente/alumnos"
              element={
                <ProtectedRoute rol="docente">
                  <SubirAlumnos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/docente/resultado/:id"
              element={
                <ProtectedRoute rol="docente">
                  <Resultado />
                </ProtectedRoute>
              }
            />

            {/* Rutas Alumno */}
            <Route
              path="/alumno"
              element={
                <ProtectedRoute rol="alumno">
                  <DashboardAlumno />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumno/fasttrack"
              element={
                <ProtectedRoute rol="alumno">
                  <FastTrack />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumno/evaluacion"
              element={
                <ProtectedRoute rol="alumno">
                  <EvaluacionFormal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumno/resultado/:id"
              element={
                <ProtectedRoute rol="alumno">
                  <Resultado />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  )
}
