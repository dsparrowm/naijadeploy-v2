"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FlowFrame } from "@/components/flow/flow-frame"
import { Button } from "@/components/ui/button"
import { formatNaira } from "@/lib/format"
import { PRO_PLAN } from "@/lib/config"
import { useAppStore } from "@/lib/store/app-store"

export default function PaymentFailedPage() {
  return (
    <Suspense>
      <FailedInner />
    </Suspense>
  )
}

function FailedInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { recordFailedPayment, keepFree } = useAppStore()
  const reference = searchParams.get("reference") || "paystack_fail"

  function retry() {
    recordFailedPayment(reference)
    router.push("/upgrade")
  }

  function stayFree() {
    recordFailedPayment(reference)
    keepFree()
    router.push("/dashboard")
  }

  return (
    <FlowFrame
      stub
      title="Payment failed"
      description={`Paystack did not complete ${formatNaira(PRO_PLAN.priceNaira)}.`}
    >
      <div className="rounded-[7px] border border-border bg-card p-4 text-[13px] text-muted-foreground">
        <p className="text-foreground">Charge declined or cancelled.</p>
        <p className="mt-2">Retry the Pro checkout, or keep the Free plan. Existing deploy credit is unchanged.</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={retry}>
          Retry {formatNaira(PRO_PLAN.priceNaira)}
        </Button>
        <Button type="button" variant="outline" onClick={stayFree}>
          Keep Free
        </Button>
        <Button asChild variant="ghost">
          <Link href="/billing">Billing</Link>
        </Button>
      </div>
    </FlowFrame>
  )
}
