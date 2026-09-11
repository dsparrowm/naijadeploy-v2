"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Github, Search } from "lucide-react"
import { RequireSession } from "@/components/auth/require-session"
import { DemoChip } from "@/components/brand/demo-chip"
import { UserAvatar } from "@/components/brand/user-avatar"
import { FlowFrame, FlowRail } from "@/components/flow/flow-frame"
import { Surface } from "@/components/chrome/surface"
import { Button } from "@/components/ui/button"
import { MOCK_REPOS } from "@/lib/mock/repos"
import { toSlug } from "@/lib/config"
import { repoInitials } from "@/lib/format"
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
  const { setDraft, canCreateFreeProject, user } = useAppStore()
  const [provider, setProvider] = useState<"github" | "gitlab">("github")
  const [selected, setSelected] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const repo = useMemo(() => MOCK_REPOS.find((item) => item.fullName === selected), [selected])
  const filtered = MOCK_REPOS.filter((item) =>
    item.fullName.toLowerCase().includes(query.trim().toLowerCase()),
  )

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
      title="Connect a repository"
      description="First deploy is free. Link GitHub or GitLab to get a live URL on Lagos Edge."
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
        <FlowRail label="Target">
          <Surface className="p-3">
            <p className="flex items-center gap-1.5 text-[13px] font-medium text-foreground">
              <span className="size-1.5 rounded-full bg-success" />
              Lagos Edge
            </p>
            <p className="mt-1 text-[12px] text-muted-foreground">West Africa · ~50ms local RTT</p>
          </Surface>
          <Surface className="p-3">
            <p className="text-[12px] text-muted-foreground">Detected framework</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-[13px] font-medium text-foreground">{repo?.framework ?? "—"}</p>
              <span className="rounded-[4px] border border-border px-1.5 py-px text-[11px] text-muted-foreground">
                Auto
              </span>
            </div>
          </Surface>
          <Surface className="p-3">
            <p className="text-[12px] text-muted-foreground">First deploy</p>
            <p className="mt-1 text-[18px] font-semibold text-success">Free</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              No estimate on the free path. Upgrade to Pro later via Paystack.
            </p>
          </Surface>
          <Button type="button" size="lg" className="w-full" disabled={!selected} onClick={continueDeploy}>
            Continue to configure
          </Button>
          <p className="text-center text-[12px] text-muted-foreground">
            {selected ? "Repository selected — Continue enabled" : "Select a repository to continue"}
          </p>
        </FlowRail>
      }
    >
      <div className="mb-3 flex gap-2">
        <Button
          type="button"
          variant={provider === "github" ? "outline" : "ghost"}
          className={cn(provider === "github" && "border-success/40 text-foreground")}
          onClick={() => setProvider("github")}
        >
          <Github className="size-3.5" />
          GitHub · connected
        </Button>
        <Button type="button" variant={provider === "gitlab" ? "outline" : "ghost"} onClick={() => setProvider("gitlab")}>
          GitLab
        </Button>
      </div>

      {provider === "gitlab" ? (
        <Surface className="px-4 py-10 text-center text-[13px] text-muted-foreground">
          GitLab connect is a stub. Use GitHub to continue the demo.
        </Surface>
      ) : (
        <Surface className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="size-3.5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search repositories…"
              className="h-8 w-full bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul>
            {filtered.map((item) => {
              const active = selected === item.fullName
              return (
                <li key={item.fullName} className="border-b border-border last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setSelected(item.fullName)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                      active ? "bg-primary/10" : "hover:bg-surface-2/70",
                    )}
                  >
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-[7px] bg-surface-2 text-[11px] font-medium text-foreground">
                      {repoInitials(item.fullName)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-foreground">{item.fullName}</span>
                      <span className="block text-[12px] text-muted-foreground">
                        {item.framework} · {item.updatedAt}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="rounded-[4px] border border-border px-1.5 py-px text-[11px] text-muted-foreground">
                        {item.private ? "Private" : "Public"}
                      </span>
                      {active ? (
                        <span className="rounded-[4px] bg-primary px-1.5 py-px text-[11px] font-medium text-primary-foreground">
                          Selected
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Surface>
      )}
      <p className="mt-3 text-[12px] text-muted-foreground">
        Stub repositories — not a live GitHub session. <DemoChip className="ml-1 align-middle" />
      </p>
    </FlowFrame>
  )
}
