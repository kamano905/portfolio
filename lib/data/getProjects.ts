import type { Locale } from "@/lib/i18n/config"
import { notion } from "@/lib/notion/client"
import {
  getLocalizedPropertyText,
  getPropertyMultiSelect,
  getPropertyText,
} from "@/lib/utils"

import type { Project } from "@/lib/notion/types"

export async function getProjects(locale: Locale): Promise<Project[]> {
  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_PROJECTS_DB_ID ?? "",
    })

    return response.results.map((page: any): Project => {
      const { properties } = page

      return {
        id: page.id,
        title: getLocalizedPropertyText(properties, "title", locale),
        role: getLocalizedPropertyText(properties, "role", locale),
        description: getLocalizedPropertyText(
          properties,
          "description",
          locale,
        ),
        content: getLocalizedPropertyText(properties, "content", locale),
        tags: getPropertyMultiSelect(properties.tags),
        previewLink: getPropertyText(properties.previewLink),
      }
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}
