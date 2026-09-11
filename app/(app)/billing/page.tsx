"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PaystackMark } from "@/components/brand/paystack-mark"
import { StatusBadge } from "@/components/brand/status-badge"
import { SearchField, Surface } from "@/components/chrome/surface"
import { FREE_PLAN, PRO_PLAN, SCALE_PLAN } from "@/lib/config"
import { formatDate, formatKoboAsNaira, formatNaira } from "@/lib/format"
import { useAppStore } from "@/lib/store/app-store"

export default function BillingPage() {
  const { plan, invoices } = useAppStore()
  const [query, setQuery] = useState("")
  const filtered = invoices.filter((invoice) =>
    `${invoice.number} ${invoice.description}`.toLowerCase().includes(query.trim().toLowerCase()),
  )
  const nextInvoice = useMemo(() => {
    const paid = invoices.find((invoice) => invoice.status === "paid")
    if (!paid || plan !== "pro") return null
    const due = new Date(paid.issuedAt)
    due.setMonth(due.getMonth() + 1)
    return due.toISOString()
  }, [invoices, plan])

  return (
    <div>
      <p className="text-[12px] text-muted-foreground">Home / Billing</p>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-foreground">Billing & Subscriptions</h1>
        <Button asChild variant="outline" size="sm">
          <a href="#invoices">Transaction history</a>
        </Button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <Surface className="p-4">
          <p className="text-[12px] text-muted-foreground">Current plan</p>
          <div className="mt-1 flex items-baseline justify-between gap-3">
            <p className="text-[18px] font-semibold text-foreground">{plan === "pro" ? "Pro" : "Free"}</p>
            <p className="text-[13px] text-muted-foreground">
              {plan === "pro" ? `${formatNaira(PRO_PLAN.priceNaira)}/mo` : formatNaira(FREE_PLAN.priceNaira)}
            </p>
          </div>
          {plan === "free" ? (
            <Button asChild className="mt-4">
              <Link href="/upgrade">Upgrade to Pro · {formatNaira(PRO_PLAN.priceNaira)}/mo</Link>
            </Button>
          ) : (
            <Button type="button" variant="outline" className="mt-4" disabled title="Scale is a stub for later">
              Change plan
            </Button>
          )}
          <p className="mt-3 text-[12px] text-muted-foreground">
            Scale {formatNaira(SCALE_PLAN.priceNaira)} — stub / later
          </p>
        </Surface>
        <Surface className="p-4">
          <p className="text-[12px] text-muted-foreground">Next invoice</p>
          <p className="mt-1 text-[18px] font-semibold text-foreground">
            {plan === "pro" ? formatNaira(PRO_PLAN.priceNaira) : formatNaira(0)}
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            {plan === "pro" && nextInvoice ? `Due ${formatDate(nextInvoice)}` : "No charge on Free"}
          </p>
          <Link href="#invoices" className="mt-3 inline-block text-[13px] text-primary hover:underline">
            View details →
          </Link>
        </Surface>
        <Surface className="p-4">
          <div className="flex items-start justify-between">
            <p className="text-[12px] text-muted-foreground">Resource usage</p>
            <p className="text-[12px] text-muted-foreground">{plan === "pro" ? "Resets in 12d" : "Free limits"}</p>
          </div>
          <UsageBar label="Bandwidth" value={plan === "pro" ? 45 : 0} max={plan === "pro" ? 100 : 10} unit="GB" />
          <UsageBar label="Build minutes" value={plan === "pro" ? 320 : 0} max={plan === "pro" ? 500 : 50} />
        </Surface>
      </div>

      <Surface className="mt-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[13px] font-medium text-foreground">Payment method</p>
            {plan === "pro" ? (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-foreground">
                <span className="rounded-[4px] border border-border px-1.5 py-px text-[11px] font-medium">VISA</span>
                ending in 4242
                <span className="rounded-[4px] bg-primary/15 px-1.5 py-px text-[11px] font-medium text-primary">
                  Default
                </span>
                <span className="text-muted-foreground">Expires 12/2027</span>
              </div>
            ) : (
              <p className="mt-2 text-[13px] text-muted-foreground">None on Free. Paystack when you upgrade.</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <PaystackMark />
            <Button asChild>
              <Link href="/upgrade">{plan === "pro" ? "Pay with Paystack" : "Pay with Paystack"}</Link>
            </Button>
          </div>
        </div>
      </Surface>

      <Surface id="invoices" className="mt-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
          <p className="text-[13px] font-medium text-foreground">Invoice history</p>
          <SearchField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search invoices…"
            aria-label="Search invoices"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Date</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="py-10 text-center text-[13px] text-muted-foreground">
                  No invoices. Free spend stays ₦0 until you upgrade with Paystack.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="text-muted-foreground">{formatDate(invoice.issuedAt)}</TableCell>
                  <TableCell className="font-mono text-foreground">{invoice.number}</TableCell>
                  <TableCell className="text-foreground">{formatKoboAsNaira(invoice.amountKobo)}</TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">Paystack</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {filtered.length > 0 ? (
          <p className="border-t border-border px-3 py-2 text-[12px] text-muted-foreground">
            Showing {filtered.length} of {invoices.length} invoices
          </p>
        ) : null}
      </Surface>
    </div>
  )
}

function UsageBar({
  label,
  value,
  max,
  unit,
}: {
  label: string
  value: number
  max: number
  unit?: string
}) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-[12px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground">
          {value} / {max}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
