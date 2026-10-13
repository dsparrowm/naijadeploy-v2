import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { loadAppState } from "@/lib/server/app-state"
import "./globals.css"

export const dynamic = "force-dynamic"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "naijaDeploy",
  description: "Deploy from Git to Lagos Edge. First deploy is free. Pay in Naira with Paystack.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initial = await loadAppState()
  return (
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        <Providers initial={initial}>{children}</Providers>
      </body>
    </html>
  )
}
