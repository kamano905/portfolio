import { defaultLocale, isLocale } from "@/lib/i18n/config"
import { redirect } from "next/navigation"

interface LocaleRootPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function LocaleRootPage({ params }: LocaleRootPageProps) {
  const { locale } = await params
  const targetLocale = isLocale(locale) ? locale : defaultLocale

  redirect(`/${targetLocale}/home`)
}
