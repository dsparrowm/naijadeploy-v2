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
- Auth is Better Auth: email and password, plus GitHub OAuth when `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set. The deploy pipeline is still a stub. `{project}.naijadeploy.app` is a **demo/stub URL**, not live hosting — labeled with a Demo chip.

## Local database and auth

Accounts, sessions, projects, deployments, env vars, and the plan live in Postgres. Auth is [Better Auth](https://better-auth.com) (email and password, plus GitHub OAuth when the client id and secret are set).

1. Create a Postgres database. [Neon](https://neon.tech) works: new project, then copy the **pooled** connection string into `DATABASE_URL` and the **direct** string into `DATABASE_URL_UNPOOLED` (migrations use the direct string when it is set). A local database is fine too, for example `postgresql://naijadeploy:naijadeploy@127.0.0.1:5432/naijadeploy`.
2. Copy `.env.example` to `.env.local`.
3. Set `BETTER_AUTH_SECRET` (`openssl rand -base64 32`) and `BETTER_AUTH_URL` (local: `http://localhost:3000`). On Vercel, set `BETTER_AUTH_URL` to the deployment origin or GitHub sign-in will redirect to the wrong host.
4. Optional GitHub sign-in: create a GitHub **OAuth App** with callback `{BETTER_AUTH_URL}/api/auth/callback/github`, then set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`. Email and password work without these.
5. Optional password-reset email: set `RESEND_API_KEY` and `RESEND_FROM`. In development, with no Resend key, the reset link is printed in the server log.
6. Apply the schema: `npm run db:migrate`.

Do not commit `.env.local` or any real secret. `.env.example` only lists empty names.

## Environment

Copy `.env.example` to `.env.local`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | **Yes, to sign in** | Neon pooled URL, or any Postgres URL. |
| `DATABASE_URL_UNPOOLED` | No | Direct Neon URL for `npm run db:migrate` when the pooler blocks it. |
| `BETTER_AUTH_SECRET` | **Yes, in production** | Signs session cookies. `openssl rand -base64 32`. |
| `BETTER_AUTH_URL` | **Yes, for OAuth** | Public origin, no trailing path. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | No | GitHub OAuth App. Empty → email/password only. |
| `ENV_ENCRYPTION_KEY` | No, until env vars are saved | 32-byte base64 AES-256-GCM key. |
| `RESEND_API_KEY` / `RESEND_FROM` | No | Password reset mail. Dev without it logs the link. |
| `PAYSTACK_SECRET_KEY` | No | Live initialize/verify. Empty → demo checkout. |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | No | Reserved for a future inline Paystack.js flow. |
| `NEXT_PUBLIC_APP_URL` | **Required on hosted preview** | Paystack callback base (e.g. the Vercel preview URL). Defaults to `http://localhost:3000` locally. Without this on a hosted preview, live Paystack redirects back to localhost. |

Without keys, **Upgrade → Pay ₦7,500 with Paystack** opens an in-app demo checkout. Use **Pay ₦7,500** or **Simulate decline**.

## Routes

- Auth: `/signup` `/login` `/2fa` (skippable) `/forgot-password` `/check-email` `/reset-password`
- Deploy: `/connect` `/deploy/configure` `/deploy/[id]` `/deploy/[id]/live` `/deploy/[id]/failed`
- Billing: `/upgrade` `/checkout` `/payment/success` `/payment/failed` `/billing`
- Shell: `/dashboard` `/domains` `/settings`
- Force a failed deploy from configure: `/deploy/configure?fail=1`

The account session is a Better Auth cookie. Projects, invoices, the deploy draft, and the plan are loaded from Postgres on each request. The plan changes only after a server-side Paystack verify, or after the signed-in user authorizes a demo checkout — the browser cannot set it. Dashboard, billing, domains, settings, connect, deploy, upgrade, checkout, and payment routes require a session. Clearing browser storage does not remove projects; sign in on another device with the same account to see them.
