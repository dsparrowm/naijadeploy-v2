import "server-only"
import { randomUUID } from "node:crypto"
import { and, count, eq, inArray } from "drizzle-orm"
import { PRO_PLAN } from "@/lib/config"
import { getDb } from "@/lib/db"
import { checkoutIntent, invoice, subscription } from "@/lib/db/schema"
import { getPaymentProvider } from "@/lib/payments"
import type { Invoice, InvoiceStatus, PlanId } from "@/lib/store/types"

function invoiceStatus(value: string): InvoiceStatus {
  if (value === "paid" || value === "open" || value === "failed") return value
  return "failed"
}

function addMonth(from: Date) {
  const next = new Date(from)
  next.setMonth(next.getMonth() + 1)
  return next
}

export async function readPlan(userId: string): Promise<PlanId> {
  const rows = await getDb()
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1)
  const row = rows[0]
  if (row?.plan === "pro" && row.status === "active") return "pro"
  return "free"
}

export async function listInvoices(userId: string): Promise<Invoice[]> {
  const rows = await getDb()
    .select()
    .from(invoice)
    .where(eq(invoice.userId, userId))
    .orderBy(invoice.issuedAt)
  return rows
    .map((row) => ({
      id: row.id,
      number: row.number,
      issuedAt: row.issuedAt.toISOString(),
      description: row.description,
      amountKobo: row.amountKobo,
      status: invoiceStatus(row.status),
      provider: "paystack" as const,
    }))
    .reverse()
}

export async function recordCheckoutIntent(input: {
  userId: string
  reference: string
  email: string
  amountKobo: number
  demo: boolean
}) {
  await getDb()
    .insert(checkoutIntent)
    .values({
      id: randomUUID(),
      userId: input.userId,
      reference: input.reference,
      email: input.email,
      amountKobo: input.amountKobo,
      plan: "pro",
      demo: input.demo,
      status: "pending",
    })
    .onConflictDoNothing({ target: checkoutIntent.reference })
}

export async function authorizeDemoCheckout(userId: string, reference: string) {
  const db = getDb()
  const rows = await db
    .select()
    .from(checkoutIntent)
    .where(and(eq(checkoutIntent.userId, userId), eq(checkoutIntent.reference, reference)))
    .limit(1)
  const intent = rows[0]
  if (!intent || !intent.demo) return false
  if (intent.status === "authorized" || intent.status === "consumed") return true
  if (intent.status !== "pending") return false
  await db
    .update(checkoutIntent)
    .set({ status: "authorized" })
    .where(eq(checkoutIntent.id, intent.id))
  return true
}

async function ensurePro(userId: string, reference: string) {
  const db = getDb()
  const now = new Date()
  const updated = await db
    .update(subscription)
    .set({
      plan: "pro",
      status: "active",
      provider: "paystack",
      providerReference: reference,
      currentPeriodEnd: addMonth(now),
      updatedAt: now,
    })
    .where(eq(subscription.userId, userId))
    .returning({ id: subscription.id })
  if (updated.length > 0) return
  await db.insert(subscription).values({
    id: randomUUID(),
    userId,
    plan: "pro",
    status: "active",
    provider: "paystack",
    providerReference: reference,
    currentPeriodEnd: addMonth(now),
    createdAt: now,
    updatedAt: now,
  })
}

async function insertInvoice(input: {
  userId: string
  reference: string
  status: "paid" | "failed"
  description: string
}) {
  const db = getDb()
  const existing = await db
    .select({ value: count() })
    .from(invoice)
    .where(eq(invoice.userId, input.userId))
  const sequence = Number(existing[0]?.value ?? 0) + 1
  const year = new Date().getFullYear()
  await db
    .insert(invoice)
    .values({
      id: randomUUID(),
      userId: input.userId,
      number: `ND-${year}-${String(sequence).padStart(4, "0")}`,
      description: input.description,
      amountKobo: PRO_PLAN.amountKobo,
      status: input.status,
      provider: "paystack",
      reference: input.reference,
      issuedAt: new Date(),
    })
    .onConflictDoNothing({ target: [invoice.reference, invoice.status] })
}

/**
 * The only plan upgrade. Demo checkouts must have been authorized by the
 * signed-in user. Live checkouts must pass Paystack verify (amount, NGN, plan).
 */
export async function confirmCheckout(userId: string, reference: string, source: "demo" | "paystack") {
  if (!reference) return "error" as const
  const db = getDb()
  const rows = await db
    .select()
    .from(checkoutIntent)
    .where(and(eq(checkoutIntent.userId, userId), eq(checkoutIntent.reference, reference)))
    .limit(1)
  const intent = rows[0]
  if (!intent || intent.plan !== "pro") return "error" as const
  if (intent.status === "consumed") return "ok" as const

  if (source === "demo") {
    if (!intent.demo || intent.status !== "authorized") return "error" as const
  } else {
    if (intent.demo) return "error" as const
    const result = await getPaymentProvider("paystack").verify(reference)
    if (result.status !== "success") return "error" as const
  }

  await ensurePro(userId, reference)
  await insertInvoice({
    userId,
    reference,
    status: "paid",
    description: `Pro · monthly · ${reference}`,
  })
  await db.update(checkoutIntent).set({ status: "consumed" }).where(eq(checkoutIntent.id, intent.id))
  return "ok" as const
}

export async function recordFailedPayment(userId: string, reference: string) {
  if (!reference.startsWith("nd_pro_")) return
  await insertInvoice({
    userId,
    reference,
    status: "failed",
    description: `Pro checkout · ${reference}`,
  })
  await getDb()
    .update(checkoutIntent)
    .set({ status: "failed" })
    .where(
      and(
        eq(checkoutIntent.userId, userId),
        eq(checkoutIntent.reference, reference.replace(/_fail$/, "")),
        inArray(checkoutIntent.status, ["pending", "authorized"]),
      ),
    )
}
