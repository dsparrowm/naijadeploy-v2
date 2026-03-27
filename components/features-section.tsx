import { GitBranch, Globe, Lock, Rocket, Server, Zap } from "lucide-react"

const features = [
  {
    icon: Rocket,
    title: "Instant Deployments",
    description: "Push to GitHub and your app is live in seconds. Zero configuration required.",
  },
  {
    icon: Globe,
    title: "African Edge Network",
    description: "CDN nodes in Lagos, Nairobi, Cape Town, and Cairo for blazing fast performance.",
  },
  {
    icon: Zap,
    title: "Pay in Naira",
    description: "No dollar fluctuations. Pay with Naira, Cedis, Rand, or Shillings.",
  },
  {
    icon: GitBranch,
    title: "Git Integration",
    description: "Seamless integration with GitHub, GitLab, and Bitbucket. Preview every PR automatically.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "SSL certificates, DDoS protection, and SOC 2 compliance out of the box.",
  },
  {
    icon: Server,
    title: "Serverless Functions",
    description: "Deploy APIs and backend logic without managing servers. Scale automatically.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to ship fast
          </h2>
          <p className="text-lg text-muted-foreground">
            Built from the ground up for African developers. No compromises.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
