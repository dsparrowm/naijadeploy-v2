import type { ComponentProps, ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Surface({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-[7px] border border-border bg-card", className)}
      {...props}
    />
  )
}

export function SearchField({
  className,
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      type="search"
      className={cn(
        "h-9 w-full max-w-[220px] rounded-[7px] border border-border bg-background px-3 text-[13px] text-foreground outline-none placeholder:text-muted-foreground/80 focus-visible:border-primary",
        className,
      )}
      {...props}
    />
  )
}

export function Field({
  label,
  hint,
  action,
  children,
  className,
}: {
  label: string
  hint?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-3">
        <label className="text-[13px] font-medium text-muted-foreground">{label}</label>
        {action}
      </div>
      {children}
      {hint ? <p className="text-[12px] text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
