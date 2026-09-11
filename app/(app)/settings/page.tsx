"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store/app-store"

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout } = useAppStore()

  function signOut() {
    logout()
    router.push("/login")
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-lg font-semibold tracking-tight text-foreground">Settings</h1>
      <p className="mt-1 text-[13px] text-muted-foreground">Account only. Orgs and SSO are out of v1.</p>

      <div className="mt-5 rounded-[7px] border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-xs text-muted-foreground">Name</p>
            <p className="mt-0.5 text-[13px] text-foreground">{user?.name}</p>
          </div>
        </div>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="mt-0.5 text-[13px] text-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-muted-foreground">Two-factor</p>
            <p className="mt-0.5 text-[13px] text-foreground">
              {user?.twoFactorEnabled ? "Enabled" : "Skipped"}
            </p>
          </div>
        </div>
      </div>

      <Button type="button" variant="outline" className="mt-4" onClick={signOut}>
        Sign out
      </Button>
    </div>
  )
}
