"use client"

import { type FormEvent, Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthFrame } from "@/components/auth/auth-frame"
import { OauthRow, OrDivider } from "@/components/brand/oauth-row"
import { Field } from "@/components/chrome/surface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard"
  return value
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  )
}

function LoginInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [oauthHint, setOauthHint] = useState<string | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const nextEmail = String(data.get("email") || email).trim()
    const nextPassword = String(data.get("password") || password)
    if (!nextEmail || !nextPassword) return
    setPending(true)
    setError(null)
    const result = await authClient.signIn.email({
      email: nextEmail,
      password: nextPassword,
      callbackURL: safeNext(searchParams.get("next")),
    })
    if (result.error) {
      setError(result.error.message || "Could not sign in")
      setPending(false)
      return
    }
    router.push(safeNext(searchParams.get("next")))
    router.refresh()
  }

  async function signInWithGithub() {
    setOauthHint(null)
    const result = await authClient.signIn.social({
      provider: "github",
      callbackURL: safeNext(searchParams.get("next")),
    })
    if (result.error) {
      setOauthHint("GitHub sign-in is not configured. Use email and password.")
    }
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
      <OauthRow onGithub={() => void signInWithGithub()} onGitlab={() => setOauthHint("GitLab connect is a stub. Use GitHub or email.")} />
      <div className="my-4">
        <OrDivider />
      </div>
      {oauthHint ? <p className="mb-3 text-[12px] text-muted-foreground">{oauthHint}</p> : null}
      <form onSubmit={onSubmit} action="#" method="post" className="space-y-3.5">
        <Field label="Email">
          <Input
            id="email"
            name="email"
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
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </Field>
        {error ? <p className="text-[13px] text-destructive">{error}</p> : null}
        <Button type="submit" size="lg" className="mt-1 w-full" disabled={pending}>
          Sign In
        </Button>
      </form>
    </AuthFrame>
  )
}
