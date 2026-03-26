import { defaultLocale, isLocale } from "@/lib/i18n/config"
import { headers } from "next/headers"
import type { Metadata } from "next"
import "./globals.css"
import NoiseBackground from "./background"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Portfolio website powered by Next.js and Notion.",
  keywords: ["Next.js", "Notion", "Portfolio"],
  authors: [{ name: "Katsutoshi Amano" }],
  icons: {
    icon: "/favicon.ico",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerList = await headers()
  const headerLocale = headerList.get("x-locale")
  const htmlLang =
    headerLocale && isLocale(headerLocale) ? headerLocale : defaultLocale

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
        />
      </head>
      <body className="font-sans antialiased">
        <NoiseBackground />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
