import "server-only"
import { eq } from "drizzle-orm"
import { toSlug } from "@/lib/config"
import { getDb } from "@/lib/db"
import { deployDraft } from "@/lib/db/schema"
import { catalogRepo } from "@/lib/server/catalog"
import type { DraftDeploy } from "@/lib/store/types"

export async function readDraft(userId: string): Promise<DraftDeploy | null> {
  const rows = await getDb().select().from(deployDraft).where(eq(deployDraft.userId, userId)).limit(1)
  const row = rows[0]
  if (!row) return null
  return {
    repoFullName: row.repoFullName,
    projectName: row.projectName,
    slug: row.slug,
    branch: row.branch,
    region: "lagos-edge",
    simulateFailure: row.simulateFailure,
    framework: row.framework ?? undefined,
    buildCommand: row.buildCommand ?? undefined,
    outputDirectory: row.outputDirectory ?? undefined,
    branches: row.branches,
  }
}

export async function saveDraft(userId: string, input: DraftDeploy): Promise<DraftDeploy> {
  const repo = catalogRepo(input.repoFullName)
  if (!repo) {
    throw new Error("Unknown repository")
  }
  const branch = repo.branches.includes(input.branch) ? input.branch : repo.defaultBranch
  const projectName = input.projectName.trim() || repo.fullName.split("/")[1] || "app"
  const slug = toSlug(input.slug || projectName)
  const now = new Date()
  const draft: DraftDeploy = {
    repoFullName: repo.fullName,
    projectName,
    slug,
    branch,
    region: "lagos-edge",
    simulateFailure: Boolean(input.simulateFailure),
    framework: repo.framework,
    buildCommand: input.buildCommand || repo.buildCommand,
    outputDirectory: input.outputDirectory || repo.outputDirectory,
    branches: repo.branches,
  }
  const db = getDb()
  await db
    .insert(deployDraft)
    .values({
      userId,
      repoFullName: draft.repoFullName,
      projectName: draft.projectName,
      slug: draft.slug,
      branch: draft.branch,
      region: draft.region,
      framework: draft.framework,
      buildCommand: draft.buildCommand,
      outputDirectory: draft.outputDirectory,
      branches: draft.branches ?? [draft.branch],
      simulateFailure: Boolean(draft.simulateFailure),
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: deployDraft.userId,
      set: {
        repoFullName: draft.repoFullName,
        projectName: draft.projectName,
        slug: draft.slug,
        branch: draft.branch,
        region: draft.region,
        framework: draft.framework,
        buildCommand: draft.buildCommand,
        outputDirectory: draft.outputDirectory,
        branches: draft.branches ?? [draft.branch],
        simulateFailure: Boolean(draft.simulateFailure),
        updatedAt: now,
      },
    })
  return draft
}
