"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DemoChip } from "@/components/brand/demo-chip"
import { StatusBadge } from "@/components/brand/status-badge"
import { RequireSession } from "@/components/auth/require-session"
import { FlowFrame } from "@/components/flow/flow-frame"
import { Surface } from "@/components/chrome/surface"
import { Button } from "@/components/ui/button"
import { formatNaira } from "@/lib/format"
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
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!project) router.replace("/dashboard")
  }, [project, router])

  if (!project) return null

  async function copyUrl() {
    if (!project) return
    try {
      await navigator.clipboard.writeText(project.url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <FlowFrame
      variant="center"
      headerRight={
        <>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[12px] font-medium text-success">
            <span className="size-1.5 rounded-full bg-success" />
            LIVE
          </span>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
        </>
      }
    >
      <Surface className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status="live" />
          <span className="rounded-[4px] border border-border px-1.5 py-px text-[11px] text-muted-foreground">
            Free first deploy
          </span>
        </div>
        <h1 className="mt-3 text-lg font-semibold text-foreground">Your project is live</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          {project.name} deployed to Lagos Edge. Spend remains {formatNaira(0)} on Free.
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-[7px] border border-border bg-background px-3 py-2">
          <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-foreground">
            {project.url}
          </span>
          <DemoChip />
          <Button type="button" variant="outline" size="sm" onClick={copyUrl}>
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Surface className="px-3 py-2.5">
            <p className="text-[12px] text-muted-foreground">Region</p>
            <p className="mt-0.5 text-[13px] font-medium text-foreground">Lagos Edge</p>
          </Surface>
          <Surface className="px-3 py-2.5">
            <p className="text-[12px] text-muted-foreground">Plan</p>
            <p className="mt-0.5 text-[13px] font-medium text-foreground">
              {plan === "pro" ? "Pro" : `Free · ${formatNaira(0)}`}
            </p>
          </Surface>
        </div>
        {plan === "free" ? (
          <div className="mt-4 rounded-[7px] border border-primary/40 bg-primary/5 p-3">
            <p className="text-[13px] font-medium text-foreground">Need custom domains & more builds?</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">Upgrade to Pro · ₦7,500/mo via Paystack.</p>
            <Button asChild className="mt-3">
              <Link href="/upgrade">Upgrade to Pro · Paystack</Link>
            </Button>
          </div>
        ) : null}
        <p className="mt-4 text-[13px] text-muted-foreground">
          Skip for now →{" "}
          <Link href="/dashboard" className="text-foreground hover:underline">
            dashboard
          </Link>
        </p>
      </Surface>
    </FlowFrame>
  )
}
