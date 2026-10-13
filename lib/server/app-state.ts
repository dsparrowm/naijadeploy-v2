import "server-only"
import { getSessionUser } from "@/lib/auth-session"
import { listInvoices, readPlan } from "@/lib/server/billing"
import { readDraft } from "@/lib/server/drafts"
import { listProjects } from "@/lib/server/projects"
import { emptyAppState, type AppState } from "@/lib/store/types"

export async function loadAppState(): Promise<AppState> {
  try {
    const user = await getSessionUser()
    if (!user) return emptyAppState
    const [plan, projects, invoices, draft] = await Promise.all([
      readPlan(user.id),
      listProjects(user.id),
      listInvoices(user.id),
      readDraft(user.id),
    ])
    return { user, plan, projects, invoices, draft }
  } catch (error) {
    console.error("loadAppState failed", error)
    return emptyAppState
  }
}
