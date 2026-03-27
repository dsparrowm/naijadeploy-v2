"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">N</span>
            </div>
            <span className="text-xl font-bold text-foreground">Naija Deploy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </Link>
            <Link href="#docs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Docs
            </Link>
            <Link href="#blog" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Blog
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-4 md:flex">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            <Link
              href="#features"
              className="block rounded-lg px-3 py-2 text-base text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="block rounded-lg px-3 py-2 text-base text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="#docs"
              className="block rounded-lg px-3 py-2 text-base text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Docs
            </Link>
            <Link
              href="#blog"
              className="block rounded-lg px-3 py-2 text-base text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Blog
            </Link>
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="ghost" className="w-full justify-center">
                Sign In
              </Button>
              <Button className="w-full justify-center bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
