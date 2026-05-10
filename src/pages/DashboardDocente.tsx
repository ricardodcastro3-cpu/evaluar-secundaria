import { useNavigate } from "react-router-dom"
import {
  FileText,
  Users,
  Zap,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEvaluacionStore } from "@/store/evaluacionStore"
import { useAlumnoStore } from "@/store/alumnoStore"

const estadoBadge: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  borrador: { label: "Borrador", variant: "outline" },
  configurada: { label: "Configurada", variant: "secondary" },
  en_curso: { label: "En curso", variant: "default" },
  finalizada: { label: "Finalizada", variant: "secondary" },
}

export function DashboardDocente() {
  const navigate = useNavigate()
  const { evaluaciones } = useEvaluacionStore()
  const { alumnos } = useAlumnoStore()

  const enCurso = evaluaciones.filter((e) => e.estado === "en_curso").length
  const finalizadas = evaluaciones.filter(
    (e) => e.estado === "finalizada",
  ).length
  const promedio =
    alumnos.filter((a) => a.nota_final != null).length > 0
      ? (
          alumnos.reduce((acc, a) => acc + (a.nota_final ?? 0), 0) /
          alumnos.filter((a) => a.nota_final != null).length
        ).toFixed(1)
      : "—"

  const stats = [
    {
      label: "Evaluaciones",
      value: evaluaciones.length,
      icon: FileText,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "En curso",
      value: enCurso,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      label: "Alumnos",
      value: alumnos.length,
      icon: Users,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      label: "Promedio",
      value: promedio,
      icon: TrendingUp,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-100 dark:bg-violet-900/30",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Resumen de tus evaluaciones y alumnos
          </p>
        </div>
        <Button onClick={() => navigate("/docente/configurar")} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Evaluación
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-xl p-3 ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Evaluaciones Recientes</CardTitle>
              <CardDescription>Últimas evaluaciones creadas</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {evaluaciones.map((evaluacion) => {
                const badge = estadoBadge[evaluacion.estado]
                return (
                  <div
                    key={evaluacion.id}
                    className="flex items-center gap-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() =>
                      navigate(`/docente/resultado/${evaluacion.id}`)
                    }
                  >
                    <div
                      className={`rounded-lg p-2 ${evaluacion.tipo === "fasttrack" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-primary/10"}`}
                    >
                      {evaluacion.tipo === "fasttrack" ? (
                        <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      ) : (
                        <BookOpen className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {evaluacion.titulo}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {evaluacion.materia} · {evaluacion.curso}{" "}
                        {evaluacion.division}
                      </p>
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Accesos directos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={() => navigate("/docente/configurar")}
            >
              <div className="rounded-md bg-primary/10 p-1.5">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              Crear Evaluación Formal
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={() => navigate("/docente/configurar")}
            >
              <div className="rounded-md bg-amber-100 dark:bg-amber-900/30 p-1.5">
                <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              Crear FastTrack
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={() => navigate("/docente/alumnos")}
            >
              <div className="rounded-md bg-emerald-100 dark:bg-emerald-900/30 p-1.5">
                <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              Gestionar Alumnos
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rendimiento por Evaluación</CardTitle>
          <CardDescription>Resultados de las últimas evaluaciones finalizadas</CardDescription>
        </CardHeader>
        <CardContent>
          {finalizadas === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No hay evaluaciones finalizadas aún
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {evaluaciones
                .filter((e) => e.estado === "finalizada")
                .map((e) => (
                  <div key={e.id} className="flex items-center gap-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{e.titulo}</p>
                      <p className="text-xs text-muted-foreground">
                        {e.cantidad_preguntas} preguntas · Aprobación:{" "}
                        {e.nota_aprobacion}%
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {e.curso} {e.division}
                    </Badge>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
