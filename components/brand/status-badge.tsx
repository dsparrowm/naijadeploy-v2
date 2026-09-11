import { cn } from "@/lib/utils"

const STYLES = {
  live: "border-success/30 text-success",
  failed: "border-destructive/30 text-destructive",
  paid: "border-success/30 text-success",
  pending: "border-warning/30 text-warning",
  open: "border-warning/30 text-warning",
  building: "border-border text-muted-foreground",
  deploying: "border-border text-muted-foreground",
  health: "border-border text-muted-foreground",
  queued: "border-border text-muted-foreground",
} as const

const LABELS: Record<string, string> = {
  live: "Live",
  failed: "Failed",
  paid: "Paid",
  pending: "Pending",
  open: "Pending",
  building: "Building",
  deploying: "Deploying",
  health: "Health",
  queued: "Queued",
}

export function StatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  const key = status.toLowerCase()
  const color = STYLES[key as keyof typeof STYLES] ?? "border-border text-muted-foreground"
  const label = LABELS[key] ?? status[0]?.toUpperCase() + status.slice(1)

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[12px] font-medium",
        color,
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}
