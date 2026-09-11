import type { ReactNode } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { PaystackGlyph } from "@/components/brand/paystack-mark"
import { Button } from "@/components/ui/button"
import { FREE_PLAN, PRO_PLAN, SCALE_PLAN } from "@/lib/config"
import { formatNaira } from "@/lib/format"
import { cn } from "@/lib/utils"

export function LandingPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-5">
          <Logo href="/" />
          <nav className="hidden items-center gap-7 text-[13px] text-muted-foreground md:flex">
            <Link href="#features" className="hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <Link href="#docs" className="hover:text-foreground">
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

      <main className="mx-auto max-w-[1120px] px-5 pb-16 pt-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="inline-flex rounded-[7px] border border-border px-2 py-0.5 text-[12px] text-muted-foreground">
              Lagos Edge · Pay in Naira
            </p>
            <h1 className="mt-4 text-[40px] font-semibold leading-[1.12] tracking-tight text-foreground">
              Deploy your apps in <span className="text-primary">naira.</span>
              <br />
              Built for builders in Lagos.
            </h1>
            <p className="mt-4 max-w-[520px] text-[14px] leading-relaxed text-muted-foreground">
              First deploy is free. Push from GitHub or GitLab — we build, host, and
              serve from Lagos Edge. Upgrade only when you need more.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Button asChild size="lg">
                <Link href="/signup">Start Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#docs">Docs</Link>
              </Button>
            </div>
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
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

        <section id="features" className="mt-10 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard label="Edge" title="Lagos Edge" body="West Africa · low RTT" />
          <FeatureCard
            label="Billing"
            title="Pay in Naira"
            body={
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-flex size-3.5 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="size-2.5" />
                </span>
                Paystack
              </span>
            }
          />
          <FeatureCard label="SSL" title="Auto certificates" body="Let’s Encrypt on every URL" />
          <FeatureCard
            label="Databases"
            title="PostgreSQL · Redis"
            body={
              <span className="rounded-[4px] border border-border px-1.5 py-px text-[11px] text-muted-foreground">
                Coming soon
              </span>
            }
          />
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div id="docs">
            <p className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
              How it works
            </p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
              <StepCard n={1} title="Push code" body="Connect GitHub or GitLab." />
              <StepCard n={2} title="Build" body="We detect framework & deploy." />
              <StepCard n={3} title="Live" body="URL on Lagos Edge · Free." />
            </div>
          </div>

          <div id="pricing">
            <p className="text-right text-[12px] text-muted-foreground">NGN · billed via Paystack</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
              <PlanCard
                name="Free"
                price={formatNaira(FREE_PLAN.priceNaira)}
                features={["1 project · Lagos Edge", "Shared compute", "*.naijadeploy.app"]}
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
                footnote="stub · after Pro"
                cta="Coming later"
                disabled
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-3 px-5 py-5 text-[12px] text-muted-foreground">
          <p>© 2026 naijaDeploy · Made in Lagos</p>
          <div className="flex items-center gap-5">
            <Link href="#features" className="hover:text-foreground">
              Product
            </Link>
            <Link href="#docs" className="hover:text-foreground">
              Docs
            </Link>
            <span>Status</span>
            <span>Privacy</span>
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
    <div className="rounded-[7px] border border-border bg-card px-3.5 py-3">
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-[13px] font-medium text-foreground">{title}</p>
      <div className="mt-1 text-[12px] text-muted-foreground">{body}</div>
    </div>
  )
}

function StepCard({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="rounded-[7px] border border-border bg-card px-3.5 py-3">
      <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
        {n}
      </span>
      <p className="mt-2.5 text-[13px] font-medium text-foreground">{title}</p>
      <p className="mt-1 text-[12px] leading-snug text-muted-foreground">{body}</p>
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
        "relative flex flex-col rounded-[7px] border bg-card px-3.5 py-4",
        popular ? "border-primary" : "border-border",
      )}
    >
      {popular ? (
        <span className="absolute right-3 top-3 rounded-full bg-primary/15 px-2 py-px text-[10px] font-medium text-primary">
          Popular
        </span>
      ) : null}
      <p className="text-[13px] font-medium text-foreground">{name}</p>
      <p className="mt-2 text-[22px] font-semibold tracking-tight text-foreground">
        {price}
        {period ? <span className="text-[12px] font-medium text-muted-foreground">{period}</span> : null}
      </p>
      {footnote ? <p className="mt-0.5 text-[12px] text-muted-foreground">{footnote}</p> : null}
      {name === "Free" ? (
        <p className="mt-0.5 text-[12px] text-muted-foreground">forever for first project</p>
      ) : null}
      <ul className="mt-3 flex-1 space-y-1.5 text-[12px] text-muted-foreground">
        {features.map((item) => (
          <li key={item}>· {item}</li>
        ))}
      </ul>
      {disabled || !href ? (
        <Button type="button" variant="outline" className="mt-4 w-full" disabled>
          {cta}
        </Button>
      ) : (
        <Button asChild variant={popular ? "default" : "outline"} className="mt-4 w-full">
          <Link href={href}>{cta}</Link>
        </Button>
      )}
    </div>
  )
}

function TerminalCard() {
  return (
    <div className="overflow-hidden rounded-[7px] border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <span className="size-2 rounded-full bg-[#ef4444]" />
        <span className="size-2 rounded-full bg-[#eab308]" />
        <span className="size-2 rounded-full bg-[#22c55e]" />
        <span className="ml-2 text-[12px] text-muted-foreground">deploy · naija-pay-gateway</span>
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[12px] leading-6 text-muted-foreground">
        <span className="text-foreground">$ git push naija main</span>
        {"\n"}
        <span>→ Detected Next.js 14</span>
        {"\n"}
        <span>→ Region: Lagos Edge</span>
        {"\n"}
        <span className="text-success">✓ Build successful · 48s</span>
        {"\n"}
        <span className="text-success">✓ Health check passed</span>
        {"\n"}
        <span>→ https://naija-pay-gateway.naijadeploy.app</span>
        {"\n"}
        <span className="text-success">LIVE</span>
        <span> · Free · ₦0</span>
      </pre>
    </div>
  )
}
