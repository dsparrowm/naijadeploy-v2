"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Check, Circle, Loader2, X } from "lucide-react"
import { StubUrl } from "@/components/brand/demo-chip"
import { UserAvatar } from "@/components/brand/user-avatar"
import { RequireSession } from "@/components/auth/require-session"
import { FlowFrame } from "@/components/flow/flow-frame"
import { Surface } from "@/components/chrome/surface"
import { Progress } from "@/components/ui/progress"
import { DEPLOY_STAGES, type DeployStageId, type DeployStageState } from "@/lib/deploy/types"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"

const ORDER: DeployStageId[] = ["build", "deploy", "health"]

export default function DeployingPage() {
  return (
    <RequireSession>
      <DeployingInner />
    </RequireSession>
  )
}

function DeployingInner() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { projects, updateProject, user } = useAppStore()
  const project = projects.find((item) => item.id === params.id)
  const shouldFail = searchParams.get("fail") === "1" || project?.status === "failed"
  const [active, setActive] = useState<DeployStageId>("build")
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!project) {
      router.replace("/connect")
    }
  }, [project, router])

  useEffect(() => {
    if (!project) return
    let cancelled = false

    async function pause(ms: number) {
      await new Promise((resolve) => window.setTimeout(resolve, ms))
    }

    const projectId = project.id

    async function run() {
      for (const stage of ORDER) {
        if (cancelled) return
        if (shouldFail && stage === "deploy") {
          setFailed(true)
          setActive("deploy")
          await updateProject(projectId, {
            status: "failed",
            stage: "deploy",
            failReason: "Deploy failed: Lagos Edge rejected the build artifact",
          })
          if (!cancelled) router.replace(`/deploy/${projectId}/failed`)
          return
        }
        setActive(stage)
        await updateProject(projectId, {
          status: stage === "build" ? "building" : stage === "deploy" ? "deploying" : "health",
          stage,
        })
        await pause(stage === "health" ? 1100 : 1400)
        if (cancelled) return
        if (stage === "health") {
          await updateProject(projectId, { status: "live", stage: "health" })
          if (!cancelled) router.replace(`/deploy/${projectId}/live`)
        }
      }
    }

    void run()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id])

  const states = useMemo(() => {
    const map = {} as Record<DeployStageId, DeployStageState>
    for (const stage of ORDER) {
      const idx = ORDER.indexOf(stage)
      const current = ORDER.indexOf(active)
      if (failed && idx >= current && stage === "deploy") map[stage] = "failed"
      else if (failed && idx > current) map[stage] = "pending"
      else if (idx < current) map[stage] = "done"
      else if (idx === current) map[stage] = failed && stage === "deploy" ? "failed" : "active"
      else map[stage] = "pending"
    }
    return map
  }, [active, failed])

  if (!project) return null

  const progress = failed ? 54 : active === "build" ? 28 : active === "deploy" ? 64 : 92

  return (
    <FlowFrame
      step={2}
      title="Deploying"
      description={`${project.name} · Build, Deploy, then Health. Stub URL — not live hosting.`}
      headerRight={
        <>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[12px] text-success">
            <span className="size-1.5 rounded-full bg-success" />
            Systems normal
          </span>
          <UserAvatar name={user?.name || user?.email || "You"} size="sm" />
        </>
      }
    >
      <div className="mb-3 max-w-[640px]">
        <StubUrl url={project.url} />
        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between text-[12px] text-muted-foreground">
            <span>{failed ? "Deploy failed" : DEPLOY_STAGES.find((stage) => stage.id === active)?.label}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-surface-2" />
        </div>
      </div>
      <Surface className="max-w-[640px] overflow-hidden">
        <ol>
          {DEPLOY_STAGES.map((stage, index) => {
            const state = states[stage.id]
            return (
              <li
                key={stage.id}
                className={cn(
                  "flex items-start gap-3 px-4 py-3",
                  index < DEPLOY_STAGES.length - 1 && "border-b border-border",
                )}
              >
                <StageIcon state={state} />
                <div>
                  <p className="text-[13px] font-medium text-foreground">{stage.label}</p>
                  <p className="text-[12px] text-muted-foreground">{stage.detail}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </Surface>
    </FlowFrame>
  )
}

function StageIcon({ state }: { state: DeployStageState }) {
  if (state === "done") return <Check className="mt-0.5 size-4 text-success" />
  if (state === "failed") return <X className="mt-0.5 size-4 text-destructive" />
  if (state === "active") return <Loader2 className="mt-0.5 size-4 animate-spin text-primary" />
  return <Circle className="mt-0.5 size-4 text-muted-foreground/40" />
}
