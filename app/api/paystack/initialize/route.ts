import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth-session"
import { PRO_PLAN } from "@/lib/config"
import { getPaymentProvider } from "@/lib/payments"
import { recordCheckoutIntent } from "@/lib/server/billing"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; plan?: string }
    if (!body.email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 })
    }
    if (body.plan && body.plan !== "pro") {
      return NextResponse.json({ error: "Only Pro checkout is available in v1" }, { status: 400 })
    }

    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Sign in to upgrade" }, { status: 401 })
    }

    const provider = getPaymentProvider("paystack")
    const result = await provider.initialize({
      email: body.email,
      amountKobo: PRO_PLAN.amountKobo,
      plan: "pro",
      callbackPath: "/payment/success",
    })

    await recordCheckoutIntent({
      userId: session.user.id,
      reference: result.reference,
      email: body.email,
      amountKobo: result.amountKobo,
      demo: result.demo,
    })

    return NextResponse.json({
      provider: result.provider,
      demo: result.demo,
      authorizationUrl: result.authorizationUrl,
      reference: result.reference,
      amountKobo: result.amountKobo,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Initialize failed" },
      { status: 500 },
    )
  }
}
