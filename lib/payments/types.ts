export type PaymentProviderId = "paystack"

export type InitializePaymentInput = {
  email: string
  amountKobo: number
  plan: "pro"
  callbackPath?: string
}

export type InitializePaymentResult = {
  provider: PaymentProviderId
  demo: boolean
  authorizationUrl: string
  reference: string
  amountKobo: number
}

export type VerifyPaymentResult = {
  provider: PaymentProviderId
  demo: boolean
  reference: string
  status: "success" | "failed"
  amountKobo: number
}

export interface PaymentProvider {
  readonly id: PaymentProviderId
  readonly displayName: string
  initialize(input: InitializePaymentInput): Promise<InitializePaymentResult>
  verify(reference: string): Promise<VerifyPaymentResult>
}
