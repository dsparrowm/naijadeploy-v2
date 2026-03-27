import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Hobby",
    price: "₦0",
    period: "forever",
    description: "Perfect for side projects and learning",
    features: [
      "Unlimited deployments",
      "1 GB bandwidth/month",
      "SSL certificates",
      "Community support",
      "Automatic HTTPS",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "₦5,000",
    period: "/month",
    description: "For professional developers and small teams",
    features: [
      "Everything in Hobby",
      "100 GB bandwidth/month",
      "Custom domains",
      "Analytics dashboard",
      "Priority support",
      "Preview deployments",
      "Team collaboration",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with advanced needs",
    features: [
      "Everything in Pro",
      "Unlimited bandwidth",
      "SLA guarantee",
      "Dedicated support",
      "SOC 2 compliance",
      "Custom contracts",
      "On-premise option",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-border bg-card py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Pricing that makes sense
          </h2>
          <p className="text-lg text-muted-foreground">
            Pay in your local currency. No hidden fees. No surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? "border-primary bg-background shadow-lg shadow-primary/10"
                  : "border-border bg-background"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
