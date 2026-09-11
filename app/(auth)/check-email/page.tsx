"use client"

import { useState } from "react"
import Link from "next/link"
import { AuthFrame } from "@/components/auth/auth-frame"
import { OutcomeIcon } from "@/components/brand/outcome-icon"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store/app-store"

export default function CheckEmailPage() {
  const { resetEmail } = useAppStore()
  const [resent, setResent] = useState(false)

  return (
    <AuthFrame
      icon={<OutcomeIcon kind="mail" />}
      title="Check your email"
      description="We sent a password reset link to"
    >
      <p className="text-[14px] font-medium text-foreground">
        {resetEmail || "your inbox"}
      </p>
      <p className="mt-3 text-[13px] text-muted-foreground">
        The link expires in 30 minutes. Check spam if you don’t see it.
      </p>
      <Button
        type="button"
        size="lg"
        className="mt-6 w-full"
        onClick={() => setResent(true)}
      >
        {resent ? "Link resent" : "Resend email"}
      </Button>
      <Button asChild variant="ghost" className="mt-2 w-full">
        <Link href="/login">Back to Sign In</Link>
      </Button>
    </AuthFrame>
  )
}
