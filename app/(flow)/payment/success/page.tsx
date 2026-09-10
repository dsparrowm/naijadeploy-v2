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
  const { upgradeToPro, plan } = useAppStore()
  const [status, setStatus] = useState<"pending" | "ok" | "error">("pending")
  const reference = searchParams.get("reference") || searchParams.get("trxref") || ""

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!reference) {
        upgradeToPro("demo")
        setStatus("ok")
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
  }, [reference, upgradeToPro])

  if (status === "error") {
    return (
      <FlowFrame title="Payment not confirmed" description="Paystack did not return a successful charge.">
        <Button asChild>
          <Link href="/payment/failed">View failure</Link>
        </Button>
      </FlowFrame>
    )
  }

  return (
    <FlowFrame
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
