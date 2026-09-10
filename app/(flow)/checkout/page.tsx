"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FlowFrame } from "@/components/flow/flow-frame"
import { Button } from "@/components/ui/button"
import { formatKoboAsNaira } from "@/lib/format"
import { PRO_PLAN } from "@/lib/config"

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
  const reference = searchParams.get("reference") || `nd_pro_${Date.now()}`
  const email = searchParams.get("email") || ""
  const amount = Number(searchParams.get("amount") || PRO_PLAN.amountKobo)
  const [pending, setPending] = useState(false)

  function succeed() {
    setPending(true)
    router.push(`/payment/success?reference=${encodeURIComponent(reference)}`)
  }

  function fail() {
    setPending(true)
    router.push(`/payment/failed?reference=${encodeURIComponent(`${reference}_fail`)}`)
  }

  return (
    <FlowFrame
      title="Paystack checkout"
      description="Demo mode — no PAYSTACK_SECRET_KEY. Live keys redirect to Paystack."
      className="max-w-[400px]"
    >
      <div className="rounded-[7px] border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground">Amount</p>
        <p className="mt-1 text-lg font-semibold text-foreground">
          {formatKoboAsNaira(amount)}
          <span className="text-[13px] font-normal text-muted-foreground">/mo</span>
        </p>
        <p className="mt-3 text-[13px] text-muted-foreground">Pro · {email || "account email"}</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{reference}</p>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Button type="button" onClick={succeed} disabled={pending}>
          Pay {formatKoboAsNaira(amount)}
        </Button>
        <Button type="button" variant="outline" onClick={fail} disabled={pending}>
          Simulate decline
        </Button>
      </div>
    </FlowFrame>
  )
}
