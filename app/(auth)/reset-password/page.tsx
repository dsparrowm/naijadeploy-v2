"use client"

import { type FormEvent, Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthFrame } from "@/components/auth/auth-frame"
import { Field } from "@/components/chrome/surface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetInner />
    </Suspense>
  )
}

function ResetInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!token) {
      setError("This reset link is missing a token. Request a new one.")
      return
    }
    setPending(true)
    setError(null)
    const result = await authClient.resetPassword({
      newPassword: password,
      token,
    })
    if (result.error) {
      setError(result.error.message || "Could not reset the password")
      setPending(false)
      return
    }
    router.push("/login")
  }

  return (
    <AuthFrame
      title="Choose a new password"
      description="Use at least 8 characters."
      footer={
        <Link href="/forgot-password" className="text-foreground hover:underline">
          Request a new link
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-3.5">
        <Field label="New password">
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </Field>
        {error ? <p className="text-[13px] text-destructive">{error}</p> : null}
        <Button type="submit" size="lg" className="w-full" disabled={pending || password.length < 8}>
          Update password
        </Button>
      </form>
    </AuthFrame>
  )
}
