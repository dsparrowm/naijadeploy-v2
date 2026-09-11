"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PaystackMark } from "@/components/brand/paystack-mark"
import { OutcomeIcon } from "@/components/brand/outcome-icon"
import { FlowFrame } from "@/components/flow/flow-frame"
import { Surface } from "@/components/chrome/surface"
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
    <FlowFrame variant="center" headerRight={<PaystackMark />}>
      <Surface className="p-6">
        <OutcomeIcon kind="fail" />
        <h1 className="mt-4 text-lg font-semibold text-foreground">Payment failed</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Paystack could not complete {formatNaira(PRO_PLAN.priceNaira)}. Your Free deploy is unchanged.
        </p>
        <Surface className="mt-4 px-3 py-3 text-[13px] text-muted-foreground">
          Charge declined or cancelled. Retry Pro checkout, or keep the Free plan.
        </Surface>
        <div className="mt-4 flex flex-col gap-2">
          <Button type="button" size="lg" onClick={retry}>
            Retry {formatNaira(PRO_PLAN.priceNaira)}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={stayFree}>
            Keep free deploy
          </Button>
        </div>
      </Surface>
    </FlowFrame>
  )
}
