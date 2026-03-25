import type { Locale } from "@/lib/i18n/config"
import { notion } from "@/lib/notion/client"
import type { About } from "@/lib/notion/types"
import {
  getLocalizedPropertyText,
  getPropertyMultiSelect,
  getPropertyText,
} from "@/lib/utils"

export async function getAbout(locale: Locale): Promise<About | null> {
  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_ABOUT_DB_ID ?? "",
      page_size: 1,
    })

    const page = response.results[0]
    if (!page) return null

    const { properties } = page as any

    return {
      id: page.id,
      title: getLocalizedPropertyText(properties, "title", locale),
      description: getLocalizedPropertyText(properties, "description", locale),
      contact: getPropertyText(properties.contact),
      tags: getPropertyMultiSelect(properties.tags),
      githubUrl: getPropertyText(properties.githubUrl),
      linkedinUrl: getPropertyText(properties.linkedinUrl),
    }
  } catch (error) {
    console.error("Error fetching about:", error)
    return null
  }
}
