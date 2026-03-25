import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Next.js + Notion Portfolio Template",
  description:
    "Modern portfolio template built with Next.js and Notion API. Perfect for developers and creatives.",
  keywords: [
    "Next.js",
    "Notion",
    "Portfolio",
    "Template",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "Felipe Giraldo" }],
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL("https://portfolio-nextjs-notion.vercel.app/"),
  openGraph: {
    title: "Next.js + Notion Portfolio Template",
    description:
      "Modern portfolio template built with Next.js and Notion API. Perfect for developers and creatives.",
    url: "https://portfolio-nextjs-notion.vercel.app/",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Next.js + Notion Portfolio Template",
    description:
      "Modern portfolio template built with Next.js and Notion API. Perfect for developers and creatives.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
        />
      </head>
      <body className="font-sans antialiased">
        <main className="bg-background min-h-screen">{children}</main>
      </body>
    </html>
  )
}
