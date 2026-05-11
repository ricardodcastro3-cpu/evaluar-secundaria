import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Check,
  Loader2,
  Shield,
  UserMinus,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuthStore } from "@/store/authStore"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import type { DocenteRow, SolicitudDocente } from "@/types/docentes"

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("es-AR", {
      dateStyle: "medium",
      timeStyle: "short",
    })
  } catch {
    return iso
  }
}

export function AdminDocentes() {
  const navigate = useNavigate()
  const { user, isAdmin, isDocente, loading: authLoading, signOut } = useAuthStore()
  const [pending, setPending] = useState<SolicitudDocente[]>([])
  const [docentes, setDocentes] = useState<DocenteRow[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      return
    }
    setError(null)
    const [pRes, dRes] = await Promise.all([
      supabase
        .from("solicitudes_docentes")
        .select("*")
        .eq("estado", "pendiente")
        .order("created_at", { ascending: false }),
      supabase.from("docentes").select("*").order("created_at", { ascending: false }),
    ])
    if (pRes.error) setError(pRes.error.message)
    else if (dRes.error) setError(dRes.error.message)
    setPending((pRes.data as SolicitudDocente[]) ?? [])
    setDocentes((dRes.data as DocenteRow[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!authLoading && isAdmin) {
      void load()
    }
  }, [authLoading, isAdmin, load])

  const approve = async (id: string) => {
    if (!supabase) return
    setBusyId(id)
    setError(null)
    const { error: e } = await supabase.rpc("admin_approve_solicitud", {
      p_solicitud_id: id,
    })
    setBusyId(null)
    if (e) {
      setError(e.message)
      return
    }
    await load()
  }

  const reject = async (id: string) => {
    if (!supabase) return
    setBusyId(id)
    setError(null)
    const { error: e } = await supabase.rpc("admin_reject_solicitud", {
      p_solicitud_id: id,
    })
    setBusyId(null)
    if (e) {
      setError(e.message)
      return
    }
    await load()
  }

  const revoke = async (id: string) => {
    if (!supabase) return
    if (!confirm("¿Revocar acceso a este docente? Ya no podrá entrar al panel docente.")) return
    setBusyId(id)
    setError(null)
    const { error: e } = await supabase.rpc("admin_revoke_docente", {
      p_docente_id: id,
    })
    setBusyId(null)
    if (e) {
      setError(e.message)
      return
    }
    await load()
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background">
        <Loader2 className="h-10 w-10 animate-spin spinner-brand" />
      </div>
    )
  }

  if (!isSupabaseConfigured() || !supabase) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-background">
        <p className="text-muted-foreground text-center">
          Configurá Supabase para usar el panel de administración.
        </p>
        <Button variant="outline" onClick={() => navigate("/login")}>
          Volver
        </Button>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <p className="font-medium text-center">No tenés permisos de administrador.</p>
        <Button onClick={() => navigate("/dashboard")}>Ir al inicio</Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background">
        <Loader2 className="h-10 w-10 animate-spin spinner-brand" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <header className="app-gradient-header text-white shadow-lg">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-white/90 hover:bg-white/15 border-0 shadow-none hover:!translate-y-0"
            onClick={() => navigate(isDocente ? "/dashboard" : "/login")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Shield className="h-8 w-8 opacity-95" strokeWidth={2} />
          <div>
            <h1 className="font-heading text-lg font-bold">Gestión de Docentes</h1>
            <p className="text-xs text-white/80">Administrador: {user?.email}</p>
          </div>
          <div className="flex-1" />
          <Button
            variant="ghost"
            className="rounded-xl text-white/90 hover:bg-white/15 border-0 shadow-none hover:!translate-y-0"
            onClick={() => signOut().then(() => navigate("/login"))}
          >
            Salir
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Solicitudes pendientes</CardTitle>
            <CardDescription>
              Revisá y autorizá o rechazá el acceso de nuevos docentes. Las notificaciones por correo
              podés configurarlas con un Webhook de base de datos en Supabase (tabla{" "}
              <code className="text-xs">solicitudes_docentes</code>).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pending.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No hay solicitudes pendientes.
              </p>
            ) : (
              <ul className="space-y-3">
                {pending.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-[#E5E7EB] dark:border-border bg-white dark:bg-card p-4 shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {s.nombre}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">{s.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Solicitud: {fmtDate(s.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="secondary"
                        className="gap-1.5 rounded-xl !bg-emerald-600 !text-white hover:!bg-emerald-700 border-0 shadow-md hover:!translate-y-0"
                        disabled={busyId === s.id}
                        onClick={() => approve(s.id)}
                      >
                        {busyId === s.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        Autorizar
                      </Button>
                      <Button
                        variant="destructive"
                        className="gap-1.5 rounded-xl"
                        disabled={busyId === s.id}
                        onClick={() => reject(s.id)}
                      >
                        <X className="h-4 w-4" />
                        Rechazar
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Docentes autorizados</CardTitle>
            <CardDescription>
              Revocá el acceso si ya no debe usar el sistema. La fila en{" "}
              <code className="text-xs">docentes</code> se elimina.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {docentes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Todavía no hay docentes registrados.
              </p>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm table-zebra">
                  <thead>
                    <tr className="border-b border-border table-head-gradient">
                      <th className="text-left font-heading font-bold px-4 py-3">Nombre</th>
                      <th className="text-left font-heading font-bold px-4 py-3">Email</th>
                      <th className="text-left font-heading font-bold px-4 py-3">Alta</th>
                      <th className="text-right font-heading font-bold px-4 py-3 w-32">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docentes.map((d) => (
                      <tr key={d.id} className="border-b border-border/80">
                        <td className="px-4 py-3 font-medium">
                          {[d.nombre, d.apellido].filter(Boolean).join(" ") || "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{d.email}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {fmtDate(d.created_at)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                            disabled={busyId === d.id}
                            onClick={() => revoke(d.id)}
                          >
                            {busyId === d.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <UserMinus className="h-3.5 w-3.5" />
                            )}
                            Revocar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
