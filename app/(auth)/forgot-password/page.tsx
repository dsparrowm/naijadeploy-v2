"use client"

import { type FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthFrame } from "@/components/auth/auth-frame"
import { Field } from "@/components/chrome/surface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setError(null)
    const result = await authClient.requestPasswordReset({
      email: email.trim(),
      redirectTo: "/reset-password",
    })
    if (result.error) {
      setError(result.error.message || "Could not send the reset link")
      setPending(false)
      return
    }
    router.push(`/check-email?email=${encodeURIComponent(email.trim())}`)
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
        {error ? <p className="text-[13px] text-destructive">{error}</p> : null}
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          Send reset link
        </Button>
      </form>
    </AuthFrame>
  )
}
