import type { Metadata } from "next"
import { LandingPage } from "@/components/marketing/landing-page"

export const metadata: Metadata = {
  title: "NaijaDeploy — Deploys and hosting in naira",
  description:
    "NaijaDeploy gives you git push deploys, servers on Lagos Edge and Paystack billing, so you can focus on building your product.",
}

export default function Home() {
  return <LandingPage />
}
