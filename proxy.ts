import { NextResponse, type NextRequest } from "next/server"
import { auth } from "@/lib/auth"

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/billing",
  "/domains",
  "/settings",
  "/connect",
  "/deploy",
  "/upgrade",
  "/checkout",
  "/payment",
  "/2fa",
]

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!isProtected(pathname)) return NextResponse.next()

  const session = await auth.api.getSession({ headers: request.headers }).catch((error) => {
    console.error("proxy session lookup failed", error)
    return null
  })

  if (session) return NextResponse.next()

  const login = new URL("/login", request.url)
  login.searchParams.set("next", pathname)
  return NextResponse.redirect(login)
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/billing/:path*",
    "/domains/:path*",
    "/settings/:path*",
    "/connect",
    "/deploy/:path*",
    "/upgrade",
    "/checkout",
    "/payment/:path*",
    "/2fa",
  ],
}
