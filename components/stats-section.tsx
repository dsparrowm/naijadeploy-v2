const stats = [
  { value: "50ms", label: "Average response time in Lagos" },
  { value: "10K+", label: "African developers" },
  { value: "99.99%", label: "Uptime guaranteed" },
  { value: "₦0", label: "To get started" },
]

export function StatsSection() {
  return (
    <section className="border-t border-border bg-card py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-primary sm:text-5xl">{stat.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
