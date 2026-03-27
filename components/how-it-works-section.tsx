const steps = [
  {
    number: "01",
    title: "Connect Your Repository",
    description: "Link your GitHub, GitLab, or Bitbucket repository with one click. We support all popular frameworks.",
    code: `$ naija connect github
✓ Connected to oladipo/my-awesome-app
✓ Detected framework: Next.js`,
  },
  {
    number: "02",
    title: "Push Your Code",
    description: "Every push to your main branch triggers an automatic deployment. Preview deployments for every PR.",
    code: `$ git push origin main
Enumerating objects: 15, done.
Writing objects: 100% (15/15), done.
→ Deployment triggered...`,
  },
  {
    number: "03",
    title: "Go Live Instantly",
    description: "Your app is deployed to our African edge network in seconds. Share your .naija.app URL with the world.",
    code: `✓ Build completed in 23s
✓ Deployed to edge network
✓ https://my-app.naija.app`,
  },
]

export function HowItWorksSection() {
  return (
    <section className="border-t border-border bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Deploy in three simple steps
          </h2>
          <p className="text-lg text-muted-foreground">
            From git push to production in under a minute. No complex configurations.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 space-y-16 lg:space-y-24">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`flex flex-col items-center gap-8 lg:flex-row ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Content */}
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-3">
                  <span className="text-4xl font-bold text-primary">{step.number}</span>
                  <div className="h-px w-12 bg-primary/50"></div>
                </div>
                <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                <p className="text-lg text-muted-foreground">{step.description}</p>
              </div>

              {/* Code Block */}
              <div className="flex-1">
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                    <div className="h-3 w-3 rounded-full bg-destructive/50"></div>
                    <div className="h-3 w-3 rounded-full bg-chart-4/50"></div>
                    <div className="h-3 w-3 rounded-full bg-primary/50"></div>
                    <span className="ml-2 text-xs text-muted-foreground">Terminal</span>
                  </div>
                  <pre className="overflow-x-auto p-4 text-sm">
                    <code className="text-muted-foreground">{step.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
