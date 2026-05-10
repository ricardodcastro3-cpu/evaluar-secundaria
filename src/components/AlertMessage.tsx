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
    bg: "bg-violet-50 dark:bg-violet-950/35",
    border: "border-violet-200 dark:border-violet-500/30",
    text: "text-violet-900 dark:text-violet-100",
  },
  success: {
    icon: CheckCircle2,
    bg: "bg-emerald-50 dark:bg-emerald-950/35",
    border: "border-emerald-200 dark:border-emerald-500/25",
    text: "text-emerald-900 dark:text-emerald-100",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50 dark:bg-amber-950/35",
    border: "border-amber-200 dark:border-amber-500/25",
    text: "text-amber-950 dark:text-amber-100",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-50 dark:bg-red-950/35",
    border: "border-red-200 dark:border-red-500/25",
    text: "text-red-900 dark:text-red-100",
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
        "flex items-start gap-3 rounded-xl border p-4 shadow-sm",
        config.bg,
        config.border,
        className,
      )}
      role="alert"
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", config.text)} strokeWidth={2.25} />
      <div className="flex-1">
        {titulo && (
          <p className={cn("font-heading font-bold text-sm", config.text)}>{titulo}</p>
        )}
        <p className={cn("text-sm", config.text)}>{mensaje}</p>
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={() => setVisible(false)}
          className={cn("shrink-0 rounded-lg p-1 hover:opacity-70", config.text)}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
