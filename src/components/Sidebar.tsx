import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  FileText,
  Zap,
  ClipboardCheck,
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
    end: true as const,
    iconClass: "bg-amber-400/35 text-amber-50 ring-1 ring-amber-300/30",
  },
  {
    to: "/nueva-evaluacion",
    label: "Nueva Evaluación",
    icon: FileText,
    iconClass: "bg-sky-400/35 text-sky-50 ring-1 ring-sky-300/30",
  },
]

const alumnoLinks = [
  {
    to: "/alumno",
    label: "Mis Evaluaciones",
    icon: LayoutDashboard,
    end: true as const,
    iconClass: "bg-fuchsia-400/35 text-fuchsia-50 ring-1 ring-fuchsia-300/25",
  },
  {
    to: "/alumno/fasttrack",
    label: "FastTrack",
    icon: Zap,
    iconClass: "bg-amber-400/40 text-amber-50 ring-1 ring-amber-200/35",
  },
  {
    to: "/alumno/evaluacion",
    label: "Evaluación Formal",
    icon: ClipboardCheck,
    iconClass: "bg-emerald-400/35 text-emerald-50 ring-1 ring-emerald-300/25",
  },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, isDocente, isAdmin } = useAuthStore()
  const docenteView = isDocente || isAdmin
  const links = docenteView ? docenteLinks : alumnoLinks

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "app-gradient-sidebar fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-r border-white/15 text-white shadow-[4px_0_36px_-8px_rgba(124,58,237,0.45)] transition-transform duration-300 ease-out md:sticky md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 md:hidden border-b border-white/10">
            <span className="font-heading font-bold text-sm tracking-wide">
              Menú
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-xl text-white/90 hover:bg-white/15 border-0 shadow-none hover:!translate-y-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1.5 px-3 py-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-white/25 text-white shadow-lg shadow-black/20 ring-1 ring-white/30 backdrop-blur-sm"
                      : "text-white/85 hover:bg-white/14 hover:text-white",
                  )
                }
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl shrink-0",
                    link.iconClass,
                  )}
                >
                  <link.icon className="h-5 w-5" strokeWidth={2.25} />
                </span>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-white/12 p-4">
            <div className="rounded-xl bg-white/14 backdrop-blur-md p-3 ring-1 ring-white/20">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-100/90">
                {docenteView ? "Panel Docente" : "Panel Alumno"}
              </p>
              <p className="text-sm font-bold mt-1 text-white">
                {user?.nombre} {user?.apellido}
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 px-4 py-3 bg-black/10">
            <p className="text-[10px] leading-relaxed text-white/55 text-center italic tracking-wide">
              Sistema de Evaluación diseñado por el Profesor Ricardo Damián CASTRO
              <span className="block mt-0.5 not-italic font-medium text-white/70">
                Docente — San Juan, República Argentina
              </span>
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
