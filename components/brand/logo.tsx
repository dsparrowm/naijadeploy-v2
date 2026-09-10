import Link from "next/link"
import { cn } from "@/lib/utils"

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5 shrink-0", className)}
      aria-hidden="true"
    >
      <path d="M4 5.2 12 2l8 3.2v13.6L12 22l-8-3.2V5.2Z" fill="#2563EB" />
      <path d="M12 2v20L4 18.8V5.2L12 2Z" fill="#1D4ED8" />
      <path d="M8.2 9.1h2.3l3.3 5.8V9.1H16v6.8h-2.3L10.4 10v5.9H8.2V9.1Z" fill="#FAFAFA" />
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
