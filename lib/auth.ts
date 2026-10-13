import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { getDb } from "@/lib/db"
import { authSchema, subscription } from "@/lib/db/schema"
import { sendPasswordResetEmail } from "@/lib/email/password-reset"

const githubClientId = process.env.GITHUB_CLIENT_ID
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET
const githubEnabled = Boolean(githubClientId && githubClientSecret)

/**
 * `next build` evaluates this module with NODE_ENV=production. Better Auth
 * rejects its default secret in production, so the build uses a placeholder
 * that is never a valid runtime secret.
 */
function authSecret() {
  if (process.env.BETTER_AUTH_SECRET) return process.env.BETTER_AUTH_SECRET
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return "build-placeholder-secret-not-for-sessions"
  }
  return undefined
}

export const auth = betterAuth({
  appName: "naijaDeploy",
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL,
  secret: authSecret(),
  trustedOrigins: [process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_APP_URL].filter(
    (value): value is string => Boolean(value),
  ),
  database: drizzleAdapter(getDb(), {
    provider: "pg",
    schema: authSchema,
    // Neon HTTP does not run interactive transactions. Sequential writes are the default.
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ to: user.email, url })
    },
  },
  socialProviders: githubEnabled
    ? {
        github: {
          clientId: githubClientId as string,
          clientSecret: githubClientSecret as string,
        },
      }
    : undefined,
  user: {
    additionalFields: {
      twoFactorEnabled: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (created) => {
          try {
            await getDb()
              .insert(subscription)
              .values({
                id: crypto.randomUUID(),
                userId: created.id,
                plan: "free",
                status: "active",
                provider: "none",
              })
              .onConflictDoNothing({ target: subscription.userId })
          } catch (error) {
            console.error("free subscription create failed", error)
          }
        },
      },
    },
  },
  plugins: [nextCookies()],
})

export const githubOAuthEnabled = githubEnabled
