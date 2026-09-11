"use client"

import { type FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthFrame } from "@/components/auth/auth-frame"
import { Field } from "@/components/chrome/surface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store/app-store"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { setResetEmail } = useAppStore()
  const [email, setEmail] = useState("")

  function onSubmit(event: FormEvent) {
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
          Back to Sign In
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-3.5">
        <Field label="Email">
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@startup.ng"
          />
        </Field>
        <Button type="submit" size="lg" className="w-full">
          Send reset link
        </Button>
      </form>
    </AuthFrame>
  )
}
