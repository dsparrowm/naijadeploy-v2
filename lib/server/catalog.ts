import "server-only"
import { findRepo, MOCK_REPOS, type MockRepo } from "@/lib/mock/repos"
import type { RepoSummary } from "@/lib/store/types"

export function listCatalogRepos(): RepoSummary[] {
  return MOCK_REPOS.map((repo) => ({
    fullName: repo.fullName,
    private: repo.private,
    updatedAt: repo.updatedAt,
    framework: repo.framework,
    defaultBranch: repo.defaultBranch,
  }))
}

export function catalogRepo(fullName: string): MockRepo | null {
  return findRepo(fullName) ?? null
}
