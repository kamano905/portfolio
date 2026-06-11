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
    <div className="fixed top-4 right-4 z-30 flex items-center gap-2 text-[11px] md:top-14 md:right-12 md:gap-3 md:text-xs">
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
            aria-current={active ? "page" : undefined}
            className={`group relative inline-flex min-h-8 min-w-10 items-center justify-center px-2.5 py-1.5 tracking-[0.03em] transition-opacity md:min-w-11 md:px-3 ${
              active ? "text-black" : "text-black/55 hover:text-black"
            }`}
          >
            {active ? (
              <>
                <span className="pointer-events-none absolute top-0 left-0 h-2.5 w-2.5 border-t border-l border-black/55" />
                <span className="pointer-events-none absolute top-0 right-0 h-2.5 w-2.5 border-t border-r border-black/55" />
                <span className="pointer-events-none absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-black/55" />
                <span className="pointer-events-none absolute right-0 bottom-0 h-2.5 w-2.5 border-r border-b border-black/55" />
              </>
            ) : null}
            <span>{label}</span>
          </Link>
        )
      })}
    </div>
  )
}
