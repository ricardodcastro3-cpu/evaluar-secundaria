import { Link, useNavigate } from "react-router-dom"
import { Moon, Sun, LogOut, Menu, GraduationCap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useTheme } from "@/hooks/useTheme"
import { useAuthStore } from "@/store/authStore"

interface HeaderProps {
  onToggleSidebar?: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { user, signOut, isAdmin } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate("/login")
  }

  const initials = user
    ? `${user.nombre[0] || ""}${user.apellido[0] || ""}`.toUpperCase() || "?"
    : "?"

  return (
    <header className="sticky top-0 z-40 shadow-[0_4px_28px_-4px_rgba(124,58,237,0.38)]">
      <div className="app-gradient-header text-white">
        <div className="flex h-16 items-center gap-4 px-4 md:px-6">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl text-white/90 hover:text-white hover:bg-white/15 border-0 shadow-none hover:!translate-y-0"
              onClick={onToggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-300/45 bg-white/18 backdrop-blur-md ring-1 ring-white/30 shadow-inner">
              <GraduationCap className="h-6 w-6 text-white" strokeWidth={2.25} />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-heading text-[0.95rem] font-bold tracking-tight text-white uppercase leading-tight">
                EVALUACIONES SAN JUAN
              </h1>
            </div>
          </div>

          <div className="flex-1" />

          {isAdmin && (
            <Link
              to="/admin/docentes"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white/95 hover:bg-white/15 transition-colors"
            >
              <Shield className="h-4 w-4" />
              Gestión docentes
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl text-white/85 hover:text-white hover:bg-white/15 border-0 shadow-none hover:!translate-y-0"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="relative flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-white/30 hover:ring-white/50 transition-all"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-to-br from-amber-300 to-violet-600 text-white text-sm font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-[0_8px_32px_-8px_rgba(124,58,237,0.22)]">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-amber-300 to-violet-600 text-white text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">
                      {user.nombre} {user.apellido}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-white/50 via-white/90 to-white/50 opacity-90" />
    </header>
  )
}
