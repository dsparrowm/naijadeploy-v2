"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RequireSession } from "@/components/auth/require-session"
import { PaystackMark } from "@/components/brand/paystack-mark"
import { FlowFrame } from "@/components/flow/flow-frame"
import { Field, Surface } from "@/components/chrome/surface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PRO_PLAN } from "@/lib/config"
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
  const [email, setEmail] = useState(user?.email || "")
  const [card, setCard] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function checkout() {
    if (!email) return
    setPending(true)
    setError(null)
    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan: "pro" }),
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
      <FlowFrame
        variant="center"
        headerRight={<PaystackMark />}
      >
        <Surface className="p-6">
          <h1 className="text-lg font-semibold text-foreground">Pro is active</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">Paystack billing is already unlocked.</p>
          <Button asChild className="mt-5">
            <Link href="/billing">Billing</Link>
          </Button>
        </Surface>
      </FlowFrame>
    )
  }

  return (
    <FlowFrame variant="center" headerRight={<PaystackMark />}>
      <Surface className="p-6">
        <h1 className="text-lg font-semibold text-foreground">Upgrade to Pro</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Billed monthly in Naira. Cancel anytime.</p>
        <div className="mt-4 flex items-center justify-between rounded-[7px] border border-border bg-background px-3 py-3">
          <div>
            <p className="text-[13px] font-medium text-foreground">Pro</p>
            <p className="text-[12px] text-muted-foreground">Custom domains · more build minutes · priority</p>
          </div>
          <p className="text-right text-[13px] font-medium text-foreground">
            {formatNaira(PRO_PLAN.priceNaira)}
            <span className="block text-[12px] font-normal text-muted-foreground">/ month</span>
          </p>
        </div>
        <form
          className="mt-4 space-y-3.5"
          onSubmit={(event) => {
            event.preventDefault()
            void checkout()
          }}
        >
          <Field label="Email for receipt">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </Field>
          <Field label="Card (Paystack)">
            <div className="grid grid-cols-[1fr_72px_56px] gap-2">
              <Input
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="•••• •••• •••• 4242"
                value={card}
                onChange={(e) => setCard(e.target.value)}
              />
              <Input
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="12/27"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
              <Input
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="•••"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
            </div>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Card fields are visual only. Charge runs on Paystack (or the in-app demo checkout).
            </p>
          </Field>
          {error ? <p className="text-[13px] text-destructive">{error}</p> : null}
          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? "Starting Paystack…" : `Pay ${formatNaira(PRO_PLAN.priceNaira)} with Paystack`}
          </Button>
        </form>
        <div className="mt-3 flex flex-col items-center gap-1">
          <PaystackMark />
          <span className="text-[12px] text-muted-foreground">NGN</span>
          <Link href="/dashboard" className="text-[12px] text-muted-foreground hover:text-foreground">
            Keep free deploy instead
          </Link>
        </div>
      </Surface>
    </FlowFrame>
  )
}
