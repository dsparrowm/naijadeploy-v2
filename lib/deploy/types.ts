export type DeployStageId = "build" | "deploy" | "health"

export type DeployStageState = "pending" | "active" | "done" | "failed"

export type DeployStage = {
  id: DeployStageId
  label: string
  detail: string
}

export const DEPLOY_STAGES: DeployStage[] = [
  { id: "build", label: "Build", detail: "Install dependencies and compile" },
  { id: "deploy", label: "Deploy", detail: "Push image to Lagos Edge" },
  { id: "health", label: "Health", detail: "Probe production URL" },
]
