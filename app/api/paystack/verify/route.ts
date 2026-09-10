import { NextResponse } from "next/server"
import { getPaymentProvider } from "@/lib/payments"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const reference = searchParams.get("reference")
  if (!reference) {
    return NextResponse.json({ error: "reference is required" }, { status: 400 })
  }

  try {
    const provider = getPaymentProvider("paystack")
    const result = await provider.verify(reference)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Verify failed" },
      { status: 500 },
    )
  }
}
