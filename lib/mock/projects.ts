import { projectUrl } from "@/lib/config"
import type { Project } from "@/lib/store/types"

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 3_600_000).toISOString()
}

/** Visual SoT overview rows from dashboard.png — used when login has no projects yet. */
export function seedOverviewProjects(): Project[] {
  const created = hoursAgo(24 * 5)
  return [
    {
      id: "prj_sot_pay",
      name: "naija-pay-gateway",
      slug: "naija-pay-gateway",
      repoFullName: "adewale/naija-pay-gateway",
      branch: "main",
      region: "lagos-edge",
      url: projectUrl("naija-pay-gateway"),
      status: "live",
      stage: "health",
      createdAt: created,
      updatedAt: hoursAgo(2),
      retryUsed: false,
      framework: "Next.js 14",
      commitSha: "a3f91c",
    },
    {
      id: "prj_sot_corp",
      name: "corp-frontend",
      slug: "corp-frontend",
      repoFullName: "adewale/corp-frontend",
      branch: "feat/auth",
      region: "lagos-edge",
      url: projectUrl("corp-frontend"),
      status: "failed",
      stage: "deploy",
      createdAt: hoursAgo(24 * 4),
      updatedAt: hoursAgo(26),
      retryUsed: false,
      failReason: "Node memory limit",
      framework: "Vite",
      commitSha: "91bc2e",
    },
    {
      id: "prj_sot_docs",
      name: "docs-site",
      slug: "docs-site",
      repoFullName: "adewale/docs-site",
      branch: "main",
      region: "lagos-edge",
      url: projectUrl("docs-site"),
      status: "live",
      stage: "health",
      createdAt: hoursAgo(24 * 5),
      updatedAt: hoursAgo(24 * 4),
      retryUsed: false,
      framework: "Astro",
      commitSha: "2c8e11",
    },
  ]
}
