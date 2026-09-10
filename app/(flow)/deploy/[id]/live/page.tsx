"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { RequireSession } from "@/components/auth/require-session"
import { FlowFrame } from "@/components/flow/flow-frame"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store/app-store"

export default function LivePage() {
  return (
    <RequireSession>
      <LiveInner />
    </RequireSession>
  )
}

function LiveInner() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { projects, plan } = useAppStore()
  const project = projects.find((item) => item.id === params.id)

  useEffect(() => {
    if (!project) router.replace("/dashboard")
  }, [project, router])

  if (!project) return null

  return (
    <FlowFrame
      step={2}
      title="Live"
      description="Free production URL is ready. First deploy was not billed."
    >
      <div className="rounded-[7px] border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground">Production</p>
        <p className="mt-1 font-mono text-sm text-foreground">{project.url.replace("https://", "")}</p>
        <p className="mt-3 text-[13px] text-muted-foreground">
          {project.repoFullName} · {project.branch} · Lagos Edge
        </p>
        {plan === "free" ? (
          <p className="mt-3 text-[13px] text-foreground">FREE · spend ₦0</p>
        ) : (
          <p className="mt-3 text-[13px] text-foreground">Pro · included</p>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild>
          <a href={project.url} target="_blank" rel="noreferrer">
            Open URL
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        {plan === "free" ? (
          <Button asChild variant="ghost">
            <Link href="/upgrade">Upgrade to Pro</Link>
          </Button>
        ) : null}
      </div>
    </FlowFrame>
  )
}
