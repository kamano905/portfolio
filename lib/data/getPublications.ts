import type { Locale } from "@/lib/i18n/config"
import { notion } from "@/lib/notion/client"
import type { Publication } from "@/lib/notion/types"
import {
  getLocalizedPropertyText,
  getPropertyNumber,
  getPropertyText,
  sortByYearDescending,
} from "@/lib/utils"

export async function getPublications(locale: Locale): Promise<Publication[]> {
  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_PUBLICATIONS_DB_ID ?? "",
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
      } satisfies Publication
    })

    return sortByYearDescending(items)
  } catch (error) {
    console.error("Error fetching publications:", error)
    return []
  }
}
