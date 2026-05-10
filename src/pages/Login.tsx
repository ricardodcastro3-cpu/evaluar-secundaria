import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GraduationCap, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useAuthStore } from "@/store/authStore"
import { useTheme } from "@/hooks/useTheme"
import { Moon, Sun } from "lucide-react"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error, clearError } = useAuthStore()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    await login(email, password)

    const state = useAuthStore.getState()
    if (state.isAuthenticated && state.usuario) {
      navigate(
        state.usuario.rol === "docente" ? "/docente" : "/alumno",
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="fixed top-4 right-4 rounded-full"
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
            <GraduationCap className="h-9 w-9 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Eval<span className="text-primary">Ar</span> Secundaria
          </h1>
          <p className="text-muted-foreground">
            Sistema de evaluaciones para docentes argentinos
          </p>
        </div>

        <Card className="shadow-xl border-0 shadow-black/5">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@escuela.edu.ar"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-3">
              <Button
                type="submit"
                className="w-full h-11 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                ¿No tenés cuenta?{" "}
                <button type="button" className="text-primary font-medium hover:underline">
                  Contactá a tu administrador
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>

        <div className="rounded-lg border bg-card p-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground text-center">
            Cuentas de prueba
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setEmail("docente@evaluar.edu.ar")
                setPassword("123456")
              }}
              className="rounded-md border bg-background p-2 text-left hover:bg-accent transition-colors"
            >
              <p className="text-xs font-medium">Docente</p>
              <p className="text-[10px] text-muted-foreground truncate">
                docente@evaluar.edu.ar
              </p>
            </button>
            <button
              onClick={() => {
                setEmail("alumno@evaluar.edu.ar")
                setPassword("123456")
              }}
              className="rounded-md border bg-background p-2 text-left hover:bg-accent transition-colors"
            >
              <p className="text-xs font-medium">Alumno</p>
              <p className="text-[10px] text-muted-foreground truncate">
                alumno@evaluar.edu.ar
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
