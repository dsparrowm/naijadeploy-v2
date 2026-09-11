export const PRODUCT_NAME = "naijaDeploy"
export const PRODUCT_DOMAIN = "naijadeploy.app"
export const DEFAULT_REGION = {
  id: "lagos-edge" as const,
  label: "Lagos Edge",
}

export const PRICING_GATE = "freeDeployPaidScale" as const

export const FREE_PLAN = {
  id: "free" as const,
  name: "Free",
  priceNaira: 0,
  amountKobo: 0,
  projects: 1,
  storage: "10GB",
  ram: "512MB",
  region: DEFAULT_REGION.label,
}

export const PRO_PLAN = {
  id: "pro" as const,
  name: "Pro",
  priceNaira: 7500,
  amountKobo: 750_000,
  interval: "month" as const,
  projects: "Unlimited",
  storage: "100GB",
  ram: "2GB",
  region: DEFAULT_REGION.label,
}

export const SCALE_PLAN = {
  id: "scale" as const,
  name: "Scale",
  priceNaira: 25_000,
  amountKobo: 2_500_000,
  interval: "month" as const,
  stub: true,
}

export const DEFAULT_PAYMENT_PROVIDER = "paystack" as const

export function projectUrl(slug: string) {
  return `https://${slug}.${PRODUCT_DOMAIN}`
}

export function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "app"
}
