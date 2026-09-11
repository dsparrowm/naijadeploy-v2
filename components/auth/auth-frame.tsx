import type { ReactNode } from "react"
import { Check, CreditCard } from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { Surface } from "@/components/chrome/surface"

export function SignupMarketing() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">
        Build for Africa.
        <br />
        <span className="text-primary">Deploy on Lagos Edge.</span>
      </h1>
      <p className="mt-3 max-w-sm text-[14px] text-muted-foreground">
        Paired with Naira billing. First deploy is free.
      </p>
      <ul className="mt-8 space-y-2.5">
        <MarketingItem title="Lagos Edge" body="Low-latency deploys for West Africa." />
        <MarketingItem title="Pay in Naira" body="Cards via Paystack. No FX detour." icon="pay" />
        <MarketingItem title="Free first deploy" body="Ship a live URL before you upgrade." icon="up" />
      </ul>
    </div>
  )
}

function MarketingItem({
  title,
  body,
  icon = "check",
}: {
  title: string
  body: string
  icon?: "check" | "pay" | "up"
}) {
  return (
    <li className="flex items-start gap-3 rounded-[7px] border border-border bg-card px-3.5 py-3">
      <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-success/15 text-success">
        {icon === "pay" ? <CreditCard className="size-3" /> : icon === "up" ? <span className="text-[11px] font-semibold">↑</span> : <Check className="size-3" />}
      </span>
      <span>
        <span className="block text-[13px] font-medium text-foreground">{title}</span>
        <span className="mt-0.5 block text-[12px] text-muted-foreground">{body}</span>
      </span>
    </li>
  )
}

export function AuthFrame({
  title,
  description,
  children,
  footer,
  variant = "card",
  marketing,
  icon,
}: {
  title: string
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  variant?: "card" | "split"
  marketing?: ReactNode
  icon?: ReactNode
}) {
  if (variant === "split") {
    return (
      <div className="grid min-h-svh bg-background lg:grid-cols-2">
        <aside className="flex flex-col border-b border-border px-8 py-6 lg:border-b-0 lg:border-r lg:px-12 lg:py-8">
          <Logo />
          <div className="flex flex-1 flex-col justify-center py-12">{marketing ?? <SignupMarketing />}</div>
          <p className="text-[12px] text-muted-foreground">© 2026 naijaDeploy</p>
        </aside>
        <main className="flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-[400px]">
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            {description ? <p className="mt-1 text-[13px] text-muted-foreground">{description}</p> : null}
            <div className="mt-6">{children}</div>
            {footer ? <div className="mt-5 text-center text-[13px] text-muted-foreground">{footer}</div> : null}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      <header className="absolute left-6 top-5">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <Surface className="w-full max-w-[400px] p-7">
          {icon ? <div className="mb-4">{icon}</div> : null}
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {description ? <p className="mt-1 text-[13px] text-muted-foreground">{description}</p> : null}
          <div className="mt-5">{children}</div>
          {footer ? <div className="mt-5 text-center text-[13px] text-muted-foreground">{footer}</div> : null}
        </Surface>
      </main>
    </div>
  )
}
