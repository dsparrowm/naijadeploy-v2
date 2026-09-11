"use client"

import { type FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthFrame } from "@/components/auth/auth-frame"
import { OauthRow, OrDivider } from "@/components/brand/oauth-row"
import { Field } from "@/components/chrome/surface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store/app-store"

export default function LoginPage() {
  const router = useRouter()
  const { login, projects } = useAppStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [oauthHint, setOauthHint] = useState(false)

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    login({ email })
    router.push(projects.length > 0 ? "/dashboard" : "/connect")
  }

  return (
    <AuthFrame
      title="Sign In"
      description="Welcome back. Deploy from Lagos Edge."
      footer={
        <>
          No account?{" "}
          <Link href="/signup" className="text-foreground hover:underline">
            Create one (Free)
          </Link>
        </>
      }
    >
      <OauthRow onStub={() => setOauthHint(true)} />
      <div className="my-4">
        <OrDivider />
      </div>
      {oauthHint ? (
        <p className="mb-3 text-[12px] text-muted-foreground">
          GitHub/GitLab are stubs. Use any email — password is not verified.
        </p>
      ) : (
        <p className="mb-3 text-[12px] text-muted-foreground">Demo stub — any email works. Password is not verified.</p>
      )}
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
        <Field
          label="Password"
          action={
            <Link href="/forgot-password" className="text-[13px] text-primary hover:underline">
              Forgot password?
            </Link>
          }
        >
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </Field>
        <Button type="submit" size="lg" className="mt-1 w-full">
          Sign In
        </Button>
      </form>
    </AuthFrame>
  )
}
