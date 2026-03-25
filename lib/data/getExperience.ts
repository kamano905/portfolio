import type { Locale } from "@/lib/i18n/config"
import { notion } from "@/lib/notion/client"
import type { Experience } from "@/lib/notion/types"
import { getLocalizedPropertyText, getPropertyText } from "@/lib/utils"

export async function getExperience(locale: Locale): Promise<Experience[]> {
  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_EXPERIENCE_DB_ID ?? "",
    })

    return response.results.map((page: any) => {
      const { properties } = page
      return {
        id: page.id,
        time: getPropertyText(properties.time),
        title: getLocalizedPropertyText(properties, "title", locale),
        description: getLocalizedPropertyText(
          properties,
          "description",
          locale,
        ),
        experienceName: getLocalizedPropertyText(
          properties,
          "experienceName",
          locale,
        ),
      }
    })
  } catch (error) {
    console.error("Error fetching experience:", error)
    return []
  }
}
