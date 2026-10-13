import { cache } from "react"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import type { User } from "@/lib/store/types"

export const getServerSession = cache(async () => {
  try {
    return await auth.api.getSession({ headers: await headers() })
  } catch (error) {
    console.error("session lookup failed", error)
    return null
  }
})

export async function getSessionUser(): Promise<User | null> {
  const session = await getServerSession()
  if (!session?.user) return null
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    twoFactorEnabled: Boolean(session.user.twoFactorEnabled),
    image: session.user.image,
  }
}
