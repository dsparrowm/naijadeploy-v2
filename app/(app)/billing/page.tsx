"use client"

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
import { DemoChip } from "@/components/brand/demo-chip"
import { FREE_PLAN, PRO_PLAN, SCALE_PLAN } from "@/lib/config"
import { formatDate, formatKoboAsNaira, formatNaira } from "@/lib/format"
import { useAppStore } from "@/lib/store/app-store"

export default function BillingPage() {
  const { plan, invoices } = useAppStore()

  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Billing</h1>
        <DemoChip />
      </div>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Paystack · Pay in Naira · demo checkout unless live keys are set
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-[7px] border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Current plan</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {plan === "pro" ? "Pro" : "Free"}
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {plan === "pro"
              ? `${formatNaira(PRO_PLAN.priceNaira)}/mo`
              : `${formatNaira(FREE_PLAN.priceNaira)} · ${FREE_PLAN.projects} project · ${FREE_PLAN.storage} · ${FREE_PLAN.ram}`}
          </p>
          {plan === "free" ? (
            <Button asChild className="mt-4">
              <Link href="/upgrade">Upgrade to Pro · {formatNaira(PRO_PLAN.priceNaira)}/mo</Link>
            </Button>
          ) : (
            <p className="mt-4 text-[13px] text-muted-foreground">Paid via Paystack</p>
          )}
        </div>
        <div className="rounded-[7px] border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Scale</p>
          <p className="mt-1 text-lg font-semibold text-foreground">{formatNaira(SCALE_PLAN.priceNaira)}/mo</p>
          <p className="mt-1 text-[13px] text-muted-foreground">Stub only. Not available in v1.</p>
        </div>
      </div>

      <h2 className="mt-8 text-[13px] font-medium text-foreground">Invoices</h2>
      <div className="mt-2 overflow-hidden rounded-[7px] border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-9 px-3 text-[13px] text-muted-foreground">Date</TableHead>
              <TableHead className="h-9 px-3 text-[13px] text-muted-foreground">Invoice</TableHead>
              <TableHead className="h-9 px-3 text-[13px] text-muted-foreground">Description</TableHead>
              <TableHead className="h-9 px-3 text-[13px] text-muted-foreground">Amount</TableHead>
              <TableHead className="h-9 px-3 text-[13px] text-muted-foreground">Status</TableHead>
              <TableHead className="h-9 px-3 text-[13px] text-muted-foreground">Provider</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="px-3 py-10 text-center text-[13px] text-muted-foreground">
                  No invoices. Free spend stays ₦0 until you upgrade with Paystack.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="px-3 py-2.5 text-[13px] text-muted-foreground">
                    {formatDate(invoice.issuedAt)}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 font-mono text-[13px] text-foreground">
                    {invoice.number}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-[13px] text-muted-foreground">
                    {invoice.description}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-[13px] text-foreground">
                    {formatKoboAsNaira(invoice.amountKobo)}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-[13px] capitalize text-muted-foreground">
                    {invoice.status}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-[13px] text-muted-foreground">
                    Paystack
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
