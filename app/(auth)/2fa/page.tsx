"use client"

import { type FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthFrame } from "@/components/auth/auth-frame"
import { Field } from "@/components/chrome/surface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store/app-store"

export default function TwoFactorPage() {
  const router = useRouter()
  const { setTwoFactor, user } = useAppStore()
  const [code, setCode] = useState("")

  function enable(event: FormEvent) {
    event.preventDefault()
    if (code.trim().length < 6) return
    setTwoFactor(true)
    router.push("/connect")
  }

  function skip() {
    setTwoFactor(false)
  }

  return (
    <AuthFrame
      title="Set up 2FA"
      description={
        user?.email
          ? `Optional extra step for ${user.email}. You can skip this.`
          : "Optional extra step. You can skip this."
      }
    >
      <div className="rounded-[7px] border border-border bg-background px-3 py-3">
        <p className="text-[12px] text-muted-foreground">Authenticator secret</p>
        <p className="mt-1 font-mono text-[13px] tracking-wider text-foreground">ND-2FA-7K4M-QP2X</p>
      </div>
      <form onSubmit={enable} className="mt-4 space-y-3.5">
        <Field label="Verification code">
          <Input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
          />
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={code.length < 6}>
          Enable 2FA
        </Button>
      </form>
      <Button type="button" variant="ghost" className="mt-2 w-full" asChild>
        <Link href="/connect" onClick={skip}>
          Skip for now
        </Link>
      </Button>
    </AuthFrame>
  )
}
