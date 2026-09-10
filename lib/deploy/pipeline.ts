import { DEPLOY_STAGES, type DeployStageId } from "@/lib/deploy/types"

export type DeployPipelineInput = {
  projectId: string
  simulateFailure?: boolean
}

export type DeployPipelineEvent = {
  stage: DeployStageId
  state: "active" | "done" | "failed"
}

export interface DeployPipeline {
  readonly mode: "stub"
  stages(): typeof DEPLOY_STAGES
  start(input: DeployPipelineInput): Promise<{ projectId: string; billed: false }>
}

export const stubDeployPipeline: DeployPipeline = {
  mode: "stub",
  stages: () => DEPLOY_STAGES,
  async start(input) {
    return { projectId: input.projectId, billed: false }
  },
}
