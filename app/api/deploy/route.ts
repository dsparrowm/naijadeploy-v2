import { NextResponse } from "next/server"
import { DEPLOY_STAGES } from "@/lib/deploy/types"
import { DEFAULT_REGION, PRICING_GATE } from "@/lib/config"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    projectId?: string
    simulateFailure?: boolean
  }

  return NextResponse.json({
    mode: "stub",
    pricingGate: PRICING_GATE,
    region: DEFAULT_REGION.id,
    projectId: body.projectId ?? null,
    stages: DEPLOY_STAGES.map((stage) => stage.id),
    simulateFailure: Boolean(body.simulateFailure),
    billed: false,
  })
}
