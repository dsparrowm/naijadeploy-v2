"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { FREE_PLAN, PRO_PLAN, projectUrl, toSlug } from "@/lib/config"
import type { AppState, DraftDeploy, Invoice, PlanId, Project, User } from "@/lib/store/types"

const STORAGE_KEY = "naijadeploy.session.v1"

const emptyState: AppState = {
  user: null,
  plan: "free",
  projects: [],
  invoices: [],
  draft: null,
  resetEmail: null,
}

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

type AppStore = AppState & {
  ready: boolean
  signup: (input: { name: string; email: string }) => void
  login: (input: { email: string }) => void
  logout: () => void
  setTwoFactor: (enabled: boolean) => void
  setResetEmail: (email: string) => void
  setDraft: (draft: DraftDeploy | null) => void
  canCreateFreeProject: boolean
  createProject: (input: DraftDeploy & { fail?: boolean }) => Project
  updateProject: (id: string, patch: Partial<Project>) => void
  retryDeploy: (id: string) => Project | null
  upgradeToPro: (reference: string) => void
  recordFailedPayment: (reference: string) => void
  keepFree: () => void
}

const AppStoreContext = createContext<AppStore | null>(null)

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(emptyState)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as AppState
        setState({ ...emptyState, ...parsed })
      }
    } catch {
      setState(emptyState)
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [ready, state])

  const signup = useCallback((input: { name: string; email: string }) => {
    const user: User = {
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      twoFactorEnabled: false,
    }
    setState((prev) => ({ ...prev, user, resetEmail: null }))
  }, [])

  const login = useCallback((input: { email: string }) => {
    const email = input.email.trim().toLowerCase()
    setState((prev) => ({
      ...prev,
      user: prev.user?.email === email
        ? prev.user
        : { name: email.split("@")[0] || "Developer", email, twoFactorEnabled: false },
    }))
  }, [])

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, user: null, draft: null }))
  }, [])

  const setTwoFactor = useCallback((enabled: boolean) => {
    setState((prev) =>
      prev.user ? { ...prev, user: { ...prev.user, twoFactorEnabled: enabled } } : prev,
    )
  }, [])

  const setResetEmail = useCallback((email: string) => {
    setState((prev) => ({ ...prev, resetEmail: email }))
  }, [])

  const setDraft = useCallback((draft: DraftDeploy | null) => {
    setState((prev) => ({ ...prev, draft }))
  }, [])

  const canCreateFreeProject = state.plan === "pro" || state.projects.length < FREE_PLAN.projects

  const createProject = useCallback((input: DraftDeploy & { fail?: boolean }) => {
    const now = new Date().toISOString()
    const slug = toSlug(input.slug || input.projectName)
    const project: Project = {
      id: newId("prj"),
      name: input.projectName,
      slug,
      repoFullName: input.repoFullName,
      branch: input.branch,
      region: "lagos-edge",
      url: projectUrl(slug),
      status: input.fail ? "failed" : "queued",
      stage: input.fail ? "build" : "build",
      createdAt: now,
      updatedAt: now,
      retryUsed: false,
      failReason: input.fail ? "Build failed: install exited with code 1" : undefined,
    }
    setState((prev) => ({
      ...prev,
      draft: input,
      projects: [project, ...prev.projects.filter((item) => item.id !== project.id)],
    }))
    return project
  }, [])

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((project) =>
        project.id === id
          ? { ...project, ...patch, updatedAt: new Date().toISOString() }
          : project,
      ),
    }))
  }, [])

  const retryDeploy = useCallback((id: string) => {
    let next: Project | null = null
    setState((prev) => {
      const projects = prev.projects.map((project) => {
        if (project.id !== id) return project
        next = {
          ...project,
          status: "queued",
          stage: "build",
          retryUsed: true,
          failReason: undefined,
          updatedAt: new Date().toISOString(),
        }
        return next
      })
      return { ...prev, projects }
    })
    return next
  }, [])

  const upgradeToPro = useCallback((reference: string) => {
    const invoice: Invoice = {
      id: newId("inv"),
      number: `ND-${new Date().getFullYear()}-0001`,
      issuedAt: new Date().toISOString(),
      description: `Pro · monthly · ${reference}`,
      amountKobo: PRO_PLAN.amountKobo,
      status: "paid",
      provider: "paystack",
    }
    setState((prev) => {
      const alreadyPaid = prev.invoices.some(
        (item) => item.status === "paid" && item.amountKobo === PRO_PLAN.amountKobo,
      )
      return {
        ...prev,
        plan: "pro" as PlanId,
        invoices: alreadyPaid
          ? prev.invoices
          : [invoice, ...prev.invoices.filter((item) => item.status !== "failed")],
      }
    })
  }, [])

  const recordFailedPayment = useCallback((reference: string) => {
    const invoice: Invoice = {
      id: newId("inv"),
      number: `ND-${new Date().getFullYear()}-FAIL`,
      issuedAt: new Date().toISOString(),
      description: `Pro checkout · ${reference}`,
      amountKobo: PRO_PLAN.amountKobo,
      status: "failed",
      provider: "paystack",
    }
    setState((prev) => ({
      ...prev,
      invoices: [invoice, ...prev.invoices.filter((item) => item.status !== "failed")],
    }))
  }, [])

  const keepFree = useCallback(() => {
    setState((prev) => ({
      ...prev,
      plan: "free",
    }))
  }, [])

  const value = useMemo<AppStore>(
    () => ({
      ...state,
      ready,
      signup,
      login,
      logout,
      setTwoFactor,
      setResetEmail,
      setDraft,
      canCreateFreeProject,
      createProject,
      updateProject,
      retryDeploy,
      upgradeToPro,
      recordFailedPayment,
      keepFree,
    }),
    [
      state,
      ready,
      signup,
      login,
      logout,
      setTwoFactor,
      setResetEmail,
      setDraft,
      canCreateFreeProject,
      createProject,
      updateProject,
      retryDeploy,
      upgradeToPro,
      recordFailedPayment,
      keepFree,
    ],
  )

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider")
  return ctx
}
