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
