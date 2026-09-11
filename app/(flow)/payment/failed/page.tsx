"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { PaystackMark } from "@/components/brand/paystack-mark"
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
    <FlowFrame variant="center" stub headerRight={<PaystackMark />}>
      <Surface className="p-6">
        <h1 className="text-lg font-semibold text-foreground">Payment failed</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Paystack did not complete {formatNaira(PRO_PLAN.priceNaira)}.
        </p>
        <Surface className="mt-4 px-3 py-3 text-[13px] text-muted-foreground">
          <p className="text-foreground">Charge declined or cancelled.</p>
          <p className="mt-2">
            Retry the Pro checkout, or keep the Free plan. Existing deploy credit is unchanged.
          </p>
        </Surface>
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
      </Surface>
    </FlowFrame>
  )
}
