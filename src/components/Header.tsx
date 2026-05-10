import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const mobileLinks = [
  { to: "/dashboard", label: "Evaluaciones" },
  { to: "/nueva-evaluacion", label: "Nueva" },
  { to: "/subir-alumnos", label: "Alumnos" },
  { to: "/resultado", label: "Reportes" },
];

export function Header() {
  const navigate = useNavigate();
  const { user, isDocente, tema, toggleTema, signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const nombreUsuario =
    user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? "Usuario";

  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-xl">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link to={isDocente ? "/dashboard" : "/eval/demo-4b-matematica"} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground lg:hidden">
            EA
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">EvalAr Secundaria</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Evaluaciones claras para aulas argentinas
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex lg:hidden">
          {mobileLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu">
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTema}
            aria-label="Cambiar tema claro oscuro"
          >
            {tema === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{nombreUsuario}</p>
                <p className="text-xs capitalize text-muted-foreground">
                  {isDocente ? "docente" : "alumno"}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Cerrar sesion">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
