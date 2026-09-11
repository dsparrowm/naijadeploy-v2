import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="border-t border-border bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[7px] border border-border bg-card p-8 sm:p-12">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mb-3 text-2xl font-semibold tracking-tight text-foreground">
              Deploy to Lagos Edge
            </h2>
            <p className="mb-6 text-[13px] text-muted-foreground">
              First project is FREE. Upgrade to Pro for ₦7,500/mo via Paystack.
            </p>
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Start free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Log in</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
