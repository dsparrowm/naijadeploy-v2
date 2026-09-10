import type { DeployStageId } from "@/lib/deploy/types"

export type PlanId = "free" | "pro"

export type User = {
  email: string
  name: string
  twoFactorEnabled: boolean
}

export type ProjectStatus =
  | "queued"
  | "building"
  | "deploying"
  | "health"
  | "live"
  | "failed"

export type Project = {
  id: string
  name: string
  slug: string
  repoFullName: string
  branch: string
  region: "lagos-edge"
  url: string
  status: ProjectStatus
  stage: DeployStageId | null
  createdAt: string
  updatedAt: string
  retryUsed: boolean
  failReason?: string
}

export type InvoiceStatus = "paid" | "open" | "failed"

export type Invoice = {
  id: string
  number: string
  issuedAt: string
  description: string
  amountKobo: number
  status: InvoiceStatus
  provider: "paystack"
}

export type DraftDeploy = {
  repoFullName: string
  projectName: string
  slug: string
  branch: string
  region: "lagos-edge"
  simulateFailure?: boolean
}

export type AppState = {
  user: User | null
  plan: PlanId
  projects: Project[]
  invoices: Invoice[]
  draft: DraftDeploy | null
  resetEmail: string | null
}
