import { DEFAULT_PAYMENT_PROVIDER } from "@/lib/config"
import { PaystackProvider } from "@/lib/payments/paystack"
import type { PaymentProvider, PaymentProviderId } from "@/lib/payments/types"

const providers: Record<PaymentProviderId, PaymentProvider> = {
  paystack: new PaystackProvider(),
}

export function getPaymentProvider(
  id: PaymentProviderId = DEFAULT_PAYMENT_PROVIDER,
): PaymentProvider {
  return providers[id] ?? providers.paystack
}

export { PaystackProvider }
export type { PaymentProvider, PaymentProviderId } from "@/lib/payments/types"
