"use client"

import { locales, type Locale } from "@/lib/i18n/config"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

interface LanguageSwitcherProps {
  locale: Locale
  labels: {
    languageJa: string
    languageEn: string
  }
}

function buildLocalizedPathname(pathname: string, nextLocale: Locale): string {
  if (!pathname || pathname === "/") {
    return `/${nextLocale}/home`
  }

  const segments = pathname.split("/")
  const currentLocale = segments[1]

  if (locales.includes(currentLocale as Locale)) {
    segments[1] = nextLocale
    return segments.join("/")
  }

  return `/${nextLocale}${pathname}`
}

export function LanguageSwitcher({ locale, labels }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = searchParams.toString()

  return (
    <div className="fixed top-4 right-4 z-30 flex items-center gap-1 rounded-full border border-black/20 bg-white/80 p-1 text-xs backdrop-blur">
      {locales.map((targetLocale) => {
        const basePath = buildLocalizedPathname(pathname, targetLocale)
        const href = query ? `${basePath}?${query}` : basePath
        const active = targetLocale === locale
        const label =
          targetLocale === "ja" ? labels.languageJa : labels.languageEn

        return (
          <Link
            key={targetLocale}
            href={href}
            className={`rounded-full px-2.5 py-1 ${
              active
                ? "bg-black text-white"
                : "text-black/70 transition-colors hover:bg-black/10 hover:text-black"
            }`}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
