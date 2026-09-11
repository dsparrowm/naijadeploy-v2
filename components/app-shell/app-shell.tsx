"use client"

import { RequireSession } from "@/components/auth/require-session"
import { AppSidebar } from "@/components/app-shell/app-sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <RequireSession>
      <div className="flex min-h-svh bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 px-6 py-5">{children}</main>
        </div>
      </div>
    </RequireSession>
  )
}
