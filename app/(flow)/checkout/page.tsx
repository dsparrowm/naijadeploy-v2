"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { DemoChip } from "@/components/brand/demo-chip"
import { PaystackMark } from "@/components/brand/paystack-mark"
import { FlowFrame } from "@/components/flow/flow-frame"
import { Surface } from "@/components/chrome/surface"
import { Button } from "@/components/ui/button"
import { formatKoboAsNaira } from "@/lib/format"
import { PRO_PLAN } from "@/lib/config"
import { useAppStore } from "@/lib/store/app-store"

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutInner />
    </Suspense>
  )
}

function CheckoutInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setPendingCheckoutRef } = useAppStore()
  const reference = searchParams.get("reference") || `nd_pro_${Date.now()}`
  const email = searchParams.get("email") || ""
  const amount = Number(searchParams.get("amount") || PRO_PLAN.amountKobo)
  const [pending, setPending] = useState(false)

  function succeed() {
    setPending(true)
    setPendingCheckoutRef(reference)
    router.push(`/payment/success?reference=${encodeURIComponent(reference)}&demo=1`)
  }

  function fail() {
    setPending(true)
    router.push(`/payment/failed?reference=${encodeURIComponent(`${reference}_fail`)}`)
  }

  return (
    <FlowFrame variant="center" stub headerRight={<PaystackMark />}>
      <Surface className="p-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-foreground">Paystack checkout</h1>
          <DemoChip />
        </div>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Demo mode — no PAYSTACK_SECRET_KEY. Live keys redirect to Paystack.
        </p>
        <div className="mt-4 rounded-[7px] border border-border bg-background px-3 py-3">
          <p className="text-[12px] text-muted-foreground">Amount</p>
          <p className="mt-1 text-[18px] font-semibold text-foreground">
            {formatKoboAsNaira(amount)}
            <span className="text-[13px] font-normal text-muted-foreground">/mo</span>
          </p>
          <p className="mt-2 text-[13px] text-muted-foreground">Pro · {email || "account email"}</p>
          <p className="mt-1 font-mono text-[12px] text-muted-foreground">{reference}</p>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Button type="button" size="lg" onClick={succeed} disabled={pending}>
            Pay {formatKoboAsNaira(amount)}
          </Button>
          <Button type="button" variant="outline" onClick={fail} disabled={pending}>
            Simulate decline
          </Button>
        </div>
        <div className="mt-4 text-center">
          <PaystackMark />
          <div>
            <Link href="/dashboard" className="text-[12px] text-muted-foreground hover:text-foreground">
              Keep free deploy instead
            </Link>
          </div>
        </div>
      </Surface>
    </FlowFrame>
  )
}
