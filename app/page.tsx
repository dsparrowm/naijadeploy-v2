import Link from "next/link"
import { Logo } from "@/components/brand/logo"
import { SignupMarketing } from "@/components/auth/auth-frame"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-2">
      <aside className="flex flex-col border-b border-border px-8 py-6 lg:border-b-0 lg:border-r lg:px-12 lg:py-8">
        <Logo href="/" />
        <div className="flex flex-1 flex-col justify-center py-12">
          <SignupMarketing />
        </div>
        <p className="text-[12px] text-muted-foreground">© 2026 naijaDeploy</p>
      </aside>
      <main className="flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-[400px]">
          <h1 className="text-lg font-semibold text-foreground">Start on Lagos Edge</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            First deploy is free. Pay in Naira with Paystack when you need Pro.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button asChild size="lg">
              <Link href="/signup">Create Free Account</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
