export type MockRepo = {
  fullName: string
  description: string
  private: boolean
  updatedAt: string
  language: string
  framework: string
  buildCommand: string
  outputDirectory: string
  branches: string[]
  defaultBranch: string
}

export const MOCK_REPOS: MockRepo[] = [
  {
    fullName: "adewale/naija-pay-gateway",
    description: "Paystack collections API",
    private: true,
    updatedAt: "Updated 2h ago",
    language: "TypeScript",
    framework: "Next.js 14",
    buildCommand: "npm run build",
    outputDirectory: ".next",
    branches: ["main", "develop"],
    defaultBranch: "main",
  },
  {
    fullName: "adewale/corp-frontend",
    description: "Marketing site",
    private: true,
    updatedAt: "Updated yesterday",
    language: "TypeScript",
    framework: "Vite",
    buildCommand: "npm run build",
    outputDirectory: "dist",
    branches: ["main", "feat/auth"],
    defaultBranch: "main",
  },
  {
    fullName: "adewale/docs-site",
    description: "Product docs",
    private: false,
    updatedAt: "Updated 5d ago",
    language: "TypeScript",
    framework: "Astro",
    buildCommand: "npm run build",
    outputDirectory: "dist",
    branches: ["main"],
    defaultBranch: "main",
  },
]

export function findRepo(fullName: string) {
  return MOCK_REPOS.find((repo) => repo.fullName === fullName)
}

export function frameworkPreset(framework: string) {
  if (framework.startsWith("Next.js")) {
    return { buildCommand: "npm run build", outputDirectory: ".next" }
  }
  return { buildCommand: "npm run build", outputDirectory: "dist" }
}
