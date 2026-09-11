import Link from "next/link"
import { cn } from "@/lib/utils"

/** Nested diamond: white outer + blue inner. Matches polish-html `.logo-mark`. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5 shrink-0", className)}
      aria-hidden="true"
    >
      <path d="M12 1.4 22.6 12 12 22.6 1.4 12Z" fill="#FAFAFA" />
      <path d="M12 6.2 17.8 12 12 17.8 6.2 12Z" fill="#2563EB" />
    </svg>
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
      <LogoMark className={size === "sm" ? "size-4" : "size-5"} />
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
