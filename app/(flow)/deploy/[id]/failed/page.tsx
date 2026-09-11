"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { RequireSession } from "@/components/auth/require-session"
import { OutcomeIcon } from "@/components/brand/outcome-icon"
import { FlowFrame } from "@/components/flow/flow-frame"
import { Surface } from "@/components/chrome/surface"
import { Button } from "@/components/ui/button"
import { formatNaira } from "@/lib/format"
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
      variant="center"
      headerRight={
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">Open dashboard</Link>
        </Button>
      }
    >
      <Surface className="p-6">
        <OutcomeIcon kind="fail" />
        <h1 className="mt-4 text-lg font-semibold text-foreground">Deploy failed</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Lagos Edge rejected this build. Your Free credit is kept — spend remains {formatNaira(0)}.
        </p>
        <Surface className="mt-4 px-3 py-3">
          <p className="text-[13px] text-foreground">
            {project.failReason || "Deploy failed: Lagos Edge rejected the build artifact"}
          </p>
          <p className="mt-2 text-[12px] text-muted-foreground">
            {project.name} · {project.repoFullName} · {project.branch}
          </p>
        </Surface>
        <div className="mt-4 flex flex-col gap-2">
          <Button type="button" size="lg" onClick={retry} disabled={project.retryUsed}>
            {project.retryUsed ? "Retry used" : "Retry deploy"}
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">Keep free deploy</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/deploy/configure">Edit build settings</Link>
          </Button>
        </div>
      </Surface>
    </FlowFrame>
  )
}
