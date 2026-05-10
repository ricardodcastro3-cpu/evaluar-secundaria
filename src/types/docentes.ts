export type SolicitudEstado = "pendiente" | "aprobado" | "rechazado"

export interface SolicitudDocente {
  id: string
  user_id: string | null
  email: string
  nombre: string
  estado: SolicitudEstado
  created_at: string
  updated_at: string
  reviewed_at: string | null
  reviewed_by_email: string | null
}

export interface DocenteRow {
  id: string
  user_id: string | null
  email: string
  nombre: string | null
  apellido: string | null
  created_at: string
}
