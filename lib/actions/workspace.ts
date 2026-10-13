"use server"

import { getServerSession } from "@/lib/auth-session"
import {
  authorizeDemoCheckout,
  confirmCheckout,
  listInvoices,
  readPlan,
  recordFailedPayment,
} from "@/lib/server/billing"
import { saveDraft } from "@/lib/server/drafts"
import { createProjectForUser, retryProjectForUser, updateProjectForUser, type ProjectPatch } from "@/lib/server/projects"
import type { DraftDeploy, Invoice, PlanId } from "@/lib/store/types"

async function requireUserId() {
  const session = await getServerSession()
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  return session.user.id
}

export async function saveDraftAction(input: DraftDeploy) {
  const userId = await requireUserId()
  return saveDraft(userId, input)
}

export async function createProjectAction(input: DraftDeploy) {
  const userId = await requireUserId()
  return createProjectForUser(userId, input)
}

export async function updateProjectAction(id: string, patch: ProjectPatch) {
  const userId = await requireUserId()
  return updateProjectForUser(userId, id, patch)
}

export async function retryProjectAction(id: string) {
  const userId = await requireUserId()
  return retryProjectForUser(userId, id)
}

export async function authorizeDemoCheckoutAction(reference: string) {
  const userId = await requireUserId()
  return authorizeDemoCheckout(userId, reference)
}

export async function confirmCheckoutAction(reference: string, source: "demo" | "paystack") {
  const userId = await requireUserId()
  const status = await confirmCheckout(userId, reference, source)
  const plan = await readPlan(userId)
  const invoices = await listInvoices(userId)
  return { status, plan, invoices }
}

export async function recordFailedPaymentAction(reference: string): Promise<{ plan: PlanId; invoices: Invoice[] }> {
  const userId = await requireUserId()
  await recordFailedPayment(userId, reference)
  return { plan: await readPlan(userId), invoices: await listInvoices(userId) }
}

export async function readPlanAction(): Promise<PlanId> {
  const userId = await requireUserId()
  return readPlan(userId)
}
