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
        className="fixed top-6 left-6 z-20 text-sm text-black/80 underline-offset-4 hover:underline"
      >
        {"<< Back"}
      </Link>
      <div className="mx-auto max-w-3xl px-6 py-20 sm:px-8">
        <ProjectDetail
          project={project}
          labels={{
            preview: dictionary.project.preview,
            noContent: dictionary.project.noContent,
          }}
        />
      </div>
    </div>
  )
}
