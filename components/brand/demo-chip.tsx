import { cn } from "@/lib/utils"

export function DemoChip({ className }: { className?: string }) {
  return (
    <span
      title="Stub — not live hosting"
      className={cn(
        "inline-flex h-5 items-center rounded-[4px] border border-border px-1.5 text-[10px] font-medium text-muted-foreground",
        className,
      )}
    >
      Demo
    </span>
  )
}

export function StubUrl({
  url,
  className,
}: {
  url: string
  className?: string
}) {
  const host = url.replace(/^https?:\/\//, "")
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="font-mono text-[13px] text-muted-foreground">{host}</span>
      <DemoChip />
    </span>
  )
}
