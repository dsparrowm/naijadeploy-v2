"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Github, Lock } from "lucide-react"
import { RequireSession } from "@/components/auth/require-session"
import { FlowFrame } from "@/components/flow/flow-frame"
import { Button } from "@/components/ui/button"
import { MOCK_REPOS } from "@/lib/mock/repos"
import { toSlug } from "@/lib/config"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"

export default function ConnectPage() {
  return (
    <RequireSession>
      <ConnectInner />
    </RequireSession>
  )
}

function ConnectInner() {
  const router = useRouter()
  const { setDraft, canCreateFreeProject } = useAppStore()
  const [selected, setSelected] = useState<string | null>(null)
  const repo = useMemo(() => MOCK_REPOS.find((item) => item.fullName === selected), [selected])

  function continueDeploy() {
    if (!repo) return
    if (!canCreateFreeProject) {
      router.push("/upgrade")
      return
    }
    const name = repo.fullName.split("/")[1] || repo.fullName
    setDraft({
      repoFullName: repo.fullName,
      projectName: name,
      slug: toSlug(name),
      branch: repo.defaultBranch,
      region: "lagos-edge",
    })
    router.push("/deploy/configure")
  }

  return (
    <FlowFrame
      step={0}
      title="Connect Git"
      description="Select a repository. Continue stays disabled until one is selected."
    >
      <div className="overflow-hidden rounded-[7px] border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <Github className="size-3.5" />
            GitHub
          </span>
          <span className="text-xs text-muted-foreground">{MOCK_REPOS.length} repos</span>
        </div>
        <ul>
          {MOCK_REPOS.map((item) => {
            const active = selected === item.fullName
            return (
              <li key={item.fullName} className="border-b border-border last:border-b-0">
                <button
                  type="button"
                  onClick={() => setSelected(item.fullName)}
                  className={cn(
                    "flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors",
                    active ? "bg-surface-2" : "hover:bg-surface-2/60",
                  )}
                >
                  <span
                    className={cn(
                      "mt-1 size-3.5 shrink-0 rounded-full border",
                      active ? "border-primary bg-primary" : "border-border",
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-foreground">{item.fullName}</span>
                      {item.private ? <Lock className="size-3 text-muted-foreground" /> : null}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {item.language} · {item.updatedAt}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="mt-4 flex items-center justify-end">
        <Button type="button" disabled={!selected} onClick={continueDeploy}>
          Continue
        </Button>
      </div>
    </FlowFrame>
  )
}
