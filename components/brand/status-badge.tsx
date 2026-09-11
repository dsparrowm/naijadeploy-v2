import { cn } from "@/lib/utils"

const STYLES = {
  live: "text-success",
  failed: "text-destructive",
  paid: "text-success",
  pending: "text-warning",
  open: "text-warning",
  building: "text-muted-foreground",
  deploying: "text-muted-foreground",
  health: "text-muted-foreground",
  queued: "text-muted-foreground",
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
  const color = STYLES[key as keyof typeof STYLES] ?? "text-muted-foreground"
  const label = LABELS[key] ?? status[0]?.toUpperCase() + status.slice(1)

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12px] font-medium", color, className)}>
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}
