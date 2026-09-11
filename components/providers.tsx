"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AppStoreProvider } from "@/lib/store/app-store"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
      <AppStoreProvider>
        {children}
        <Toaster theme="dark" />
      </AppStoreProvider>
    </ThemeProvider>
  )
}
