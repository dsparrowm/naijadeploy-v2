"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react"
import { setTwoFactorEnabled } from "@/lib/actions/account"
import {
  authorizeDemoCheckoutAction,
  confirmCheckoutAction,
  createProjectAction,
  readPlanAction,
  recordFailedPaymentAction,
  retryProjectAction,
  saveDraftAction,
  updateProjectAction,
} from "@/lib/actions/workspace"
import { authClient } from "@/lib/auth-client"
import { FREE_PLAN } from "@/lib/config"
import { emptyAppState, type AppState, type DraftDeploy, type PlanId, type Project } from "@/lib/store/types"

let memory: AppState = emptyAppState
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function apply(next: AppState) {
  memory = next
  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): AppState {
  return memory
}

function getServerSnapshot(): AppState {
  return emptyAppState
}

type AppStore = AppState & {
  ready: boolean
  logout: () => Promise<void>
  setTwoFactor: (enabled: boolean) => Promise<void>
  setDraft: (draft: DraftDeploy | null) => Promise<void>
  authorizeCheckout: (reference: string) => Promise<boolean>
  confirmPayment: (reference: string, source: "demo" | "paystack") => Promise<"ok" | "error">
  recordFailedPayment: (reference: string) => Promise<void>
  keepFree: () => Promise<void>
  canCreateFreeProject: boolean
  createProject: (input: DraftDeploy) => Promise<Project>
  updateProject: (id: string, patch: Partial<Project>) => Promise<void>
  retryDeploy: (id: string) => Promise<Project | null>
}

const AppStoreContext = createContext<AppStore | null>(null)

function syncKey(state: AppState) {
  return JSON.stringify({
    user: state.user?.id ?? null,
    twoFactor: state.user?.twoFactorEnabled ?? false,
    name: state.user?.name ?? null,
    plan: state.plan,
    projects: state.projects.map((project) => [project.id, project.status, project.updatedAt, project.retryUsed]),
    invoices: state.invoices.map((invoice) => invoice.id),
    draft: state.draft,
  })
}

export function AppStoreProvider({
  initial,
  children,
}: {
  initial: AppState
  children: React.ReactNode
}) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [ready, setReady] = useState(false)
  const key = syncKey(initial)

  useEffect(() => {
    apply(initial)
    setReady(true)
  }, [key, initial])

  const logout = useCallback(async () => {
    await authClient.signOut()
    apply(emptyAppState)
  }, [])

  const setTwoFactor = useCallback(async (enabled: boolean) => {
    const prev = getSnapshot()
    if (!prev.user) return
    await setTwoFactorEnabled(enabled)
    apply({ ...prev, user: { ...prev.user, twoFactorEnabled: enabled } })
  }, [])

  const setDraft = useCallback(async (draft: DraftDeploy | null) => {
    const prev = getSnapshot()
    if (!draft) {
      apply({ ...prev, draft: null })
      return
    }
    const saved = await saveDraftAction(draft)
    apply({ ...getSnapshot(), draft: saved })
  }, [])

  const authorizeCheckout = useCallback(async (reference: string) => {
    return authorizeDemoCheckoutAction(reference)
  }, [])

  const confirmPayment = useCallback(async (reference: string, source: "demo" | "paystack") => {
    const result = await confirmCheckoutAction(reference, source)
    if (result.status === "ok") {
      apply({ ...getSnapshot(), plan: result.plan, invoices: result.invoices })
    }
    return result.status
  }, [])

  const recordFailedPayment = useCallback(async (reference: string) => {
    const result = await recordFailedPaymentAction(reference)
    apply({ ...getSnapshot(), plan: result.plan, invoices: result.invoices })
  }, [])

  const keepFree = useCallback(async () => {
    const plan: PlanId = await readPlanAction()
    apply({ ...getSnapshot(), plan })
  }, [])

  const createProject = useCallback(async (input: DraftDeploy) => {
    const project = await createProjectAction(input)
    const prev = getSnapshot()
    apply({
      ...prev,
      draft: { ...input, slug: project.slug },
      projects: [project, ...prev.projects.filter((item) => item.id !== project.id)],
    })
    return project
  }, [])

  const updateProject = useCallback(async (id: string, patch: Partial<Project>) => {
    const saved = await updateProjectAction(id, {
      status: patch.status,
      stage: patch.stage,
      failReason: patch.failReason,
    })
    if (!saved) return
    const prev = getSnapshot()
    apply({
      ...prev,
      projects: prev.projects.map((project) => (project.id === id ? saved : project)),
    })
  }, [])

  const retryDeploy = useCallback(async (id: string) => {
    const saved = await retryProjectAction(id)
    if (!saved) return null
    const prev = getSnapshot()
    apply({
      ...prev,
      projects: prev.projects.map((project) => (project.id === id ? saved : project)),
    })
    return saved
  }, [])

  const canCreateFreeProject = state.plan === "pro" || state.projects.length < FREE_PLAN.projects

  const value = useMemo<AppStore>(
    () => ({
      ...state,
      ready,
      logout,
      setTwoFactor,
      setDraft,
      authorizeCheckout,
      confirmPayment,
      recordFailedPayment,
      keepFree,
      canCreateFreeProject,
      createProject,
      updateProject,
      retryDeploy,
    }),
    [
      state,
      ready,
      logout,
      setTwoFactor,
      setDraft,
      authorizeCheckout,
      confirmPayment,
      recordFailedPayment,
      keepFree,
      canCreateFreeProject,
      createProject,
      updateProject,
      retryDeploy,
    ],
  )

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider")
  return ctx
}
