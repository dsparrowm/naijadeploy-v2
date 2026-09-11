# naijaDeploy

Next.js 16 vertical slice: auth → connect Git → configure (Lagos Edge) → deploy → live `{project}.naijadeploy.app` → Paystack Pro.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Product lock (v1)

| Plan | Price | Notes |
| --- | --- | --- |
| Free | ₦0 | 1 project, 10GB, 512MB, Lagos Edge. First deploy shows **FREE** — never a paid estimate. |
| Pro | ₦7,500/mo | Paystack only. Amount in kobo: `750000`. |
| Scale | ₦25,000/mo | Stub. Not checkoutable. |

- Pricing gate: `freeDeployPaidScale`
- Payment provider: Paystack (`lib/payments`). Thin `PaymentProvider` interface for a later rail. Flutterwave is not implemented.
- Databases: sidebar **Coming soon** only.
- Refer & Earn: out of scope — not scaffolded.
- Auth and the deploy pipeline are session/UI stubs so the path works end-to-end without GitHub or a host. `{project}.naijadeploy.app` is a **demo/stub URL**, not live hosting — labeled with a Demo chip.

## Environment

Copy `.env.example` to `.env.local`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `PAYSTACK_SECRET_KEY` | No | Live initialize/verify. Empty → demo checkout. |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | No | Reserved for a future inline Paystack.js flow. |
| `NEXT_PUBLIC_APP_URL` | **Required on hosted preview** | Paystack callback base (e.g. the Vercel preview URL). Defaults to `http://localhost:3000` locally. Without this on a hosted preview, live Paystack redirects back to localhost. |

Without keys, **Upgrade → Pay ₦7,500 with Paystack** opens an in-app demo checkout. Use **Pay ₦7,500** or **Simulate decline**.

## Routes

- Auth: `/signup` `/login` `/2fa` (skippable) `/forgot-password` `/check-email`
- Deploy: `/connect` `/deploy/configure` `/deploy/[id]` `/deploy/[id]/live` `/deploy/[id]/failed`
- Billing: `/upgrade` `/checkout` `/payment/success` `/payment/failed` `/billing`
- Shell: `/dashboard` `/domains` `/settings`
- Force a failed deploy from configure: `/deploy/configure?fail=1`

Session state is stored in `localStorage` (`naijadeploy.session.v1`).
