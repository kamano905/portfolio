import type { Locale } from "@/lib/i18n/config"
import type { About, Project } from "@/lib/notion/types"

import { getAbout } from "./getAbout"
import { getProjects } from "./getProjects"

export interface HomeData {
  about: About | null
  projects: Project[]
}

export async function getHomeData(locale: Locale): Promise<HomeData> {
  const [about, projects] = await Promise.all([
    getAbout(locale),
    getProjects(locale),
  ])

  return {
    about,
    projects,
  }
}
