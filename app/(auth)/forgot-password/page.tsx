"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthFrame } from "@/components/auth/auth-frame"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppStore } from "@/lib/store/app-store"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { setResetEmail } = useAppStore()
  const [email, setEmail] = useState("")

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setResetEmail(email)
    router.push("/check-email")
  }

  return (
    <AuthFrame
      title="Reset password"
      description="We’ll send a reset link if the account exists."
      footer={
        <Link href="/login" className="text-foreground hover:underline">
          Back to log in
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[13px]">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <Button type="submit" className="mt-2 w-full">
          Send reset link
        </Button>
      </form>
    </AuthFrame>
  )
}
