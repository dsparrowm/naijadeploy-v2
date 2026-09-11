"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RequireSession } from "@/components/auth/require-session"
import { FlowFrame } from "@/components/flow/flow-frame"
import { Button } from "@/components/ui/button"
import { PRO_PLAN, SCALE_PLAN } from "@/lib/config"
import { formatNaira } from "@/lib/format"
import { useAppStore } from "@/lib/store/app-store"

export default function UpgradePage() {
  return (
    <RequireSession>
      <UpgradeInner />
    </RequireSession>
  )
}

function UpgradeInner() {
  const router = useRouter()
  const { user, plan } = useAppStore()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function checkout() {
    if (!user) return
    setPending(true)
    setError(null)
    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, plan: "pro" }),
      })
      const payload = (await response.json()) as {
        authorizationUrl?: string
        error?: string
      }
      if (!response.ok || !payload.authorizationUrl) {
        throw new Error(payload.error || "Could not start Paystack checkout")
      }
      router.push(payload.authorizationUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed")
      setPending(false)
    }
  }

  if (plan === "pro") {
    return (
      <FlowFrame stub title="Pro is active" description="Paystack billing is already unlocked.">
        <Button asChild>
          <Link href="/billing">Billing</Link>
        </Button>
      </FlowFrame>
    )
  }

  return (
    <FlowFrame
      stub
      title="Upgrade to Pro"
      description="Pay in Naira with Paystack. Scale is a stub for later."
    >
      <div className="rounded-[7px] border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-[13px] font-medium text-foreground">Pro</p>
            <p className="text-xs text-muted-foreground">Paystack · monthly</p>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {formatNaira(PRO_PLAN.priceNaira)}
            <span className="text-[13px] font-normal text-muted-foreground">/mo</span>
          </p>
        </div>
        <ul className="space-y-1.5 px-4 py-3 text-[13px] text-muted-foreground">
          <li>Unlimited projects</li>
          <li>{PRO_PLAN.storage} · {PRO_PLAN.ram}</li>
          <li>Lagos Edge</li>
        </ul>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-[7px] border border-border px-4 py-3 text-[13px] text-muted-foreground">
        <span>Scale</span>
        <span>
          {formatNaira(SCALE_PLAN.priceNaira)}/mo · later
        </span>
      </div>
      {error ? <p className="mt-3 text-[13px] text-destructive">{error}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={checkout} disabled={pending}>
          {pending ? "Starting Paystack…" : `Pay ${formatNaira(PRO_PLAN.priceNaira)} with Paystack`}
        </Button>
        <Button asChild variant="ghost">
          <Link href="/billing">Keep Free</Link>
        </Button>
      </div>
    </FlowFrame>
  )
}
