"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CreditCard,
  Database,
  FolderKanban,
  Globe,
  Settings,
} from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store/app-store"
import { formatNaira } from "@/lib/format"

const NAV = [
  { href: "/dashboard", label: "Projects", icon: FolderKanban },
  { href: "/domains", label: "Domains", icon: Globe },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
] as const

export function AppSidebar() {
  const pathname = usePathname()
  const { user, plan } = useAppStore()

  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex h-12 items-center px-4">
        <Logo href="/dashboard" />
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 px-2 py-2">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-8 items-center gap-2 rounded-[7px] px-2 text-[13px] transition-colors",
                active
                  ? "bg-surface-2 text-foreground"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
              )}
            >
              <item.icon className="size-3.5" />
              {item.label}
            </Link>
          )
        })}
        <span className="flex h-8 cursor-not-allowed items-center gap-2 rounded-[7px] px-2 text-[13px] text-muted-foreground/60">
          <Database className="size-3.5" />
          Databases
          <Badge
            variant="outline"
            className="ml-auto h-4 rounded-[4px] border-border px-1.5 text-[10px] font-medium text-muted-foreground"
          >
            Coming soon
          </Badge>
        </span>
      </nav>
      <div className="border-t border-border px-3 py-3">
        <p className="truncate text-[13px] text-foreground">{user?.email}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {plan === "pro" ? `Pro · ${formatNaira(7500)}/mo` : "Free · ₦0"}
        </p>
      </div>
    </aside>
  )
}
