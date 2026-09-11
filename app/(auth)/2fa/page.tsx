"use client"

import { type FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthFrame } from "@/components/auth/auth-frame"
import { QrStub } from "@/components/brand/qr-stub"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useAppStore } from "@/lib/store/app-store"

const SECRET = "ND-2FA-7K4M-QP2X"

export default function TwoFactorPage() {
  const router = useRouter()
  const { setTwoFactor } = useAppStore()
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
      title="Set up two-factor authentication"
      description="Scan this QR code with Google Authenticator, 1Password, or Authy. Then enter the 6-digit code."
    >
      <div className="flex justify-center">
        <QrStub label={SECRET} />
      </div>
      <p className="mt-3 text-center text-[12px] text-muted-foreground">
        Can’t scan? Use this secret
        <span className="mt-1 block font-mono text-[13px] tracking-wider text-foreground">{SECRET}</span>
      </p>
      <form onSubmit={enable} className="mt-5 space-y-4">
        <InputOTP maxLength={6} value={code} onChange={setCode} autoComplete="one-time-code">
          <InputOTPGroup className="w-full justify-between gap-1.5">
            {Array.from({ length: 6 }, (_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="h-10 w-10 rounded-[7px] border border-border bg-background text-[13px] font-medium shadow-none first:rounded-[7px] first:border-l last:rounded-[7px] data-[active=true]:border-primary data-[active=true]:ring-1 data-[active=true]:ring-primary/40"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <Button type="submit" size="lg" className="w-full" disabled={code.length < 6}>
          Verify and Enable
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
