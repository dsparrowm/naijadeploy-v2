"use client"

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
      <h1 className="text-lg font-semibold tracking-tight text-foreground">Domains</h1>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Default production host is {"{project}"}.naijadeploy.app. Custom domains are out of v1.
      </p>
      <div className="mt-5 overflow-hidden rounded-[7px] border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-9 px-3 text-[13px] text-muted-foreground">Project</TableHead>
              <TableHead className="h-9 px-3 text-[13px] text-muted-foreground">Hostname</TableHead>
              <TableHead className="h-9 px-3 text-[13px] text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={3} className="px-3 py-10 text-center text-[13px] text-muted-foreground">
                  Domains appear after the first deploy.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="px-3 py-2.5 text-[13px] text-foreground">{project.name}</TableCell>
                  <TableCell className="px-3 py-2.5 font-mono text-[13px] text-muted-foreground">
                    {project.url.replace("https://", "")}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-[13px] text-muted-foreground">
                    {project.status === "live" ? "Issued" : project.status}
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
