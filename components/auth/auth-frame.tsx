import { Logo } from "@/components/brand/logo"
import { cn } from "@/lib/utils"

export function AuthFrame({
  title,
  description,
  children,
  footer,
  className,
}: {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex h-12 items-center border-b border-border px-4">
        <Logo />
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-16">
        <div className={cn("w-full max-w-[360px]", className)}>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
          {description ? (
            <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>
          ) : null}
          <div className="mt-6">{children}</div>
          {footer ? <div className="mt-6 text-[13px] text-muted-foreground">{footer}</div> : null}
        </div>
      </main>
    </div>
  )
}
