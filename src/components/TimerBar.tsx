import { Clock3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TimerBarProps {
  minutosTotales: number;
  minutosRestantes: number;
}

export function TimerBar({ minutosTotales, minutosRestantes }: TimerBarProps) {
  const porcentaje = (minutosRestantes / minutosTotales) * 100;

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 font-semibold">
          <Clock3 className="h-4 w-4 text-primary" />
          Tiempo restante
        </span>
        <span className="text-muted-foreground">{minutosRestantes} min</span>
      </div>
      <Progress value={porcentaje} />
    </div>
  );
}
