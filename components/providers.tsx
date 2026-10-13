"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AppStoreProvider } from "@/lib/store/app-store"
import type { User } from "@/lib/store/types"

export function Providers({
  sessionUser,
  children,
}: {
  sessionUser: User | null
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
      <AppStoreProvider sessionUser={sessionUser}>
        {children}
        <Toaster theme="dark" />
      </AppStoreProvider>
    </ThemeProvider>
  )
}
