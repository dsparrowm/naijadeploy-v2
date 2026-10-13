import { relations } from "drizzle-orm"
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

/**
 * Auth tables match Better Auth 1.7 Drizzle output (snake_case columns,
 * camelCase fields). Regenerate with `npx @better-auth/cli generate` only
 * after checking the diff — do not let it overwrite the app tables below.
 */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
})

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
)

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
)

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
)

export const project = pgTable(
  "project",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    repoFullName: text("repo_full_name").notNull(),
    branch: text("branch").notNull(),
    region: text("region").notNull().default("lagos-edge"),
    url: text("url").notNull(),
    status: text("status").notNull(),
    stage: text("stage"),
    framework: text("framework"),
    commitSha: text("commit_sha"),
    failReason: text("fail_reason"),
    retryUsed: boolean("retry_used").notNull().default(false),
    rootDirectory: text("root_directory"),
    buildCommand: text("build_command"),
    outputDirectory: text("output_directory"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("project_user_slug_idx").on(table.userId, table.slug),
    index("project_userId_idx").on(table.userId),
  ],
)

export const deployment = pgTable(
  "deployment",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    status: text("status").notNull(),
    stage: text("stage"),
    commitSha: text("commit_sha"),
    failReason: text("fail_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("deployment_projectId_idx").on(table.projectId)],
)

/**
 * Values are AES-256-GCM ciphertext. `ENV_ENCRYPTION_KEY` is the master key.
 * The dashboard UI that writes these lands in a later change.
 */
export const envVar = pgTable(
  "env_var",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    valueCiphertext: text("value_ciphertext").notNull(),
    iv: text("iv").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("env_var_project_key_idx").on(table.projectId, table.key)],
)

export const subscription = pgTable(
  "subscription",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" })
      .unique(),
    plan: text("plan").notNull().default("free"),
    status: text("status").notNull().default("active"),
    provider: text("provider").notNull().default("none"),
    providerReference: text("provider_reference"),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("subscription_userId_idx").on(table.userId)],
)

export const invoice = pgTable(
  "invoice",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    number: text("number").notNull(),
    description: text("description").notNull(),
    amountKobo: integer("amount_kobo").notNull(),
    status: text("status").notNull(),
    provider: text("provider").notNull().default("paystack"),
    reference: text("reference"),
    issuedAt: timestamp("issued_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("invoice_userId_idx").on(table.userId),
    uniqueIndex("invoice_reference_status_idx").on(table.reference, table.status),
  ],
)

export const deployDraft = pgTable("deploy_draft", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  repoFullName: text("repo_full_name").notNull(),
  projectName: text("project_name").notNull(),
  slug: text("slug").notNull(),
  branch: text("branch").notNull(),
  region: text("region").notNull(),
  framework: text("framework"),
  buildCommand: text("build_command"),
  outputDirectory: text("output_directory"),
  branches: text("branches").array().notNull(),
  simulateFailure: boolean("simulate_failure").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const checkoutIntent = pgTable(
  "checkout_intent",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    reference: text("reference").notNull().unique(),
    email: text("email").notNull(),
    amountKobo: integer("amount_kobo").notNull(),
    plan: text("plan").notNull(),
    demo: boolean("demo").notNull(),
    status: text("status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("checkout_intent_userId_idx").on(table.userId)],
)

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  projects: many(project),
  subscription: one(subscription, {
    fields: [user.id],
    references: [subscription.userId],
  }),
  invoices: many(invoice),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const projectRelations = relations(project, ({ one, many }) => ({
  user: one(user, {
    fields: [project.userId],
    references: [user.id],
  }),
  deployments: many(deployment),
  envVars: many(envVar),
}))

export const deploymentRelations = relations(deployment, ({ one }) => ({
  project: one(project, {
    fields: [deployment.projectId],
    references: [project.id],
  }),
}))

export const envVarRelations = relations(envVar, ({ one }) => ({
  project: one(project, {
    fields: [envVar.projectId],
    references: [project.id],
  }),
}))

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  user: one(user, {
    fields: [subscription.userId],
    references: [user.id],
  }),
}))

export const invoiceRelations = relations(invoice, ({ one }) => ({
  user: one(user, {
    fields: [invoice.userId],
    references: [user.id],
  }),
}))

export const authSchema = {
  user,
  session,
  account,
  verification,
}
