import { PRO_PLAN } from "@/lib/config"
import type {
  InitializePaymentInput,
  InitializePaymentResult,
  PaymentProvider,
  VerifyPaymentResult,
} from "@/lib/payments/types"

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

function secretKey() {
  return process.env.PAYSTACK_SECRET_KEY?.trim() || ""
}

export class PaystackProvider implements PaymentProvider {
  readonly id = "paystack" as const
  readonly displayName = "Paystack"

  async initialize(input: InitializePaymentInput): Promise<InitializePaymentResult> {
    const amountKobo = input.amountKobo || PRO_PLAN.amountKobo
    const reference = `nd_pro_${Date.now()}`
    const secret = secretKey()

    if (!secret) {
      const params = new URLSearchParams({
        reference,
        email: input.email,
        amount: String(amountKobo),
      })
      return {
        provider: this.id,
        demo: true,
        authorizationUrl: `/checkout?${params.toString()}`,
        reference,
        amountKobo,
      }
    }

    const callbackUrl = `${appUrl()}${input.callbackPath || "/payment/success"}`
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        amount: amountKobo,
        currency: "NGN",
        reference,
        callback_url: callbackUrl,
        metadata: { plan: input.plan, product: "naijaDeploy" },
      }),
    })

    const payload = (await response.json()) as {
      status: boolean
      message?: string
      data?: { authorization_url: string; reference: string }
    }

    if (!response.ok || !payload.status || !payload.data) {
      throw new Error(payload.message || "Paystack initialize failed")
    }

    return {
      provider: this.id,
      demo: false,
      authorizationUrl: payload.data.authorization_url,
      reference: payload.data.reference,
      amountKobo,
    }
  }

  async verify(reference: string): Promise<VerifyPaymentResult> {
    const secret = secretKey()
    const amountKobo = PRO_PLAN.amountKobo

    if (!secret) {
      return {
        provider: this.id,
        demo: true,
        reference,
        status: "failed",
        amountKobo,
      }
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
      },
    )
    const payload = (await response.json()) as {
      status: boolean
      data?: { status?: string; amount?: number }
    }

    const paid = payload.status && payload.data?.status === "success"
    return {
      provider: this.id,
      demo: false,
      reference,
      status: paid ? "success" : "failed",
      amountKobo: payload.data?.amount ?? amountKobo,
    }
  }
}
