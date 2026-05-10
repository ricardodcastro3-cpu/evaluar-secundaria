import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

type AlertType = "info" | "success" | "warning" | "error"

interface AlertMessageProps {
  tipo: AlertType
  titulo?: string
  mensaje: string
  dismissible?: boolean
  className?: string
}

const alertConfig: Record<
  AlertType,
  { icon: typeof Info; bg: string; border: string; text: string }
> = {
  info: {
    icon: Info,
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-200",
  },
  success: {
    icon: CheckCircle2,
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-800 dark:text-emerald-200",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-800 dark:text-amber-200",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-800 dark:text-red-200",
  },
}

export function AlertMessage({
  tipo,
  titulo,
  mensaje,
  dismissible = false,
  className,
}: AlertMessageProps) {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  const config = alertConfig[tipo]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4",
        config.bg,
        config.border,
        className,
      )}
      role="alert"
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", config.text)} />
      <div className="flex-1">
        {titulo && (
          <p className={cn("font-semibold text-sm", config.text)}>{titulo}</p>
        )}
        <p className={cn("text-sm", config.text)}>{mensaje}</p>
      </div>
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className={cn("shrink-0 rounded-md p-1 hover:opacity-70", config.text)}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
