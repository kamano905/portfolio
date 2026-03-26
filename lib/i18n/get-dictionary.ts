import type { Dictionary } from "./messages/types"
import { defaultLocale, type Locale } from "./config"
import { en } from "./messages/en"
import { ja } from "./messages/ja"

const dictionaries: Record<Locale, Dictionary> = {
  ja,
  en,
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale] ?? dictionaries[defaultLocale]
}
