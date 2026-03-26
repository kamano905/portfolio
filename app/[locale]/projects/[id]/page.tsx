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
        className="fixed top-14 left-12 z-20 text-lg text-black/80 underline-offset-4 hover:underline"
      >
        {"<< Back"}
      </Link>
      {project.previewLink ? (
        <Link
          href={project.previewLink}
          target="_blank"
          rel="noreferrer"
          className="fixed right-12 bottom-14 z-20 text-lg text-black/80 underline-offset-4 hover:underline"
        >
          {"Link to the website >>"}
        </Link>
      ) : null}
      <div className="mx-auto max-w-4xl px-8 py-20 pt-36">
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
