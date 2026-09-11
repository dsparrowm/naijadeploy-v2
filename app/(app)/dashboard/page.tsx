"use client"

import { useMemo, useState } from "react"
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
import { PRO_PLAN } from "@/lib/config"
import { formatNaira, formatRelative } from "@/lib/format"
import { useAppStore } from "@/lib/store/app-store"
import type { Project } from "@/lib/store/types"

export default function DashboardPage() {
  const router = useRouter()
  const { projects, plan, canCreateFreeProject } = useAppStore()
  const [query, setQuery] = useState("")
  const spend = plan === "pro" ? PRO_PLAN.priceNaira : 0
  const liveCount = projects.filter((project) => project.status === "live").length
  const filtered = projects.filter((project) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return project.name.toLowerCase().includes(q) || project.url.toLowerCase().includes(q)
  })

  function newProject() {
    router.push(canCreateFreeProject ? "/connect" : "/upgrade")
  }

  const activity = useMemo(() => buildActivity(projects, plan), [projects, plan])

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-foreground">Projects</h1>
        <div className="flex items-center gap-2">
          <SearchField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            aria-label="Search projects"
          />
          <Button type="button" onClick={newProject}>
            New Project
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Surface className="p-4">
          <p className="text-[12px] text-muted-foreground">Current spend</p>
          <p className="mt-1 text-[18px] font-semibold text-foreground">{formatNaira(spend)}</p>
          <p className="mt-1 text-[12px] text-muted-foreground">{plan === "pro" ? "Pro plan" : "Free plan"}</p>
        </Surface>
        <Surface className="p-4">
          <p className="text-[12px] text-muted-foreground">Plan</p>
          <p className="mt-1 text-[18px] font-semibold text-foreground">{plan === "pro" ? "Pro" : "Free"}</p>
          {plan === "free" ? (
            <Link href="/upgrade" className="mt-1 inline-block text-[13px] text-primary hover:underline">
              Upgrade to Pro
            </Link>
          ) : (
            <p className="mt-1 text-[12px] text-muted-foreground">{formatNaira(PRO_PLAN.priceNaira)}/mo via Paystack</p>
          )}
        </Surface>
        <Surface className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[12px] text-muted-foreground">Usage</p>
              <p className="mt-1 text-[13px] text-foreground">
                {projects.length} {projects.length === 1 ? "project" : "projects"}
                {projects.length > 0 ? ` · ${liveCount} live` : ""}
                {" · 3.2 GB bandwidth"}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[11px] text-success">
              <span className="size-1.5 rounded-full bg-success" />
              Lagos operational
            </span>
          </div>
        </Surface>
      </div>

      <Surface className="mt-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <p className="text-[13px] font-medium text-foreground">All projects</p>
          <p className="text-[12px] text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "project" : "projects"}
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

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_280px]">
        <Surface className="p-4">
          <p className="text-[13px] font-medium text-foreground">Recent activity</p>
          <ul className="mt-3 space-y-2.5">
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
            <p className="text-[13px] font-medium text-foreground">Upgrade</p>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Pro unlocks custom domains and more build minutes for {formatNaira(PRO_PLAN.priceNaira)}/mo.
            </p>
            <Button asChild className="mt-4 w-full">
              <Link href="/upgrade">Pay with Paystack</Link>
            </Button>
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
  )
}

function projectHref(project: Project) {
  if (project.status === "failed") return `/deploy/${project.id}/failed`
  if (project.status === "live") return `/deploy/${project.id}/live`
  return `/deploy/${project.id}`
}

function buildActivity(projects: Project[], plan: "free" | "pro") {
  const items = projects.slice(0, 4).map((project) => {
    if (project.status === "failed") {
      return {
        id: `${project.id}-fail`,
        title: `${project.name} build failed`,
        meta: formatRelative(project.updatedAt),
        dot: "bg-destructive",
      }
    }
    return {
      id: `${project.id}-ok`,
      title: `${project.name} deployed successfully`,
      meta: formatRelative(project.updatedAt),
      dot: "bg-success",
    }
  })
  items.push({
    id: "account",
    title: `Account created on ${plan === "pro" ? "Pro" : "Free"} plan`,
    meta: projects[0] ? formatRelative(projects[projects.length - 1]?.createdAt ?? new Date().toISOString()) : "Just now",
    dot: "bg-muted-foreground",
  })
  return items
}
