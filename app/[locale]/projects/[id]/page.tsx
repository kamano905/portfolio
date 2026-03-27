import { ProjectDetail } from "@/components/sections/project-detail"
import { isLocale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getProjectById } from "@/lib/data"
import Link from "next/link"
import { notFound } from "next/navigation"

interface ProjectPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, id } = await params
  if (!isLocale(locale)) {
    notFound()
  }

  const [dictionary, project] = await Promise.all([
    getDictionary(locale),
    getProjectById(id, locale),
  ])

  if (!project) {
    notFound()
  }

  return (
    <div className="relative min-h-screen">
      <Link
        href={`/${locale}/home`}
        className="fixed top-4 left-4 z-20 text-sm text-black/80 underline-offset-4 hover:underline md:top-14 md:left-12 md:text-lg"
      >
        {"<< Back"}
      </Link>
      {project.previewLink ? (
        <Link
          href={project.previewLink}
          target="_blank"
          rel="noreferrer"
          className="fixed right-4 bottom-4 z-20 text-sm text-black/80 underline-offset-4 hover:underline md:right-12 md:bottom-14 md:text-lg"
        >
          {"Link to the website >>"}
        </Link>
      ) : null}
      <div className="mx-auto max-w-4xl px-4 py-12 pt-20 md:px-8 md:py-20 md:pt-36">
        <ProjectDetail
          project={project}
          labels={{
            noContent: dictionary.project.noContent,
          }}
        />
      </div>
    </div>
  )
}
