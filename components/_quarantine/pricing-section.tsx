import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { FREE_PLAN, PRO_PLAN, SCALE_PLAN } from "@/lib/config"
import { formatNaira } from "@/lib/format"

const plans = [
  {
    name: FREE_PLAN.name,
    price: formatNaira(FREE_PLAN.priceNaira),
    period: "",
    description: "First deploy is FREE. Lagos Edge.",
    features: [
      `${FREE_PLAN.projects} project`,
      `${FREE_PLAN.storage} · ${FREE_PLAN.ram}`,
      FREE_PLAN.region,
      "Git deploy",
    ],
    cta: "Start free",
    href: "/signup",
    popular: false,
    disabled: false,
  },
  {
    name: PRO_PLAN.name,
    price: formatNaira(PRO_PLAN.priceNaira),
    period: "/mo",
    description: "Paystack. Pay in Naira.",
    features: [
      "Unlimited projects",
      `${PRO_PLAN.storage} · ${PRO_PLAN.ram}`,
      PRO_PLAN.region,
      "Paystack checkout",
    ],
    cta: "Upgrade to Pro",
    href: "/signup",
    popular: true,
    disabled: false,
  },
  {
    name: SCALE_PLAN.name,
    price: formatNaira(SCALE_PLAN.priceNaira),
    period: "/mo",
    description: "Later. Not available in v1.",
    features: ["Higher limits", "Team features", "Priority capacity"],
    cta: "Coming later",
    href: "#pricing",
    popular: false,
    disabled: true,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-border bg-card py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-foreground">
            Free first. Pro via Paystack.
          </h2>
          <p className="text-[18px] text-muted-foreground">
            ₦0 to ship one project. Pay in Naira when you need Pro.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-[7px] border bg-background p-6 ${
                plan.popular ? "border-primary" : "border-border"
              }`}
            >
              {plan.popular ? (
                <div className="mb-3 text-xs font-medium text-primary">Paystack</div>
              ) : null}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-[13px] text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-2xl font-semibold text-foreground">{plan.price}</span>
                <span className="text-[13px] text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="mb-8 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-[13px] text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full" variant={plan.popular ? "default" : "secondary"} asChild disabled={plan.disabled}>
                {plan.disabled ? (
                  <span>{plan.cta}</span>
                ) : (
                  <Link href={plan.href}>{plan.cta}</Link>
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
