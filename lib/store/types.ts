import type { DeployStageId } from "@/lib/deploy/types"

export type PlanId = "free" | "pro"

export type User = {
  id: string
  email: string
  name: string
  twoFactorEnabled: boolean
  image?: string | null
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
  framework?: string
  commitSha?: string
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
  framework?: string
  buildCommand?: string
  outputDirectory?: string
  branches?: string[]
}

export type RepoSummary = {
  fullName: string
  private: boolean
  updatedAt: string
  framework: string
  defaultBranch: string
}

export type AppState = {
  user: User | null
  plan: PlanId
  projects: Project[]
  invoices: Invoice[]
  draft: DraftDeploy | null
}

export const emptyAppState: AppState = {
  user: null,
  plan: "free",
  projects: [],
  invoices: [],
  draft: null,
}
