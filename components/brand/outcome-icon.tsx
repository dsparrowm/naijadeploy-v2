import { Mail, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function OutcomeIcon({
  kind,
  className,
}: {
  kind: "mail" | "fail"
  className?: string
}) {
  if (kind === "mail") {
    return (
      <span
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary",
          className,
        )}
      >
        <Mail className="size-5" />
      </span>
    )
  }
  return (
    <span
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full bg-destructive/15 text-destructive",
        className,
      )}
    >
      <X className="size-5" />
    </span>
  )
}
