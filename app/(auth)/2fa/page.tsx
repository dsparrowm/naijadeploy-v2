"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthFrame } from "@/components/auth/auth-frame"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useAppStore } from "@/lib/store/app-store"

export default function TwoFactorPage() {
  const router = useRouter()
  const { setTwoFactor, user } = useAppStore()
  const [code, setCode] = useState("")

  function enable() {
    if (code.length < 6) return
    setTwoFactor(true)
    router.push("/connect")
  }

  function skip() {
    setTwoFactor(false)
    router.push("/connect")
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
      <div className="rounded-[7px] border border-border bg-card p-4">
        <p className="text-[13px] text-muted-foreground">
          Authenticator secret
        </p>
        <p className="mt-1 font-mono text-sm tracking-wider text-foreground">ND-2FA-7K4M-QP2X</p>
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-[13px] font-medium text-foreground">Verification code</p>
        <InputOTP maxLength={6} value={code} onChange={setCode}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <Button type="button" onClick={enable} disabled={code.length < 6}>
          Enable 2FA
        </Button>
        <Button type="button" variant="ghost" onClick={skip}>
          Skip for now
        </Button>
      </div>
    </AuthFrame>
  )
}
