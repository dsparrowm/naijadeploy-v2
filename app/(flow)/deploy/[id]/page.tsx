"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Check, Circle, Loader2, X } from "lucide-react"
import { StubUrl } from "@/components/brand/demo-chip"
import { UserAvatar } from "@/components/brand/user-avatar"
import { RequireSession } from "@/components/auth/require-session"
import { FlowFrame } from "@/components/flow/flow-frame"
import { Surface } from "@/components/chrome/surface"
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
    const timers: number[] = []

    updateProject(project.id, { status: "building", stage: "build" })

    ORDER.forEach((stage, index) => {
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return
          if (shouldFail && stage === "deploy") {
            setFailed(true)
            setActive("deploy")
            updateProject(project.id, {
              status: "failed",
              stage: "deploy",
              failReason: "Deploy failed: Lagos Edge rejected the build artifact",
            })
            router.replace(`/deploy/${project.id}/failed`)
            return
          }
          setActive(stage)
          updateProject(project.id, {
            status: stage === "build" ? "building" : stage === "deploy" ? "deploying" : "health",
            stage,
          })
          if (stage === "health") {
            timers.push(
              window.setTimeout(() => {
                if (cancelled) return
                updateProject(project.id, { status: "live", stage: "health" })
                router.replace(`/deploy/${project.id}/live`)
              }, 1100),
            )
          }
        }, index * 1400),
      )
    })

    return () => {
      cancelled = true
      timers.forEach((id) => window.clearTimeout(id))
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
