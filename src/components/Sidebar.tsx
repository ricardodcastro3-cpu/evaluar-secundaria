import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  FileText,
  Users,
  Zap,
  ClipboardCheck,
  BarChart3,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const docenteLinks = [
  {
    to: "/dashboard",
    label: "Mis Evaluaciones",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/nueva-evaluacion",
    label: "Nueva Evaluación",
    icon: FileText,
  },
  { to: "/docente/alumnos", label: "Alumnos", icon: Users },
  { to: "/docente/reportes", label: "Reportes", icon: BarChart3 },
]

const alumnoLinks = [
  {
    to: "/alumno",
    label: "Mis Evaluaciones",
    icon: LayoutDashboard,
    end: true,
  },
  { to: "/alumno/fasttrack", label: "FastTrack", icon: Zap },
  {
    to: "/alumno/evaluacion",
    label: "Evaluación Formal",
    icon: ClipboardCheck,
  },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const { usuario } = useAuthStore()
  const links = usuario?.rol === "docente" ? docenteLinks : alumnoLinks

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-r bg-card transition-transform duration-200 md:sticky md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 md:hidden">
            <span className="font-semibold">Menú</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )
                }
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t p-4">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground">
                {usuario?.rol === "docente" ? "Panel Docente" : "Panel Alumno"}
              </p>
              <p className="text-sm font-semibold mt-0.5">
                {usuario?.nombre} {usuario?.apellido}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
