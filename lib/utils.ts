import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Locale } from "@/lib/i18n/config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPropertyText(prop: any): string {
  if (!prop) return ""

  if (prop.rich_text) {
    return prop.rich_text
      .map((text: { plain_text?: string }) => text.plain_text ?? "")
      .join("")
  }

  if (prop.title) {
    return prop.title
      .map((text: { plain_text?: string }) => text.plain_text ?? "")
      .join("")
  }

  if (prop.url) {
    return typeof prop.url === "string" ? prop.url : (prop.url.url ?? "")
  }

  if (prop.email) {
    return typeof prop.email === "string"
      ? prop.email
      : (prop.email.email ?? "")
  }

  return ""
}

export function getPropertyMultiSelect(prop: any): string[] {
  if (!prop?.multi_select) return []
  return prop.multi_select.map((item: { name: string }) => item.name)
}

export function getPropertyNumber(prop: any): number {
  if (!prop) return 0
  if (typeof prop.number === "number") return prop.number
  return 0
}

/** First 4-digit year in string, or 0 if none (for sorting). */
export function parseYearForSort(year: string): number {
  const m = year.match(/\d{4}/)
  if (m) return parseInt(m[0], 10)
  return 0
}

/** Sort by first 4-digit year found in a string field (e.g. `year`, `time`). */
export function sortByYearishDescending<T>(
  items: T[],
  getYearish: (item: T) => string,
): T[] {
  return [...items].sort(
    (a, b) => parseYearForSort(getYearish(b)) - parseYearForSort(getYearish(a)),
  )
}

export function sortByYearDescending<T extends { year: string }>(
  items: T[],
): T[] {
  return sortByYearishDescending(items, (x) => x.year)
}

export function getLocalizedPropertyText(
  properties: Record<string, any>,
  key: string,
  locale: Locale,
): string {
  const localizedValue = getPropertyText(properties[`${key}_${locale}`])
  if (localizedValue) {
    return localizedValue
  }

  return getPropertyText(properties[key])
}
