import Link from "next/link"
import { cn } from "@/lib/utils"

/** Nested diamond on a blue tile: white outer + blue inner. Matches polish `.logo-mark`. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-[7px] bg-primary",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-[18px]">
        <path d="M12 1.4 22.6 12 12 22.6 1.4 12Z" fill="#FAFAFA" />
        <path d="M12 6.2 17.8 12 12 17.8 6.2 12Z" fill="#1D4ED8" />
      </svg>
    </span>
  )
}

export function Logo({
  href = "/",
  size = "default",
  className,
}: {
  href?: string | null
  size?: "default" | "sm"
  className?: string
}) {
  const content = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={size === "sm" ? "size-6" : "size-7"} />
      <span
        className={cn(
          "font-medium tracking-tight text-foreground",
          size === "sm" ? "text-[13px]" : "text-sm",
        )}
      >
        naijaDeploy
      </span>
    </span>
  )

  if (!href) return content
  return (
    <Link href={href} className="inline-flex items-center">
      {content}
    </Link>
  )
}
