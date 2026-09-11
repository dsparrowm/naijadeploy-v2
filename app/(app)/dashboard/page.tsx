"use client"

import { useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DemoChip } from "@/components/brand/demo-chip"
import { StatusBadge } from "@/components/brand/status-badge"
import { SearchField, Surface } from "@/components/chrome/surface"
import { PRO_PLAN, SCALE_PLAN } from "@/lib/config"
import { formatNaira, formatRelative } from "@/lib/format"
import { useAppStore } from "@/lib/store/app-store"
import type { Project } from "@/lib/store/types"

export default function DashboardPage() {
  const router = useRouter()
  const { projects, plan, canCreateFreeProject } = useAppStore()
  const [query, setQuery] = useState("")
  const spend = plan === "pro" ? PRO_PLAN.priceNaira : 0
  const liveCount = projects.filter((project) => project.status === "live").length
  const failedCount = projects.filter((project) => project.status === "failed").length
  const filtered = projects.filter((project) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return project.name.toLowerCase().includes(q) || project.url.toLowerCase().includes(q)
  })

  function newProject() {
    router.push(canCreateFreeProject ? "/connect" : "/upgrade")
  }

  const activity = useMemo(() => buildActivity(projects, plan, spend), [projects, plan, spend])
  const bandwidthUsed = projects.length === 0 ? "0 GB" : "3.2 GB"
  const bandwidthCap = plan === "pro" ? "100 GB" : "10 GB"

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          <p className="mt-0.5 text-[12px] text-muted-foreground">Overview · Lagos Edge</p>
        </div>
        <div className="flex items-center gap-2">
          <SearchField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects..."
            aria-label="Search projects"
          />
          <Button type="button" onClick={newProject}>
            New Project
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5 xl:grid-cols-5">
        <MetricCard label="Current spend" value={formatNaira(spend)} hint={plan === "pro" ? "Pro plan" : "Free plan"} />
        <MetricCard
          label="Plan"
          value={plan === "pro" ? "Pro" : "Free"}
          hint={
            plan === "free" ? (
              <Link href="/upgrade" className="text-[13px] text-primary hover:underline">
                Upgrade · {formatNaira(PRO_PLAN.priceNaira)}
              </Link>
            ) : (
              `${formatNaira(PRO_PLAN.priceNaira)}/mo · Paystack`
            )
          }
        />
        <MetricCard
          label="Projects"
          value={String(projects.length)}
          hint={
            projects.length === 0
              ? "No deploys yet"
              : `${liveCount} live${failedCount ? ` · ${failedCount} failed` : ""}`
          }
        />
        <MetricCard
          label="Bandwidth"
          value={bandwidthUsed}
          hint={`of ${bandwidthCap} ${plan === "pro" ? "Pro" : "Free"}`}
        />
        <MetricCard
          label="Region"
          value={
            <span className="inline-flex items-center gap-1.5 text-success">
              <span className="size-1.5 rounded-full bg-success" />
              Lagos Edge
            </span>
          }
          hint="Operational"
        />
      </div>

      <div className="mt-3 grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Surface className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <p className="text-[13px] font-medium text-foreground">Projects</p>
            <p className="text-[12px] text-muted-foreground">
              Table · {filtered.length} {filtered.length === 1 ? "project" : "projects"}
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right"> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="py-10 text-center text-[13px] text-muted-foreground">
                    No projects yet. Connect Git to deploy your first app for FREE.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Link href={projectHref(project)} className="block hover:underline">
                        <span className="block font-medium text-foreground">{project.name}</span>
                      </Link>
                      <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                        {project.url.replace(/^https?:\/\//, "")}
                        <DemoChip />
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={project.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">Lagos Edge</TableCell>
                    <TableCell className="text-muted-foreground">
                      {project.branch}
                      {project.commitSha ? ` · ${project.commitSha}` : ""}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatRelative(project.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      {project.status === "failed" ? (
                        <Link href={`/deploy/${project.id}/failed`} className="text-[13px] text-primary hover:underline">
                          Retry
                        </Link>
                      ) : (
                        <Link href={projectHref(project)} className="text-[13px] text-primary hover:underline">
                          Open
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Surface>

        <div className="space-y-3">
          <Surface className="p-4">
            <p className="text-[13px] font-medium text-foreground">Recent activity</p>
            <ul className="mt-3 space-y-3">
              {activity.map((item) => (
                <li key={item.id} className="flex items-start gap-2 text-[13px]">
                  <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${item.dot}`} />
                  <span>
                    <span className="text-foreground">{item.title}</span>
                    <span className="mt-0.5 block text-[12px] text-muted-foreground">{item.meta}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Surface>
          {plan === "free" ? (
            <Surface className="p-4">
              <p className="text-[13px] font-medium text-foreground">Upgrade to Pro</p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                Custom domains & more build minutes · {formatNaira(PRO_PLAN.priceNaira)}/mo.
              </p>
              <Button asChild className="mt-4 w-full">
                <Link href="/upgrade">Pay with Paystack</Link>
              </Button>
              <p className="mt-2 text-center text-[12px] text-muted-foreground">
                Scale {formatNaira(SCALE_PLAN.priceNaira)} — stub
              </p>
            </Surface>
          ) : (
            <Surface className="p-4">
              <p className="text-[13px] font-medium text-foreground">Pro</p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {formatNaira(PRO_PLAN.priceNaira)}/mo · Paystack · Lagos Edge
              </p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="/billing">Billing</Link>
              </Button>
            </Surface>
          )}
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string
  value: ReactNode
  hint: ReactNode
}) {
  return (
    <Surface className="px-3.5 py-3">
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-[18px] font-semibold tracking-tight text-foreground">{value}</p>
      <div className="mt-1 text-[12px] text-muted-foreground">{hint}</div>
    </Surface>
  )
}

function projectHref(project: Project) {
  if (project.status === "failed") return `/deploy/${project.id}/failed`
  if (project.status === "live") return `/deploy/${project.id}/live`
  return `/deploy/${project.id}`
}

function buildActivity(projects: Project[], plan: "free" | "pro", spend: number) {
  const items = projects.slice(0, 3).map((project, index) => {
    if (project.status === "failed") {
      return {
        id: `${project.id}-fail`,
        title: `${project.name} build failed`,
        meta: `${formatRelative(project.updatedAt)}${project.failReason ? ` · ${project.failReason}` : ""}`,
        dot: "bg-destructive",
      }
    }
    const verb = index === 0 ? "deployed" : "redeployed"
    const detail = index === 0 ? "production" : project.branch
    return {
      id: `${project.id}-ok`,
      title: `${project.name} ${verb}`,
      meta: `${formatRelative(project.updatedAt)} · ${detail}`,
      dot: "bg-success",
    }
  })
  items.push({
    id: "account",
    title: `Account on ${plan === "pro" ? "Pro" : "Free"} plan`,
    meta: `Spend ${formatNaira(spend)}${projects[0] ? ` · ${formatRelative(projects[projects.length - 1]?.createdAt ?? new Date().toISOString())}` : ""}`,
    dot: "bg-muted-foreground",
  })
  return items
}
