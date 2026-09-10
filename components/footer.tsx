import Link from "next/link"
import { Logo } from "@/components/brand/logo"

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Dashboard", href: "/dashboard" },
  ],
  Account: [
    { name: "Log in", href: "/login" },
    { name: "Sign up", href: "/signup" },
    { name: "Billing", href: "/billing" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-[13px] text-muted-foreground">
              Deploy from Git to Lagos Edge. Pay in Naira with Paystack.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-[13px] font-medium text-foreground">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-muted-foreground hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} naijaDeploy</p>
        </div>
      </div>
    </footer>
  )
}
