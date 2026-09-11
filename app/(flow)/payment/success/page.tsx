"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { DemoChip } from "@/components/brand/demo-chip"
import { PaystackMark } from "@/components/brand/paystack-mark"
import { StatusBadge } from "@/components/brand/status-badge"
import { FlowFrame } from "@/components/flow/flow-frame"
import { Surface } from "@/components/chrome/surface"
import { Button } from "@/components/ui/button"
import { formatDate, formatNaira } from "@/lib/format"
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
  const { upgradeToPro, plan, consumePendingCheckout, projects, invoices } = useAppStore()
  const [status, setStatus] = useState<"pending" | "ok" | "error">("pending")
  const [copied, setCopied] = useState(false)
  const reference = searchParams.get("reference") || searchParams.get("trxref") || ""
  const demoCheckout = searchParams.get("demo") === "1"
  const liveProject = projects.find((project) => project.status === "live") ?? projects[0]
  const nextInvoice = useMemo(() => {
    const paid = invoices.find((invoice) => invoice.status === "paid")
    const due = new Date(paid?.issuedAt || Date.now())
    due.setMonth(due.getMonth() + 1)
    return due.toISOString()
  }, [invoices])

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

  async function copyUrl() {
    if (!liveProject) return
    try {
      await navigator.clipboard.writeText(liveProject.url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  if (status === "error") {
    return (
      <FlowFrame variant="center" headerRight={<PaystackMark />}>
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

  if (status === "pending" && plan !== "pro") {
    return (
      <FlowFrame variant="center" headerRight={<PaystackMark />}>
        <Surface className="p-6">
          <p className="text-[13px] text-muted-foreground">Confirming Paystack…</p>
        </Surface>
      </FlowFrame>
    )
  }

  return (
    <FlowFrame
      variant="center"
      headerRight={
        <>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[12px] font-medium text-success">
            <span className="size-1.5 rounded-full bg-success" />
            LIVE
          </span>
          <PaystackMark />
        </>
      }
    >
      <Surface className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status="live" />
          <span className="rounded-[4px] border border-primary/40 bg-primary/10 px-1.5 py-px text-[11px] font-medium text-primary">
            Pro
          </span>
        </div>
        <h1 className="mt-3 text-lg font-semibold text-foreground">You’re on Pro</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Paystack charged {formatNaira(PRO_PLAN.priceNaira)}/mo. Custom domains and extra build minutes are unlocked.
        </p>
        {liveProject ? (
          <div className="mt-4 flex items-center gap-2 rounded-[7px] border border-border bg-background px-3 py-2">
            <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-foreground" title={liveProject.url}>
              {liveProject.url}
            </span>
            <DemoChip />
            <Button type="button" variant="outline" size="sm" onClick={copyUrl}>
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        ) : null}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Surface className="px-3 py-2.5">
            <p className="text-[12px] text-muted-foreground">Plan</p>
            <p className="mt-0.5 text-[13px] font-medium text-foreground">
              Pro · {formatNaira(PRO_PLAN.priceNaira)}/mo
            </p>
          </Surface>
          <Surface className="px-3 py-2.5">
            <p className="text-[12px] text-muted-foreground">Next invoice</p>
            <p className="mt-0.5 text-[13px] font-medium text-foreground">{formatDate(nextInvoice)}</p>
          </Surface>
          <Surface className="px-3 py-2.5">
            <p className="text-[12px] text-muted-foreground">Rail</p>
            <p className="mt-0.5 text-[13px] font-medium text-foreground">Paystack</p>
          </Surface>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Button asChild size="lg">
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/billing">View billing</Link>
          </Button>
        </div>
      </Surface>
    </FlowFrame>
  )
}
