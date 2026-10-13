import "server-only"
import { randomBytes, randomUUID } from "node:crypto"
import { and, desc, eq } from "drizzle-orm"
import { FREE_PLAN, projectUrl, toSlug } from "@/lib/config"
import { stubDeployPipeline } from "@/lib/deploy/pipeline"
import type { DeployStageId } from "@/lib/deploy/types"
import { getDb } from "@/lib/db"
import { deployment, project } from "@/lib/db/schema"
import { catalogRepo } from "@/lib/server/catalog"
import { readPlan } from "@/lib/server/billing"
import type { DraftDeploy, Project, ProjectStatus } from "@/lib/store/types"

const STATUSES: ProjectStatus[] = ["queued", "building", "deploying", "health", "live", "failed"]
const STAGES: DeployStageId[] = ["build", "deploy", "health"]

const RANK: Record<ProjectStatus, number> = {
  queued: 0,
  building: 1,
  deploying: 2,
  health: 3,
  live: 4,
  failed: 5,
}

export type ProjectPatch = {
  status?: ProjectStatus
  stage?: DeployStageId | null
  failReason?: string | null
}

function asStatus(value: string): ProjectStatus {
  return STATUSES.includes(value as ProjectStatus) ? (value as ProjectStatus) : "queued"
}

function asStage(value: string | null): DeployStageId | null {
  if (!value) return null
  return STAGES.includes(value as DeployStageId) ? (value as DeployStageId) : null
}

function toProject(row: typeof project.$inferSelect): Project {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    repoFullName: row.repoFullName,
    branch: row.branch,
    region: "lagos-edge",
    url: row.url,
    status: asStatus(row.status),
    stage: asStage(row.stage),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    retryUsed: row.retryUsed,
    failReason: row.failReason ?? undefined,
    framework: row.framework ?? undefined,
    commitSha: row.commitSha ?? undefined,
  }
}

export async function listProjects(userId: string): Promise<Project[]> {
  const rows = await getDb()
    .select()
    .from(project)
    .where(eq(project.userId, userId))
    .orderBy(desc(project.createdAt))
  return rows.map(toProject)
}

async function uniqueSlug(userId: string, base: string) {
  const db = getDb()
  let slug = toSlug(base)
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const candidate = attempt === 0 ? slug : `${slug}-${attempt + 1}`.slice(0, 48)
    const existing = await db
      .select({ id: project.id })
      .from(project)
      .where(and(eq(project.userId, userId), eq(project.slug, candidate)))
      .limit(1)
    if (existing.length === 0) return candidate
  }
  return `${slug}-${randomBytes(2).toString("hex")}`.slice(0, 48)
}

export async function createProjectForUser(userId: string, input: DraftDeploy): Promise<Project> {
  const repo = catalogRepo(input.repoFullName)
  if (!repo) {
    throw new Error("Unknown repository")
  }
  const branch = repo.branches.includes(input.branch) ? input.branch : repo.defaultBranch
  const plan = await readPlan(userId)
  const existing = await listProjects(userId)
  if (plan !== "pro" && existing.length >= FREE_PLAN.projects) {
    throw new Error("Free includes 1 project. Upgrade to Pro to deploy another.")
  }

  const now = new Date()
  const slug = await uniqueSlug(userId, input.slug || input.projectName)
  const id = randomUUID()
  const deploymentId = randomUUID()
  const commitSha = randomBytes(3).toString("hex")
  const name = input.projectName.trim() || repo.fullName.split("/")[1] || slug

  const db = getDb()
  await db.insert(project).values({
    id,
    userId,
    name,
    slug,
    repoFullName: repo.fullName,
    branch,
    region: "lagos-edge",
    url: projectUrl(slug),
    status: "queued",
    stage: "build",
    framework: repo.framework,
    commitSha,
    retryUsed: false,
    rootDirectory: "./",
    buildCommand: input.buildCommand || repo.buildCommand,
    outputDirectory: input.outputDirectory || repo.outputDirectory,
    createdAt: now,
    updatedAt: now,
  })
  await db.insert(deployment).values({
    id: deploymentId,
    projectId: id,
    status: "queued",
    stage: "build",
    commitSha,
    createdAt: now,
    updatedAt: now,
  })
  await stubDeployPipeline.start({ projectId: id, simulateFailure: input.simulateFailure })

  const created = await db.select().from(project).where(eq(project.id, id)).limit(1)
  return toProject(created[0])
}

function advanceStatus(current: ProjectStatus, incoming: ProjectStatus) {
  if (current === "live" || current === "failed") return current
  if (incoming === "failed") return "failed"
  if (RANK[incoming] < RANK[current]) return current
  return incoming
}

export async function updateProjectForUser(userId: string, id: string, patch: ProjectPatch) {
  const db = getDb()
  const rows = await db
    .select()
    .from(project)
    .where(and(eq(project.id, id), eq(project.userId, userId)))
    .limit(1)
  const current = rows[0]
  if (!current) return null

  const status = patch.status ? advanceStatus(asStatus(current.status), patch.status) : asStatus(current.status)
  const stage = status === asStatus(current.status) && patch.status && patch.status !== status
    ? asStage(current.stage)
    : patch.stage === undefined
      ? asStage(current.stage)
      : patch.stage
  const failReason = status === "live" ? null : patch.failReason === undefined ? current.failReason : patch.failReason
  const now = new Date()

  await db
    .update(project)
    .set({
      status,
      stage,
      failReason,
      updatedAt: now,
    })
    .where(eq(project.id, id))

  const latest = await db
    .select()
    .from(deployment)
    .where(eq(deployment.projectId, id))
    .orderBy(desc(deployment.createdAt))
    .limit(1)
  if (latest[0]) {
    await db
      .update(deployment)
      .set({ status, stage, failReason, updatedAt: now })
      .where(eq(deployment.id, latest[0].id))
  }

  const updated = await db.select().from(project).where(eq(project.id, id)).limit(1)
  return toProject(updated[0])
}

export async function retryProjectForUser(userId: string, id: string) {
  const db = getDb()
  const rows = await db
    .select()
    .from(project)
    .where(and(eq(project.id, id), eq(project.userId, userId)))
    .limit(1)
  const current = rows[0]
  if (!current || current.retryUsed) return null

  const now = new Date()
  await db
    .update(project)
    .set({
      status: "queued",
      stage: "build",
      retryUsed: true,
      failReason: null,
      updatedAt: now,
    })
    .where(eq(project.id, id))
  await db.insert(deployment).values({
    id: randomUUID(),
    projectId: id,
    status: "queued",
    stage: "build",
    commitSha: current.commitSha,
    createdAt: now,
    updatedAt: now,
  })

  const updated = await db.select().from(project).where(eq(project.id, id)).limit(1)
  return toProject(updated[0])
}
