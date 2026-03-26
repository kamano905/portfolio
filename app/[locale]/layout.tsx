import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { isLocale, locales } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: Pick<LocaleLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) {
    return {}
  }

  const dictionary = await getDictionary(locale)

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    openGraph: {
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params
  if (!isLocale(locale)) {
    notFound()
  }

  const dictionary = await getDictionary(locale)

  return (
    <>
      <LanguageSwitcher
        locale={locale}
        labels={{
          languageJa: dictionary.navigation.languageJa,
          languageEn: dictionary.navigation.languageEn,
        }}
      />
      {children}
    </>
  )
}
