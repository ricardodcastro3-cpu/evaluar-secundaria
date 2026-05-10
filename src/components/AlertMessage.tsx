import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MensajeAlerta } from "@/types";

const iconos = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: AlertCircle,
};

const estilos = {
  info: "border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-100",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-100",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-100",
  error:
    "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100",
};

interface AlertMessageProps extends MensajeAlerta {
  className?: string;
}

export function AlertMessage({ tipo, titulo, descripcion, className }: AlertMessageProps) {
  const Icon = iconos[tipo];

  return (
    <div className={cn("flex gap-3 rounded-xl border p-4", estilos[tipo], className)}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-semibold">{titulo}</p>
        {descripcion ? <p className="mt-1 text-sm opacity-80">{descripcion}</p> : null}
      </div>
    </div>
  );
}
