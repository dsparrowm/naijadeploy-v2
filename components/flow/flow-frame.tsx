import { DemoChip } from "@/components/brand/demo-chip"
import { Logo } from "@/components/brand/logo"
import { cn } from "@/lib/utils"

const STEPS = ["Connect", "Configure", "Deploy"] as const

export function FlowFrame({
  step,
  stub = false,
  title,
  description,
  children,
  className,
}: {
  step?: 0 | 1 | 2
  stub?: boolean
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex h-12 items-center justify-between border-b border-border px-4">
        <span className="inline-flex items-center gap-2">
          <Logo href="/dashboard" />
          {stub ? <DemoChip /> : null}
        </span>
        {step !== undefined ? (
          <ol className="flex items-center gap-3 text-[13px] text-muted-foreground">
            {STEPS.map((label, index) => (
              <li key={label} className="flex items-center gap-3">
                <span className={cn(index === step && "font-medium text-foreground")}>
                  {label}
                </span>
                {index < STEPS.length - 1 ? <span className="text-border">/</span> : null}
              </li>
            ))}
          </ol>
        ) : null}
      </header>
      <main className="flex flex-1 justify-center px-4 py-12">
        <div className={cn("w-full max-w-[560px]", className)}>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
          {description ? (
            <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>
          ) : null}
          <div className="mt-6">{children}</div>
        </div>
      </main>
    </div>
  )
}
