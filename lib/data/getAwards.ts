import type { Locale } from "@/lib/i18n/config"
import { notion } from "@/lib/notion/client"
import type { Award } from "@/lib/notion/types"
import {
  getLocalizedPropertyText,
  getPropertyNumber,
  getPropertyText,
  sortByYearDescending,
} from "@/lib/utils"

export async function getAwards(locale: Locale): Promise<Award[]> {
  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_AWARDS_DB_ID ?? "",
    })

    const items = response.results.map((page: any) => {
      const { properties } = page
      const yearText = getPropertyText(properties.year)
      const yearNumber = getPropertyNumber(properties.year)

      return {
        id: page.id,
        title: getLocalizedPropertyText(properties, "title", locale),
        description: getLocalizedPropertyText(
          properties,
          "description",
          locale,
        ),
        year: yearText || (yearNumber ? String(yearNumber) : ""),
        link: getPropertyText(properties.link),
      }
    })

    return sortByYearDescending(items)
  } catch (error) {
    console.error("Error fetching awards:", error)
    return []
  }
}
