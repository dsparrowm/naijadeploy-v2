"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthFrame } from "@/components/auth/auth-frame"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppStore } from "@/lib/store/app-store"

export default function LoginPage() {
  const router = useRouter()
  const { login, projects } = useAppStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    login({ email })
    router.push(projects.length > 0 ? "/dashboard" : "/connect")
  }

  return (
    <AuthFrame
      title="Log in"
      description="Sign in to deploy or manage projects."
      footer={
        <>
          No account?{" "}
          <Link href="/signup" className="text-foreground hover:underline">
            Sign up
          </Link>
        </>
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
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-[13px]">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-[13px] text-muted-foreground hover:text-foreground">
            Forgot password
          </Link>
        </div>
        <Button type="submit" className="w-full">
          Log in
        </Button>
      </form>
    </AuthFrame>
  )
}
