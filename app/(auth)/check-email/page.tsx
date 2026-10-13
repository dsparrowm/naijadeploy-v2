"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AuthFrame } from "@/components/auth/auth-frame"
import { OutcomeIcon } from "@/components/brand/outcome-icon"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export default function CheckEmailPage() {
  return (
    <Suspense>
      <CheckEmailInner />
    </Suspense>
  )
}

function CheckEmailInner() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [resent, setResent] = useState(false)
  const [pending, setPending] = useState(false)

  async function resend() {
    if (!email || pending) return
    setPending(true)
    await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    })
    setPending(false)
    setResent(true)
  }

  return (
    <AuthFrame
      icon={<OutcomeIcon kind="mail" />}
      title="Check your email"
      description={
        <>
          We sent a password reset link to
          <span className="mt-1.5 block text-[14px] font-medium text-foreground">
            {email || "your inbox"}
          </span>
        </>
      }
    >
      <p className="text-[13px] text-muted-foreground">
        The link expires in one hour. Check spam if you don’t see it.
      </p>
      <Button type="button" size="lg" className="mt-6 w-full" onClick={() => void resend()} disabled={pending}>
        {resent ? "Link resent" : "Resend email"}
      </Button>
      <Button asChild variant="ghost" className="mt-2 w-full">
        <Link href="/login">Back to Sign In</Link>
      </Button>
    </AuthFrame>
  )
}
