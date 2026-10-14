"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const productLinks = [
  { href: "#backend", label: "Deploy backend" },
  { href: "#metrics", label: "Metrics" },
  { href: "#deployments", label: "Deployments" },
  { href: "#configure", label: "Environment variables" },
  { href: "#pipeline", label: "Deploy pipeline" },
]

const solutionLinks = [
  { href: "#for-engineering", label: "For Engineering" },
  { href: "#for-marketing", label: "For Marketing" },
  { href: "#for-product", label: "For Product" },
]

const pageLinks = [
  { href: "#testimonials", label: "Customers" },
  { href: "#pricing", label: "Pricing" },
  { href: "#resources", label: "Blog" },
  { href: "#documentation", label: "Docs" },
]

export function MarketingHeader() {
  const [openMenu, setOpenMenu] = useState<"product" | "solutions" | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const productId = useId()
  const solutionsId = useId()
  const mobileId = useId()
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null)
        setMobileOpen(false)
      }
    }
    function onPointer(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenMenu(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointer)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointer)
    }
  }, [])

  function closeAll() {
    setOpenMenu(null)
    setMobileOpen(false)
  }

  return (
    <header ref={headerRef} className="sticky top-0 z-30 bg-white">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#141433] focus:outline focus:outline-2 focus:outline-[#f2545b]"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-[#141433] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2545b]"
        >
          <span className="text-[#f2545b]">Naija</span>Deploy
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          <MenuButton
            label="Product"
            menuId={productId}
            expanded={openMenu === "product"}
            onToggle={() => setOpenMenu(openMenu === "product" ? null : "product")}
            items={productLinks}
            onNavigate={closeAll}
          />
          <MenuButton
            label="Solutions"
            menuId={solutionsId}
            expanded={openMenu === "solutions"}
            onToggle={() => setOpenMenu(openMenu === "solutions" ? null : "solutions")}
            items={solutionLinks}
            onNavigate={closeAll}
          />
          {pageLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md text-sm text-zinc-600 hover:text-[#141433] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141433]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/login"
            className="rounded-md px-1 py-2 text-[#141433] hover:text-[#f2545b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2545b]"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[#f2545b] px-4 py-2 font-semibold text-white hover:bg-[#e4464d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141433]"
          >
            Sign up
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-[#141433] hover:bg-[#fde8e9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2545b] lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls={mobileId}
            onClick={() => {
              setMobileOpen((value) => !value)
              setOpenMenu(null)
            }}
          >
            {mobileOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          id={mobileId}
          aria-label="Mobile"
          className="absolute inset-x-0 top-full z-40 border-t border-[#eceef3] bg-white px-5 py-4 shadow-[0_12px_30px_-12px_rgba(20,20,51,0.18)] lg:hidden"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">Product</p>
          <ul className="mt-2 space-y-1">
            {productLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={closeAll} className="block rounded-lg px-2 py-2 text-sm text-[#141433] hover:bg-[#fde8e9]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">Solutions</p>
          <ul className="mt-2 space-y-1">
            {solutionLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={closeAll} className="block rounded-lg px-2 py-2 text-sm text-[#141433] hover:bg-[#fde8e9]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-4 space-y-1 border-t border-[#eceef3] pt-3">
            {pageLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={closeAll} className="block rounded-lg px-2 py-2 text-sm text-[#141433] hover:bg-[#fde8e9]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}

function MenuButton({
  label,
  menuId,
  expanded,
  onToggle,
  items,
  onNavigate,
}: {
  label: string
  menuId: string
  expanded: boolean
  onToggle: () => void
  items: { href: string; label: string }[]
  onNavigate: () => void
}) {
  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-md text-sm text-zinc-600 hover:text-[#141433] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141433]"
        aria-expanded={expanded}
        aria-controls={menuId}
        onClick={onToggle}
      >
        {label}
        <span aria-hidden="true" className={cn("text-[10px] transition-transform", expanded && "rotate-180")}>
          ▾
        </span>
      </button>
      {expanded ? (
        <div
          id={menuId}
          role="region"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+10px)] z-40 min-w-[220px] rounded-xl border border-[#eceef3] bg-white p-1.5 shadow-[0_12px_30px_-12px_rgba(20,20,51,0.18)]"
        >
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className="block rounded-lg px-3 py-2 text-sm text-[#141433] hover:bg-[#fde8e9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f2545b]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
