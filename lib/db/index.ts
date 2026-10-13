import { neon } from "@neondatabase/serverless"
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http"
import { drizzle as drizzlePg, type NodePgDatabase } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "@/lib/db/schema"

export type Database = NodePgDatabase<typeof schema>

const globalForDb = globalThis as unknown as { naijadeployDb?: Database }

function isNeonUrl(url: string) {
  return /neon\.tech/i.test(url)
}

/**
 * Neon hosts use the HTTP driver (works on Vercel, supports the queries
 * Better Auth issues with transactions left off). Any other Postgres URL,
 * including local, uses `pg`.
 */
export function createDatabase(connectionString = process.env.DATABASE_URL): Database {
  if (connectionString && isNeonUrl(connectionString)) {
    const sql = neon(connectionString)
    return drizzleNeon(sql, { schema }) as unknown as Database
  }

  const pool = new Pool({
    connectionString: connectionString || "postgres://127.0.0.1:5432/postgres",
    max: 5,
  })
  return drizzlePg(pool, { schema })
}

export function getDb(): Database {
  if (!globalForDb.naijadeployDb) {
    globalForDb.naijadeployDb = createDatabase()
  }
  return globalForDb.naijadeployDb
}

export { schema }
