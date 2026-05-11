import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface TimerBarProps {
  duracionMinutos: number
  onTimeUp?: () => void
  className?: string
  iniciar?: boolean
}

export function TimerBar({
  duracionMinutos,
  onTimeUp,
  className,
  iniciar = true,
}: TimerBarProps) {
  const totalSegundos = duracionMinutos * 60
  const [segundosRestantes, setSegundosRestantes] = useState(totalSegundos)

  useEffect(() => {
    if (!iniciar) return

    const interval = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeUp?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [iniciar, onTimeUp])

  const minutos = Math.floor(segundosRestantes / 60)
  const segundos = segundosRestantes % 60
  const porcentaje = (segundosRestantes / totalSegundos) * 100
  const esCritico = porcentaje < 15

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Clock
        className={cn("h-5 w-5", esCritico ? "text-destructive animate-pulse" : "text-primary")}
      />
      <div className="flex-1">
        <Progress
          value={porcentaje}
          className={cn("h-2.5", esCritico && "[&>div]:bg-destructive")}
        />
      </div>
      <span
        className={cn(
          "font-mono text-sm font-semibold tabular-nums min-w-[4.5rem] text-right",
          esCritico ? "text-destructive" : "text-foreground",
        )}
      >
        {String(minutos).padStart(2, "0")}:{String(segundos).padStart(2, "0")}
      </span>
    </div>
  )
}
