import type { Locale } from "@/lib/i18n/config"
import { notion } from "@/lib/notion/client"
import type { Project } from "@/lib/notion/types"
import {
  getLocalizedPropertyText,
  getPropertyMultiSelect,
  getPropertyText,
} from "@/lib/utils"

function isProjectPage(page: any): boolean {
  const parent = page?.parent
  const projectsDataSourceId = process.env.NOTION_PROJECTS_DB_ID ?? ""

  if (!projectsDataSourceId) return false
  if (!parent || typeof parent !== "object") return false

  return (
    parent.data_source_id === projectsDataSourceId ||
    parent.database_id === projectsDataSourceId
  )
}

export async function getProjectById(
  id: string,
  locale: Locale,
): Promise<Project | null> {
  try {
    const page = (await notion.pages.retrieve({ page_id: id })) as any
    if (!page || !isProjectPage(page)) return null

    const { properties } = page

    return {
      id: page.id,
      time: getLocalizedPropertyText(properties, "time", locale),
      title: getLocalizedPropertyText(properties, "title", locale),
      role: getLocalizedPropertyText(properties, "role", locale),
      description: getLocalizedPropertyText(properties, "description", locale),
      content: getLocalizedPropertyText(properties, "content", locale),
      tags: getPropertyMultiSelect(properties.tags),
      previewLink: getPropertyText(properties.previewLink),
    }
  } catch (error) {
    console.error(`Error fetching project by id: ${id}`, error)
    return null
  }
}
