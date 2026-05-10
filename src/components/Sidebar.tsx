import {
  BarChart3,
  ClipboardCheck,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const docenteLinks = [
  { to: "/dashboard", label: "Mis Evaluaciones", icon: ClipboardCheck },
  { to: "/nueva-evaluacion", label: "Nueva Evaluacion", icon: Sparkles },
  { to: "/subir-alumnos", label: "Alumnos conectados", icon: Users },
  { to: "/resultado", label: "Reportes", icon: BarChart3 },
];

const alumnoLinks = [
  { to: "/alumno", label: "Mi panel", icon: GraduationCap },
  { to: "/evaluacion-formal", label: "Evaluacion", icon: Sparkles },
  { to: "/resultado", label: "Resultado", icon: BarChart3 },
];

interface SidebarProps {
  variant?: "docente" | "alumno";
}

export function Sidebar({ variant = "docente" }: SidebarProps) {
  const links = variant === "docente" ? docenteLinks : alumnoLinks;

  return (
    <aside className="hidden w-72 shrink-0 border-r bg-card/80 px-4 py-6 shadow-sm backdrop-blur lg:block">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-indigo-500/25">
          EA
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">EvalAr</p>
          <p className="text-sm text-muted-foreground">Secundaria</p>
        </div>
      </div>

      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
