"use client"

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
import { DemoChip, StubUrl } from "@/components/brand/demo-chip"
import { FREE_PLAN, PRO_PLAN } from "@/lib/config"
import { formatDateTime, formatNaira } from "@/lib/format"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const router = useRouter()
  const { projects, plan, canCreateFreeProject } = useAppStore()
  const spend = plan === "pro" ? PRO_PLAN.priceNaira : 0

  function newProject() {
    router.push(canCreateFreeProject ? "/connect" : "/upgrade")
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">Projects</h1>
            <DemoChip />
          </div>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {plan === "pro" ? "Pro" : "Free"} · spend {formatNaira(spend)}
            {plan === "free"
              ? ` · ${projects.length}/${FREE_PLAN.projects} project · ${FREE_PLAN.storage} · ${FREE_PLAN.ram} · Lagos Edge`
              : " · Lagos Edge"}
          </p>
        </div>
        <Button type="button" onClick={newProject}>
          New project
        </Button>
      </div>

      <div className="mt-5 overflow-hidden rounded-[7px] border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-9 px-3 text-[13px] text-muted-foreground">Name</TableHead>
              <TableHead className="h-9 px-3 text-[13px] text-muted-foreground">Status</TableHead>
              <TableHead className="h-9 px-3 text-[13px] text-muted-foreground">Production</TableHead>
              <TableHead className="h-9 px-3 text-[13px] text-muted-foreground">Region</TableHead>
              <TableHead className="h-9 px-3 text-[13px] text-muted-foreground">Branch</TableHead>
              <TableHead className="h-9 px-3 text-[13px] text-muted-foreground">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="px-3 py-10 text-center text-[13px] text-muted-foreground">
                  No projects yet. Connect Git to deploy your first app for FREE.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="px-3 py-2.5 text-[13px] font-medium text-foreground">
                    <Link
                      href={
                        project.status === "failed"
                          ? `/deploy/${project.id}/failed`
                          : project.status === "live"
                            ? `/deploy/${project.id}/live`
                            : `/deploy/${project.id}`
                      }
                      className="hover:underline"
                    >
                      {project.name}
                    </Link>
                  </TableCell>
                  <TableCell className="px-3 py-2.5">
                    <StatusLabel status={project.status} />
                  </TableCell>
                  <TableCell className="px-3 py-2.5">
                    <StubUrl url={project.url} />
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-[13px] text-muted-foreground">
                    Lagos Edge
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-[13px] text-muted-foreground">
                    {project.branch}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-[13px] text-muted-foreground">
                    {formatDateTime(project.updatedAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function StatusLabel({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "text-[13px]",
        status === "live" && "text-foreground",
        status === "failed" && "text-destructive",
        status !== "live" && status !== "failed" && "text-muted-foreground",
      )}
    >
      {status === "health" ? "Health" : status[0].toUpperCase() + status.slice(1)}
    </span>
  )
}
