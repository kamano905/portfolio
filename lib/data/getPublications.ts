import type { Locale } from "@/lib/i18n/config"
import { notion } from "@/lib/notion/client"
import type { Publication } from "@/lib/notion/types"
import {
  getLocalizedPropertyText,
  getPropertyNumber,
  getPropertyText,
} from "@/lib/utils"

export async function getPublications(locale: Locale): Promise<Publication[]> {
  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_PUBLICATIONS_DB_ID ?? "",
    })

    return response.results
      .map((page: any) => {
        const { properties } = page

        return {
          id: page.id,
          title: getLocalizedPropertyText(properties, "title", locale),
          authors: getLocalizedPropertyText(properties, "authors", locale),
          venue: getLocalizedPropertyText(properties, "venue", locale),
          year: getPropertyText(properties.year),
          publicationUrl: getPropertyText(properties.publicationUrl),
          order: getPropertyNumber(properties.order),
        } satisfies Publication
      })
      .sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error("Error fetching publications:", error)
    return []
  }
}
