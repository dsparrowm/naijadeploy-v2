"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { RequireSession } from "@/components/auth/require-session"
import { FlowFrame } from "@/components/flow/flow-frame"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StubUrl } from "@/components/brand/demo-chip"
import { DEFAULT_REGION, FREE_PLAN, projectUrl, toSlug } from "@/lib/config"
import { findRepo } from "@/lib/mock/repos"
import { useAppStore } from "@/lib/store/app-store"

export default function ConfigurePage() {
  return (
    <RequireSession>
      <Suspense>
        <ConfigureInner />
      </Suspense>
    </RequireSession>
  )
}

function ConfigureInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { draft, setDraft, createProject, canCreateFreeProject, plan } = useAppStore()
  const [name, setName] = useState(draft?.projectName || "")
  const [branch, setBranch] = useState(draft?.branch || "main")

  useEffect(() => {
    if (!draft) router.replace("/connect")
  }, [draft, router])

  const repo = draft ? findRepo(draft.repoFullName) : undefined
  const slug = useMemo(() => toSlug(name || draft?.slug || "app"), [name, draft?.slug])
  const branches = repo?.branches ?? [branch]
  const forceFail = searchParams.get("fail") === "1"

  function deploy() {
    if (!draft) return
    if (!canCreateFreeProject) {
      router.push("/upgrade")
      return
    }
    const nextDraft = {
      ...draft,
      projectName: name || draft.projectName,
      slug,
      branch,
      region: "lagos-edge" as const,
      simulateFailure: forceFail,
    }
    setDraft(nextDraft)
    const project = createProject({ ...nextDraft, fail: false })
    router.push(`/deploy/${project.id}${forceFail ? "?fail=1" : ""}`)
  }

  if (!draft) return null

  return (
    <FlowFrame
      step={1}
      stub
      title="Configure & deploy"
      description={`${draft.repoFullName} · first deploy on Free is not billed.`}
    >
      <div className="space-y-4 rounded-[7px] border border-border bg-card p-4">
        <div className="space-y-1.5">
          <Label htmlFor="project" className="text-[13px]">
            Project name
          </Label>
          <Input id="project" value={name} onChange={(e) => setName(e.target.value)} />
          <StubUrl url={projectUrl(slug)} className="text-xs" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[13px]">Branch</Label>
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {branches.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[13px]">Region</Label>
          <div className="flex h-9 items-center rounded-[7px] border border-border bg-surface-2 px-3 text-[13px] text-foreground">
            {DEFAULT_REGION.label}
          </div>
          <p className="text-xs text-muted-foreground">Single region for v1. Pay in Naira.</p>
        </div>
      </div>

      {!canCreateFreeProject ? (
        <div className="mt-4 rounded-[7px] border border-border bg-card px-4 py-3 text-[13px] text-muted-foreground">
          Free includes 1 project. Upgrade to Pro to deploy another.
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between rounded-[7px] border border-border bg-card px-4 py-3">
        <div>
          <p className="text-[13px] text-muted-foreground">Deploy cost</p>
          <p className="text-lg font-semibold text-foreground">
            {plan === "free" ? "FREE" : "Included"}
          </p>
          <p className="text-xs text-muted-foreground">
            {FREE_PLAN.projects} project · {FREE_PLAN.storage} · {FREE_PLAN.ram} · {FREE_PLAN.region}
          </p>
        </div>
        {canCreateFreeProject ? (
          <Button type="button" onClick={deploy} disabled={!name.trim()}>
            Deploy
          </Button>
        ) : (
          <Button type="button" onClick={() => router.push("/upgrade")}>
            Upgrade to Pro
          </Button>
        )}
      </div>
    </FlowFrame>
  )
}
