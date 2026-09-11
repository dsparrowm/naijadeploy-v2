"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { DemoChip } from "@/components/brand/demo-chip"
import { PaystackMark } from "@/components/brand/paystack-mark"
import { FlowFrame } from "@/components/flow/flow-frame"
import { Surface } from "@/components/chrome/surface"
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

      try {
        const response = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
        if (!response.ok) {
          if (!cancelled) setStatus("error")
          return
        }
        const payload = (await response.json()) as { status?: string }
        if (cancelled) return
        if (payload.status === "success") {
          upgradeToPro(reference)
          setStatus("ok")
        } else {
          setStatus("error")
        }
      } catch {
        if (!cancelled) setStatus("error")
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [reference, demoCheckout, upgradeToPro, consumePendingCheckout])

  if (status === "error") {
    return (
      <FlowFrame variant="center" stub headerRight={<PaystackMark />}>
        <Surface className="p-6">
          <h1 className="text-lg font-semibold text-foreground">Payment not confirmed</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Pro unlocks only after Paystack verify succeeds, or after completing demo checkout.
          </p>
          <Button asChild className="mt-5">
            <Link href="/payment/failed">View failure</Link>
          </Button>
        </Surface>
      </FlowFrame>
    )
  }

  return (
    <FlowFrame variant="center" stub headerRight={<PaystackMark />}>
      <Surface className="p-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-foreground">Paid Pro unlocked</h1>
          <DemoChip />
        </div>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Paystack charged {formatNaira(PRO_PLAN.priceNaira)}/mo.
        </p>
        <Surface className="mt-4 px-3 py-3 text-[13px] text-muted-foreground">
          <p className="text-foreground">{plan === "pro" || status === "ok" ? "Pro is active." : "Confirming…"}</p>
          <p className="mt-2">Invoice written to Billing. Provider: Paystack.</p>
        </Surface>
        <div className="mt-4 flex gap-2">
          <Button asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/billing">Billing</Link>
          </Button>
        </div>
      </Surface>
    </FlowFrame>
  )
}
