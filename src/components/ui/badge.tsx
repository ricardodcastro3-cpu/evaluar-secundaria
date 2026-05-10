import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white shadow-sm [a]:hover:opacity-90",
        secondary:
          "border-slate-200 bg-violet-50 text-violet-950 dark:border-border dark:bg-secondary dark:text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "border border-red-200 bg-red-50 text-red-700 focus-visible:ring-destructive/20 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-300 [a]:hover:bg-red-100 dark:[a]:hover:bg-red-950/60",
        outline:
          "border-slate-200 bg-white text-slate-900 [a]:hover:bg-muted dark:border-border dark:bg-transparent",
        ghost:
          "border-transparent hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "border-transparent text-[#7C3AED] underline-offset-4 hover:underline dark:text-primary",
        success:
          "border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm dark:border-emerald-500/25 dark:bg-emerald-950/50 dark:text-emerald-200",
        warning:
          "border border-amber-200 bg-amber-50 text-amber-900 shadow-sm dark:border-amber-500/25 dark:bg-amber-950/40 dark:text-amber-100",
        info: "border border-violet-200 bg-violet-50 text-violet-900 shadow-sm dark:border-violet-500/25 dark:bg-violet-950/40 dark:text-violet-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
