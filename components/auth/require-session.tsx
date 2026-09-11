"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store/app-store"

export function RequireSession({ children }: { children: React.ReactNode }) {
  const { ready, user } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    if (ready && !user) router.replace("/login")
  }, [ready, user, router])

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background text-[13px] text-muted-foreground">
        Loading…
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background text-[13px] text-muted-foreground">
        Redirecting to log in…
      </div>
    )
  }

  return <>{children}</>
}
