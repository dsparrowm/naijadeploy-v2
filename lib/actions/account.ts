"use server"

import { eq } from "drizzle-orm"
import { getServerSession } from "@/lib/auth-session"
import { getDb } from "@/lib/db"
import { user } from "@/lib/db/schema"

export async function setTwoFactorEnabled(enabled: boolean) {
  const session = await getServerSession()
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  await getDb()
    .update(user)
    .set({ twoFactorEnabled: enabled, updatedAt: new Date() })
    .where(eq(user.id, session.user.id))
}
