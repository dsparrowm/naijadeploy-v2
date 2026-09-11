"use client"

import Link from "next/link"
import { AuthFrame } from "@/components/auth/auth-frame"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store/app-store"

export default function CheckEmailPage() {
  const { resetEmail } = useAppStore()

  return (
    <AuthFrame
      title="Check your email"
      description={
        resetEmail
          ? `We sent a password reset link to ${resetEmail}.`
          : "We sent a password reset link if that account exists."
      }
    >
      <p className="text-[13px] text-muted-foreground">
        The link expires in 30 minutes. Check spam if you don’t see it.
      </p>
      <Button asChild className="mt-6 w-full">
        <Link href="/login">Back to log in</Link>
      </Button>
    </AuthFrame>
  )
}
