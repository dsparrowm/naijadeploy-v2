"use client"

import { DemoChip, StubUrl } from "@/components/brand/demo-chip"
import { StatusBadge } from "@/components/brand/status-badge"
import { Surface } from "@/components/chrome/surface"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAppStore } from "@/lib/store/app-store"

export default function DomainsPage() {
  const { projects } = useAppStore()

  return (
    <div>
      <h1 className="text-lg font-semibold text-foreground">Domains</h1>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Default host is {"{project}"}.naijadeploy.app (stub — not live hosting). Custom domains unlock on Pro.
      </p>
      <Surface className="mt-4 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Project</TableHead>
              <TableHead>Hostname</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={3} className="py-10 text-center text-[13px] text-muted-foreground">
                  Domains appear after the first deploy.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="text-foreground">{project.name}</TableCell>
                  <TableCell>
                    <StubUrl url={project.url} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={project.status === "live" ? "live" : project.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Surface>
      <p className="mt-3 text-[12px] text-muted-foreground">
        Stub URLs stay labeled <DemoChip className="ml-1 align-middle" />
      </p>
    </div>
  )
}
