/**
 * Placeholder figures and testimonials from the approved landing mockup.
 * This is example content, not live customer data or measured product stats.
 * Replace this module to swap the illustrations. Plan prices, Lagos Edge,
 * and `{project}.naijadeploy.app` URLs come from `@/lib/config`.
 */

export const exampleLabels = {
  chart: "example",
  quote: "Example testimonial — placeholder",
  testimonials: "Example testimonials — placeholder content",
  cta: "example",
  footer: "Mockup — figures and testimonials are example data",
} as const

export const heroIllustration = {
  projectPath: "Projects / jollof-api",
  statusLabel: "Status",
  statusValue: "Ready",
  latencyLabel: "p95 Lagos",
  latencyValue: "41ms",
  deploys: [
    { message: "feat: Paystack webhook", state: "Production", tone: "accent" },
    { message: "chore: bump next", state: "PR #42", tone: "muted" },
    { message: "feat: order tracking", state: "Previous", tone: "muted" },
  ],
  command: "$ git push",
  commandResult: "Live in 24s",
  previewSlug: "pr-42",
  phoneFeatures: ["Custom domains + SSL", "Preview per PR", "Always-on apps"],
  phoneMethods: "Card · Transfer · USSD",
} as const

export const backendIllustration = {
  edgeStatus: "lag1 · Ready",
  domain: "jollofapi.com.ng",
  domainStatus: "SSL issued",
  previewTitle: "Preview · PR #42",
} as const

/** Stacked column heights from the mockup. Lagos is drawn at 0.9× in the chart. */
export const requestChart = {
  title: "Requests by region",
  range: "Last 12 weeks",
  total: "184.2k",
  weeks: [
    { lagos: 50, abuja: 30, portHarcourt: 15 },
    { lagos: 60, abuja: 35, portHarcourt: 20 },
    { lagos: 45, abuja: 40, portHarcourt: 18 },
    { lagos: 70, abuja: 30, portHarcourt: 22 },
    { lagos: 65, abuja: 45, portHarcourt: 20 },
    { lagos: 80, abuja: 40, portHarcourt: 25 },
    { lagos: 75, abuja: 50, portHarcourt: 22 },
    { lagos: 90, abuja: 45, portHarcourt: 30 },
    { lagos: 85, abuja: 55, portHarcourt: 28 },
    { lagos: 100, abuja: 50, portHarcourt: 30 },
    { lagos: 95, abuja: 60, portHarcourt: 35 },
    { lagos: 110, abuja: 55, portHarcourt: 32 },
  ],
} as const

export const deploymentOrbit = {
  sha: "a3f9c21",
  nodes: ["Production deploy", "Rollback ready", "Preview PR #42"],
} as const

export const exampleEnvVars = [
  { key: "PAYSTACK_SECRET_KEY", value: "••••••••", scope: "Production" },
  { key: "DATABASE_URL", value: "••••••••", scope: "All" },
  { key: "NEXT_PUBLIC_APP_URL", value: "https://jollofapi.com.ng", scope: "Production" },
  { key: "FEATURE_TRACKING", value: "true", scope: "Preview" },
] as const

export const pipelineIllustration = {
  pushRef: "main · a3f9c21",
  buildDetail: "24s · lag1",
  slackChannel: "#deploys",
} as const

export const featuredQuote = {
  quote:
    "Building our own hosting setup was costly and slow. NaijaDeploy made going live much easier — we push to GitHub and it's on Lagos Edge in seconds, billed in naira with Paystack.",
  name: "Chiamaka O.",
  role: "CTO, example fintech",
} as const

export const testimonials = [
  {
    quote: "Preview links per PR changed how our team reviews features.",
    name: "Tunde A.",
    role: "Product lead",
  },
  {
    quote: "Paying ₦7,500 by bank transfer is the simplest hosting bill I've had.",
    name: "Ngozi E.",
    role: "Indie developer",
  },
  {
    quote: "Our .com.ng domain had SSL in minutes. No config files.",
    name: "Ibrahim S.",
    role: "Agency founder",
  },
  {
    quote: "Pages feel instant for users in Lagos and Abuja.",
    name: "Femi K.",
    role: "Frontend engineer",
  },
  {
    quote: "The free plan was enough to launch our MVP.",
    name: "Amaka U.",
    role: "Student founder",
  },
  {
    quote: "Live build logs make debugging failed deploys painless.",
    name: "Yusuf B.",
    role: "Backend engineer",
  },
  {
    quote: "We stopped babysitting a VPS. Push and forget.",
    name: "Kemi L.",
    role: "CTO",
  },
  {
    quote: "Rollbacks saved our launch day.",
    name: "Obi N.",
    role: "Engineer",
  },
  {
    quote: "Env vars per scope finally make sense.",
    name: "Zainab M.",
    role: "Full-stack dev",
  },
] as const

export const ctaQuote = {
  quote: "In any team of mine, NaijaDeploy is the first thing we set up.",
  name: "Tunde A.",
  role: "Founder",
} as const
