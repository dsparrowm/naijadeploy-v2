"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { RequireSession } from "@/components/auth/require-session"
import { FlowFrame } from "@/components/flow/flow-frame"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store/app-store"

export default function DeployFailedPage() {
  return (
    <RequireSession>
      <FailedInner />
    </RequireSession>
  )
}

function FailedInner() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { projects, retryDeploy } = useAppStore()
  const project = projects.find((item) => item.id === params.id)

  useEffect(() => {
    if (!project) router.replace("/dashboard")
  }, [project, router])

  if (!project) return null

  function retry() {
    if (!project || project.retryUsed) return
    retryDeploy(project.id)
    router.push(`/deploy/${project.id}`)
  }

  return (
    <FlowFrame
      step={2}
      title="Deploy failed"
      description="One retry is included. Your Free credit is kept."
    >
      <div className="rounded-[7px] border border-border bg-card p-4">
        <p className="text-[13px] text-foreground">
          {project.failReason || "Deploy failed: Lagos Edge rejected the build artifact"}
        </p>
        <p className="mt-3 text-[13px] text-muted-foreground">
          {project.name} · {project.repoFullName} · {project.branch}
        </p>
        <p className="mt-3 text-[13px] text-foreground">Free credit kept · spend ₦0</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={retry} disabled={project.retryUsed}>
          {project.retryUsed ? "Retry used" : "Retry"}
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </FlowFrame>
  )
}
