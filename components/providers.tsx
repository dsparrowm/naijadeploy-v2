"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AppStoreProvider } from "@/lib/store/app-store"
import type { AppState } from "@/lib/store/types"

export function Providers({
  initial,
  children,
}: {
  initial: AppState
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
      <AppStoreProvider initial={initial}>
        {children}
        <Toaster theme="dark" />
      </AppStoreProvider>
    </ThemeProvider>
  )
}
