export type MockRepo = {
  fullName: string
  description: string
  private: boolean
  updatedAt: string
  language: string
  branches: string[]
  defaultBranch: string
}

export const MOCK_REPOS: MockRepo[] = [
  {
    fullName: "oladipo/pay-api",
    description: "Naira collections API",
    private: true,
    updatedAt: "2h ago",
    language: "TypeScript",
    branches: ["main", "develop"],
    defaultBranch: "main",
  },
  {
    fullName: "ada/market-web",
    description: "Storefront for Lagos retailers",
    private: false,
    updatedAt: "1d ago",
    language: "Next.js",
    branches: ["main", "staging"],
    defaultBranch: "main",
  },
  {
    fullName: "kemi/logistics-app",
    description: "Last-mile tracking",
    private: true,
    updatedAt: "3d ago",
    language: "Go",
    branches: ["main", "release"],
    defaultBranch: "main",
  },
  {
    fullName: "tunde/school-portal",
    description: "Admissions and fees",
    private: false,
    updatedAt: "5d ago",
    language: "TypeScript",
    branches: ["main"],
    defaultBranch: "main",
  },
  {
    fullName: "chioma/fintech-dashboard",
    description: "Ops console",
    private: true,
    updatedAt: "1w ago",
    language: "React",
    branches: ["main", "feat/reports"],
    defaultBranch: "main",
  },
]

export function findRepo(fullName: string) {
  return MOCK_REPOS.find((repo) => repo.fullName === fullName)
}
