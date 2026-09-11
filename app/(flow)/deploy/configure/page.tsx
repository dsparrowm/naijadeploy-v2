"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { RequireSession } from "@/components/auth/require-session"
import { StubUrl } from "@/components/brand/demo-chip"
import { UserAvatar } from "@/components/brand/user-avatar"
import { FlowFrame, FlowRail } from "@/components/flow/flow-frame"
import { Field, Surface } from "@/components/chrome/surface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DEFAULT_REGION, FREE_PLAN, projectUrl, toSlug } from "@/lib/config"
import { formatNaira } from "@/lib/format"
import { findRepo } from "@/lib/mock/repos"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"

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
  const { draft, setDraft, createProject, canCreateFreeProject, user } = useAppStore()
  const repo = draft ? findRepo(draft.repoFullName) : undefined
  const [name, setName] = useState(draft?.projectName || "")
  const [branch, setBranch] = useState(draft?.branch || "main")
  const [rootDirectory, setRootDirectory] = useState("/")
  const [buildCommand, setBuildCommand] = useState(repo?.buildCommand || "npm run build")
  const [outputDirectory, setOutputDirectory] = useState(repo?.outputDirectory || ".next")

  useEffect(() => {
    if (!draft) router.replace("/connect")
  }, [draft, router])

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
      title="Configure deployment"
      description={`${draft.repoFullName} · Free first launch`}
      headerRight={
        <>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[12px] text-success">
            <span className="size-1.5 rounded-full bg-success" />
            Systems normal
          </span>
          <UserAvatar name={user?.name || user?.email || "You"} size="sm" />
        </>
      }
      rail={
        <FlowRail label="Summary">
          <Surface className="p-3">
            <SummaryRow label="Repo" value={draft.projectName} />
            <SummaryRow label="Branch" value={branch} />
            <SummaryRow label="Region" value={DEFAULT_REGION.label} />
            <SummaryRow label="Plan" value={`Free · ${formatNaira(FREE_PLAN.priceNaira)}`} accent />
          </Surface>
          <p className="text-[12px] text-muted-foreground">
            Live URL after health check: {projectUrl(slug).replace(/^https?:\/\//, "")}
          </p>
          <StubUrl url={projectUrl(slug)} className="text-[12px]" />
        </FlowRail>
      }
    >
      <div className="max-w-[640px] space-y-4">
        <Field label="Project name">
          <Input id="project" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Branch">
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
          </Field>
          <Field label="Root directory">
            <Input value={rootDirectory} onChange={(e) => setRootDirectory(e.target.value)} />
          </Field>
        </div>
        <Field label="Region">
          <div className="space-y-2">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-[7px] border border-primary/50 bg-primary/10 px-3 py-2.5 text-left"
            >
              <span>
                <span className="flex items-center gap-1.5 text-[13px] font-medium text-foreground">
                  <span className="size-1.5 rounded-full bg-success" />
                  Lagos Edge
                </span>
                <span className="mt-0.5 block text-[12px] text-muted-foreground">
                  Preferred for West Africa traffic
                </span>
              </span>
              <span className="rounded-[4px] bg-success/15 px-1.5 py-px text-[11px] font-medium text-success">
                Default
              </span>
            </button>
            <div className="flex w-full items-center justify-between rounded-[7px] border border-border px-3 py-2.5 opacity-60">
              <span>
                <span className="text-[13px] font-medium text-foreground">Global (coming later)</span>
                <span className="mt-0.5 block text-[12px] text-muted-foreground">Multi-region — Scale plan</span>
              </span>
            </div>
          </div>
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Build command">
            <Input value={buildCommand} onChange={(e) => setBuildCommand(e.target.value)} />
          </Field>
          <Field label="Output directory">
            <Input value={outputDirectory} onChange={(e) => setOutputDirectory(e.target.value)} />
          </Field>
        </div>

        {!canCreateFreeProject ? (
          <Surface className="px-4 py-3 text-[13px] text-muted-foreground">
            Free includes 1 project. Upgrade to Pro to deploy another.
          </Surface>
        ) : null}

        <div className="flex items-center gap-2 pt-1">
          <Button type="button" variant="outline" onClick={() => router.push("/connect")}>
            Back
          </Button>
          {canCreateFreeProject ? (
            <Button type="button" onClick={deploy} disabled={!name.trim()}>
              Deploy free
            </Button>
          ) : (
            <Button type="button" onClick={() => router.push("/upgrade")}>
              Upgrade to Pro
            </Button>
          )}
        </div>
      </div>
    </FlowFrame>
  )
}

function SummaryRow({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-2 last:border-b-0 last:pb-0 first:pt-0">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <span className={cn("text-[13px] text-foreground", accent && "font-medium text-success")}>{value}</span>
    </div>
  )
}
