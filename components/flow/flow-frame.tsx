import type { ReactNode } from "react"
import { Logo } from "@/components/brand/logo"
import { DemoChip } from "@/components/brand/demo-chip"
import { FlowStepper } from "@/components/chrome/stepper"
import { cn } from "@/lib/utils"

export function FlowFrame({
  step,
  stub = false,
  title,
  description,
  children,
  rail,
  headerRight,
  variant = "wizard",
  className,
}: {
  step?: 0 | 1 | 2
  stub?: boolean
  title?: string
  description?: string
  children: ReactNode
  rail?: ReactNode
  headerRight?: ReactNode
  variant?: "wizard" | "center"
  className?: string
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex h-12 items-center justify-between border-b border-border px-5">
        <span className="inline-flex items-center gap-2">
          <Logo href="/dashboard" />
          {stub ? <DemoChip /> : null}
        </span>
        <div className="flex items-center gap-2">{headerRight}</div>
      </header>

      {variant === "center" ? (
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <div className={cn("w-full max-w-[440px]", className)}>
            {children}
          </div>
        </main>
      ) : (
        <main className="flex flex-1">
          <div className={cn("min-w-0 flex-1 px-6 py-6", rail && "pr-4")}>
            {step !== undefined ? (
              <div className="mb-6">
                <FlowStepper step={step} />
              </div>
            ) : null}
            {title ? <h1 className="text-lg font-semibold text-foreground">{title}</h1> : null}
            {description ? <p className="mt-1 text-[13px] text-muted-foreground">{description}</p> : null}
            <div className={title ? "mt-5" : undefined}>{children}</div>
          </div>
          {rail ? (
            <aside className="hidden w-[280px] shrink-0 border-l border-border bg-background px-4 py-6 lg:block">
              {rail}
            </aside>
          ) : null}
        </main>
      )}
    </div>
  )
}

export function FlowRail({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="space-y-3">{children}</div>
    </div>
  )
}
