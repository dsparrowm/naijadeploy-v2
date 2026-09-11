import type { ReactNode } from "react"
import Link from "next/link"
import { Logo } from "@/components/brand/logo"
import { PaystackGlyph } from "@/components/brand/paystack-mark"
import { Button } from "@/components/ui/button"
import { FREE_PLAN, PRO_PLAN, SCALE_PLAN } from "@/lib/config"
import { formatNaira } from "@/lib/format"
import { cn } from "@/lib/utils"

const shell = "mx-auto w-full max-w-[1280px] px-6 sm:px-8"

export function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95">
        <div className={cn(shell, "flex h-[52px] items-center justify-between")}>
          <Logo href="/" />
          <nav className="hidden items-center gap-7 text-[13px] text-muted-foreground md:flex">
            <Link href="#features" className="hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <Link href="#" className="hover:text-foreground">
              Docs
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Start Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className={cn(shell, "flex flex-1 flex-col pb-2 pt-3")}>
        <div className="grid items-center gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-9">
          <div>
            <p className="inline-flex rounded-[7px] border border-primary/35 bg-primary/10 px-2 py-0.5 text-[12px] text-primary">
              Lagos Edge · Pay in Naira
            </p>
            <h1 className="mt-2 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground">
              Deploy your apps in <span className="text-primary">naira.</span>
              <br />
              Built for builders in Lagos.
            </h1>
            <p className="mt-2 max-w-[540px] text-[14px] leading-snug text-muted-foreground">
              First deploy is free. Push from GitHub or GitLab — we build, host, and
              serve from Lagos Edge. Upgrade only when you need more.
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <Button asChild size="sm">
                <Link href="/signup">Start Free</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="#">Docs</Link>
              </Button>
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <PaystackGlyph />
                Paystack only
              </span>
              <span>No FX fees on Free</span>
              <span>~50ms West Africa RTT</span>
            </p>
          </div>
          <TerminalCard />
        </div>

        <section id="features" className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          <FeatureCard label="Edge" title="Lagos Edge" body="West Africa · low RTT" />
          <FeatureCard
            label="Billing"
            title="Pay in Naira"
            body={
              <span className="inline-flex items-center gap-1.5">
                <PaystackGlyph className="size-3.5 text-[9px]" />
                Paystack
              </span>
            }
          />
          <FeatureCard label="SSL" title="Auto certificates" body="Let’s Encrypt on every URL" />
          <FeatureCard
            label="Databases"
            title="Postgres · Redis"
            body={
              <span className="mt-0.5 inline-flex rounded-[4px] border border-border px-1.5 py-px text-[11px] text-muted-foreground">
                Coming soon
              </span>
            }
          />
        </section>

        <section className="mt-3 flex flex-col gap-3">
          <div id="how-it-works" className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              How it works
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2.5 min-[720px]:grid-cols-3">
              <StepCard n={1} title="Push code" body="Connect GitHub or GitLab." />
              <StepCard n={2} title="Build" body="We detect framework & deploy." />
              <StepCard n={3} title="Live" body="URL on Lagos Edge · Free." />
            </div>
          </div>

          <div id="pricing" className="min-w-0">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                Pricing
              </p>
              <p className="text-[12px] text-muted-foreground">NGN · billed via Paystack</p>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2.5 min-[720px]:grid-cols-3">
              <PlanCard
                name="Free"
                price={formatNaira(FREE_PLAN.priceNaira)}
                features={["1 project · Lagos Edge", "Shared compute", "*.naijadeploy.app"]}
                footnote="forever for first project"
                cta="Start Free"
                href="/signup"
              />
              <PlanCard
                name="Pro"
                price={formatNaira(PRO_PLAN.priceNaira)}
                period="/mo"
                popular
                features={["Custom domains", "More build minutes", "Priority support"]}
                footnote="via Paystack"
                cta="Go Pro"
                href="/signup"
              />
              <PlanCard
                name="Scale"
                price={formatNaira(SCALE_PLAN.priceNaira)}
                period="/mo"
                features={["Higher limits", "Dedicated capacity", "Sales-assisted"]}
                footnote="after Pro"
                cta="Coming later"
                disabled
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className={cn(shell, "flex h-9 items-center justify-between gap-3 text-[12px] text-muted-foreground")}>
          <p>© 2026 naijaDeploy · Made in Lagos</p>
          <div className="flex items-center gap-5 text-primary">
            <Link href="#features" className="hover:text-primary/80">
              Product
            </Link>
            <Link href="#" className="hover:text-primary/80">
              Docs
            </Link>
            <Link href="#" className="hover:text-primary/80">
              Status
            </Link>
            <Link href="#" className="hover:text-primary/80">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  label,
  title,
  body,
}: {
  label: string
  title: string
  body: ReactNode
}) {
  return (
    <div className="rounded-[7px] border border-border bg-card px-3.5 py-2">
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-[13px] font-medium text-foreground">{title}</p>
      <div className="mt-1 flex items-start text-[12px] text-muted-foreground">{body}</div>
    </div>
  )
}

function StepCard({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="rounded-[7px] border border-border bg-card px-3 py-2">
      <span className="inline-flex size-[22px] items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">
        {n}
      </span>
      <p className="mt-1 text-[13px] font-medium text-foreground">{title}</p>
      <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{body}</p>
    </div>
  )
}

function PlanCard({
  name,
  price,
  period,
  features,
  footnote,
  cta,
  href,
  popular,
  disabled,
}: {
  name: string
  price: string
  period?: string
  features: string[]
  footnote?: string
  cta: string
  href?: string
  popular?: boolean
  disabled?: boolean
}) {
  return (
    <div
      className={cn(
        "relative flex h-full min-w-0 flex-col rounded-[7px] border px-3.5 py-2",
        popular ? "border-primary bg-primary/[0.07]" : "border-border bg-card",
      )}
    >
      {popular ? (
        <span className="absolute right-2.5 top-2.5 rounded-full bg-primary/15 px-2 py-px text-[10px] font-medium text-primary">
          Popular
        </span>
      ) : null}
      <p className="text-[13px] font-medium text-foreground">{name}</p>
      <p className="mt-1 text-[22px] font-semibold tracking-tight text-foreground">
        {price}
        {period ? <span className="text-[12px] font-medium text-muted-foreground">{period}</span> : null}
      </p>
      {footnote ? <p className="mt-0.5 text-[12px] text-muted-foreground">{footnote}</p> : null}
      <ul className="mt-2 space-y-1 text-[12px] text-muted-foreground">
        {features.map((item) => (
          <li key={item}>· {item}</li>
        ))}
      </ul>
      {disabled || !href ? (
        <div className="mt-auto pt-2">
          <Button type="button" variant="outline" size="sm" className="w-full" disabled>
            {cta}
          </Button>
        </div>
      ) : (
        <div className="mt-auto pt-2">
          <Button asChild variant={popular ? "default" : "outline"} size="sm" className="w-full">
            <Link href={href}>{cta}</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

function TerminalCard() {
  return (
    <div className="overflow-hidden rounded-[7px] border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-3.5 py-1.5">
        <span className="size-2 rounded-full bg-[#ef4444]" />
        <span className="size-2 rounded-full bg-[#eab308]" />
        <span className="size-2 rounded-full bg-[#22c55e]" />
        <span className="ml-2 truncate text-[12px] text-muted-foreground">
          deploy · naija-pay-gateway
        </span>
      </div>
      <div className="space-y-0 px-[15px] py-2.5 font-mono text-[11.5px] leading-[1.55]">
        <p className="text-[#7dd3fc]">$ git push naija main</p>
        <p className="text-[#737373]">→ Detected Next.js 14</p>
        <p className="text-[#737373]">→ Region: Lagos Edge</p>
        <p className="text-success">✓ Build successful · 48s</p>
        <p className="text-success">✓ Health check passed</p>
        <p className="truncate text-[#7dd3fc]">→ https://naija-pay-gateway.naijadeploy.app</p>
        <p>
          <span className="text-success">LIVE</span>
          <span className="text-[#737373]"> · Free · ₦0</span>
        </p>
      </div>
    </div>
  )
}
