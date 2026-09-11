"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Logo />

          <div className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-[13px] text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="text-[13px] text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Get started</Link>
            </Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            <Link href="#features" className="block px-2 py-2 text-[13px] text-muted-foreground">
              Features
            </Link>
            <Link href="#pricing" className="block px-2 py-2 text-[13px] text-muted-foreground">
              Pricing
            </Link>
            <div className="flex flex-col gap-2 pt-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
