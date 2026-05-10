import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
  texto?: string
}

const sizes = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
}

export function LoadingSpinner({
  className,
  size = "md",
  texto,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <Loader2
        className={cn("animate-spin spinner-brand text-[#7C3AED]", sizes[size])}
      />
      {texto && (
        <p className="text-sm text-muted-foreground animate-pulse">{texto}</p>
      )}
    </div>
  )
}
