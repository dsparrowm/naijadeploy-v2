import type { ReactNode } from "react"
import Link from "next/link"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import {
  BackendScene,
  DeploymentOrbit,
  EnvPanel,
  HeroScene,
  MetricsChart,
  PipelineScene,
} from "@/components/marketing/product-scenes"
import { ctaQuote, exampleLabels, featuredQuote, testimonials } from "@/lib/marketing/example-content"
import { DEFAULT_REGION, FREE_PLAN, PRO_PLAN, SCALE_PLAN } from "@/lib/config"
import { formatNaira } from "@/lib/format"
import { cn } from "@/lib/utils"

const shell = "mx-auto w-full max-w-[1120px] px-5 sm:px-8"

const primaryCta =
  "inline-flex items-center justify-center rounded-full bg-[#f2545b] px-6 py-3 text-sm font-semibold text-white hover:bg-[#e4464d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141433]"

const secondaryCta =
  "inline-flex items-center justify-center rounded-full border-2 border-[#141433] px-6 py-3 text-sm font-semibold text-[#141433] hover:bg-[#141433] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2545b]"

/** Scale is sales-assisted and not checkoutable, so this starts at signup. */
const salesHref = "/signup?intent=scale"

const ghostOnDark =
  "inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"

export function LandingPage() {
  return (
    <div className="min-h-svh bg-white text-base text-[#141433] [color-scheme:light]">
      <MarketingHeader />
      <main id="content">
        <section className={cn(shell, "grid items-center gap-10 pb-16 pt-4 lg:grid-cols-2 lg:gap-16 lg:pb-[90px] lg:pt-[50px] [&>*]:min-w-0")}>
          <div>
            <h1 className="text-balance text-[34px] font-black leading-[1.05] tracking-tight text-[#141433] sm:text-[44px] lg:text-[52px]">
              Deploys and hosting in naira made easy
            </h1>
            <p className="mt-4 text-lg leading-[1.6] text-[#5b5b7a]">
              NaijaDeploy gives you git push deploys, servers on {DEFAULT_REGION.label} and Paystack billing, so you can
              focus on building your product.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className={primaryCta}>
                START DEPLOYING FREE
              </Link>
              <Link href={salesHref} className={secondaryCta}>
                TALK TO SALES
              </Link>
            </div>
          </div>
          <HeroScene />
        </section>

        <section className={cn(shell, "grid gap-10 pb-10 md:grid-cols-3")} aria-label="Who it's for">
          <Audience
            id="for-engineering"
            icon="⌘"
            title="For Engineering"
            body="Git push to deploy with framework detection, live build logs and instant rollbacks."
          />
          <Audience
            id="for-marketing"
            icon="₦"
            title="For Marketing"
            body="Launch campaign pages on your own .ng domain with automatic SSL, fast on Nigerian networks."
          />
          <Audience
            id="for-product"
            icon="◎"
            title="For Product"
            body="Every pull request gets a preview URL to review and share before release."
          />
        </section>

        <Split id="backend">
          <Copy
            title="Unified deploy backend — no servers required"
            body={`Connect GitHub and NaijaDeploy builds, hosts and scales your app on ${DEFAULT_REGION.label}. No VPS to patch, no Nginx config, no dollar card.`}
          />
          <BackendScene />
        </Split>

        <Split id="metrics">
          <div className="order-2 lg:order-1">
            <MetricsChart />
          </div>
          <div className="order-1 lg:order-2">
            <Copy
              title="Analyze your most important metrics in one place"
              body="Requests, latency, bandwidth and build times for every project — plus live runtime logs, without wiring up a separate monitoring tool."
            />
          </div>
        </Split>

        <Split id="deployments">
          <Copy
            title="Single source of truth for your deployments"
            body="Every push, preview, rollback and domain lives in one timeline, so the whole team knows what's live in production right now."
          />
          <DeploymentOrbit />
        </Split>

        <Split id="configure">
          <div className="order-2 lg:order-1">
            <EnvPanel />
          </div>
          <div className="order-1 lg:order-2">
            <Copy
              title="Host and configure projects remotely"
              body="Manage domains, env vars and build settings from the dashboard. Changes roll out with a redeploy — no SSH, no downtime."
            />
          </div>
        </Split>

        <Split id="pipeline">
          <Copy
            title="Real-time deploy pipeline"
            body="From git push to live in seconds, with webhooks and alerts to the tools you already use."
          />
          <PipelineScene />
        </Split>

        <section className={cn(shell, "grid items-start gap-4 py-16 lg:grid-cols-[120px_1fr] lg:gap-6 lg:py-20")}>
          <div className="text-[88px] font-black leading-none text-[#f9c74f] lg:text-[160px]" aria-hidden="true">
            “
          </div>
          <blockquote>
            <p className="text-balance text-[22px] font-bold leading-snug text-[#141433] sm:text-[28px]">
              {featuredQuote.quote}
            </p>
            <footer className="mt-6 flex items-center gap-3">
              <span className="size-11 shrink-0 rounded-full bg-zinc-300" aria-hidden="true" />
              <span className="text-sm">
                <span className="block font-bold text-[#141433]">{featuredQuote.name}</span>
                <span className="text-zinc-500">{featuredQuote.role}</span>
              </span>
            </footer>
            <p className="mt-2 text-[10px] text-[#6e6e86]">{exampleLabels.quote}</p>
          </blockquote>
        </section>

        <section id="testimonials" className={cn(shell, "scroll-mt-8 py-16")}>
          <h2 className="text-balance text-center text-[30px] font-extrabold tracking-[-0.02em] text-[#141433] sm:text-[38px]">
            What people are saying
          </h2>
          <p className="mt-1 text-center text-[10px] text-[#6e6e86]">{exampleLabels.testimonials}</p>
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item) => (
              <li
                key={item.name + item.role}
                className="rounded-[12px] border border-[#eceef3] bg-white p-5 text-sm shadow-[0_12px_30px_-12px_rgba(20,20,51,0.18)]"
              >
                <blockquote>
                  <p className="text-[#141433]">“{item.quote}”</p>
                  <footer className="mt-4 flex items-center gap-2">
                    <span className="size-8 shrink-0 rounded-full bg-zinc-200" aria-hidden="true" />
                    <span>
                      <span className="block font-bold text-[#141433]">{item.name}</span>
                      <span className="text-xs text-zinc-500">{item.role}</span>
                    </span>
                  </footer>
                </blockquote>
              </li>
            ))}
          </ul>
        </section>

        <section id="get-started" className="bg-[#141433] text-white">
          <div className={cn(shell, "grid items-center gap-10 py-16 lg:grid-cols-2")}>
            <div>
              <h2 className="text-balance text-[30px] font-extrabold leading-tight tracking-[-0.02em] sm:text-[38px]">
                Ready to get started?
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/signup" className={primaryCta}>
                  START DEPLOYING FREE
                </Link>
                <Link href={salesHref} className={ghostOnDark}>
                  TALK TO SALES
                </Link>
              </div>
            </div>
            <blockquote className="border-l-2 border-[#f2545b] pl-6">
              <p className="text-lg italic">“{ctaQuote.quote}”</p>
              <footer className="mt-4 flex items-center gap-3 text-sm">
                <span className="size-9 shrink-0 rounded-full bg-zinc-500" aria-hidden="true" />
                <span>
                  {ctaQuote.name} · {ctaQuote.role}{" "}
                  <span className="text-[10px] text-[#9a9ab0]">({exampleLabels.cta})</span>
                </span>
              </footer>
            </blockquote>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function Split({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section
      id={id}
      className={cn(
        shell,
        "grid scroll-mt-8 items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-[90px] [&>*]:min-w-0",
      )}
    >
      {children}
    </section>
  )
}

function Copy({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="text-balance text-[30px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#141433] sm:text-[38px]">
        {title}
      </h2>
      <p className="mt-4 text-base leading-[1.6] text-[#5b5b7a]">{body}</p>
    </div>
  )
}

function Audience({ id, icon, title, body }: { id: string; icon: string; title: string; body: string }) {
  return (
    <article id={id} className="scroll-mt-8">
      <div className="grid size-10 place-items-center rounded-[8px] bg-[#fde8e9] text-lg text-[#f2545b]" aria-hidden="true">
        {icon}
      </div>
      <h3 className="mt-4 font-bold text-[#141433]">{title}</h3>
      <p className="mt-4 text-sm leading-[1.6] text-[#5b5b7a]">{body}</p>
    </article>
  )
}

function SiteFooter() {
  const pricing = `Pricing: Free ${formatNaira(FREE_PLAN.priceNaira)} · Pro ${formatNaira(PRO_PLAN.priceNaira)} · Scale ${formatNaira(SCALE_PLAN.priceNaira)} (soon)`

  return (
    <footer className="bg-white">
      <div className={cn(shell, "grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-5")}>
        <div>
          <p className="text-lg font-extrabold tracking-tight">
            <span className="text-[#f2545b]">Naija</span>Deploy
          </p>
          <div className="mt-4 flex gap-3 text-sm text-zinc-400" aria-hidden="true">
            <span>𝕏</span>
            <span>in</span>
            <span>GH</span>
          </div>
        </div>
        <FooterColumn
          id="resources"
          title="Resources"
          items={[
            { label: "Blog" },
            { label: "Changelog" },
            { label: "Status" },
            { label: "Community" },
          ]}
        />
        <FooterColumn
          id="documentation"
          title="Documentation"
          items={[
            { label: "Quickstart" },
            { label: "CLI" },
            { label: "Domains & SSL", href: "#for-marketing" },
            { label: "Env variables", href: "#configure" },
          ]}
        />
        <div id="pricing" className="scroll-mt-8">
          <p className="font-bold text-[#141433]">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-500">
            <li>
              <Link href="#deployments" className="hover:text-[#141433]">
                Deployments
              </Link>
            </li>
            <li>
              <Link href="#for-product" className="hover:text-[#141433]">
                Previews
              </Link>
            </li>
            <li>
              <Link href="#backend" className="hover:text-[#141433]">
                {DEFAULT_REGION.label}
              </Link>
            </li>
            <li>{pricing}</li>
            <li>Databases (soon)</li>
          </ul>
        </div>
        <FooterColumn
          title="Legal"
          items={[{ label: "Terms" }, { label: "Privacy" }, { label: "Security" }]}
        />
        <p className="border-t border-[#eceef3] pt-6 text-xs text-zinc-500 sm:col-span-2 lg:col-span-5">
          © 2026 NaijaDeploy · {exampleLabels.footer}
        </p>
      </div>
    </footer>
  )
}

function FooterColumn({
  id,
  title,
  items,
}: {
  id?: string
  title: string
  items: { label: string; href?: string }[]
}) {
  return (
    <div id={id} className="scroll-mt-8">
      <p className="font-bold text-[#141433]">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-zinc-500">
        {items.map((item) => (
          <li key={item.label}>
            {item.href ? (
              <Link href={item.href} className="hover:text-[#141433]">
                {item.label}
              </Link>
            ) : (
              item.label
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
