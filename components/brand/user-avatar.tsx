import { cn } from "@/lib/utils"
import { initials } from "@/lib/format"

export function UserAvatar({
  name,
  className,
  size = "md",
}: {
  name: string
  className?: string
  size?: "sm" | "md"
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-surface-2 text-[11px] font-medium text-foreground",
        size === "sm" ? "size-6" : "size-8",
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
