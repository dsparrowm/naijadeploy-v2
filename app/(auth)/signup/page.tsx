"use client"

import { type FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthFrame } from "@/components/auth/auth-frame"
import { OauthRow, OrDivider } from "@/components/brand/oauth-row"
import { Field } from "@/components/chrome/surface"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store/app-store"

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAppStore()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreed, setAgreed] = useState(true)
  const [oauthHint, setOauthHint] = useState(false)

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!agreed) return
    signup({ name, email })
    router.push("/2fa")
  }

  return (
    <AuthFrame
      variant="split"
      title="Create Free Account"
      description="Free forever for your first project. Pro from ₦7,500/mo."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-foreground hover:underline">
            Sign In
          </Link>
        </>
      }
    >
      <OauthRow onStub={() => setOauthHint(true)} />
      <div className="my-4">
        <OrDivider label="or continue with email" />
      </div>
      {oauthHint ? (
        <p className="mb-3 text-[12px] text-muted-foreground">OAuth is a stub. Continue with any email.</p>
      ) : null}
      <form onSubmit={onSubmit} className="space-y-3.5">
        <Field label="Full name">
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Emeka Adeyemi"
          />
        </Field>
        <Field label="Work email">
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="name@company.com"
          />
        </Field>
        <Field label="Password">
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
        <label className="flex items-start gap-2 text-[13px] text-muted-foreground">
          <Checkbox checked={agreed} onCheckedChange={(value) => setAgreed(value === true)} className="mt-0.5" />
          <span>
            I agree to the{" "}
            <span className="text-foreground">Terms</span> and{" "}
            <span className="text-foreground">Privacy Policy</span>.
          </span>
        </label>
        <Button type="submit" size="lg" className="w-full" disabled={!agreed}>
          Create Free Account
        </Button>
      </form>
    </AuthFrame>
  )
}
