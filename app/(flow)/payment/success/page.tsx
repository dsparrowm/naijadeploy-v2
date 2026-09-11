"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { FlowFrame } from "@/components/flow/flow-frame"
import { Button } from "@/components/ui/button"
import { formatNaira } from "@/lib/format"
import { PRO_PLAN } from "@/lib/config"
import { useAppStore } from "@/lib/store/app-store"

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <SuccessInner />
    </Suspense>
  )
}

function SuccessInner() {
  const searchParams = useSearchParams()
  const { upgradeToPro, plan, consumePendingCheckout } = useAppStore()
  const [status, setStatus] = useState<"pending" | "ok" | "error">("pending")
  const reference = searchParams.get("reference") || searchParams.get("trxref") || ""
  const demoCheckout = searchParams.get("demo") === "1"

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!reference) {
        setStatus("error")
        return
      }

      if (demoCheckout) {
        if (consumePendingCheckout(reference)) {
          upgradeToPro(reference)
          if (!cancelled) setStatus("ok")
        } else {
          if (!cancelled) setStatus("error")
        }
        return
      }

      const response = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
      const payload = (await response.json()) as { status?: string }
      if (cancelled) return
      if (payload.status === "success") {
        upgradeToPro(reference)
        setStatus("ok")
      } else {
        setStatus("error")
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [reference, demoCheckout, upgradeToPro, consumePendingCheckout])

  if (status === "error") {
    return (
      <FlowFrame
        stub
        title="Payment not confirmed"
        description="Pro unlocks only after Paystack verify succeeds, or after completing demo checkout."
      >
        <Button asChild>
          <Link href="/payment/failed">View failure</Link>
        </Button>
      </FlowFrame>
    )
  }

  return (
    <FlowFrame
      stub
      title="Paid Pro unlocked"
      description={`Paystack charged ${formatNaira(PRO_PLAN.priceNaira)}/mo.`}
    >
      <div className="rounded-[7px] border border-border bg-card p-4 text-[13px] text-muted-foreground">
        <p className="text-foreground">{plan === "pro" || status === "ok" ? "Pro is active." : "Confirming…"}</p>
        <p className="mt-2">Invoice written to Billing. Provider: Paystack.</p>
      </div>
      <div className="mt-4 flex gap-2">
        <Button asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/billing">Billing</Link>
        </Button>
      </div>
    </FlowFrame>
  )
}
