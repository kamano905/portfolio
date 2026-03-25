import type { Project } from "@/lib/notion/types"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ProjectDetailProps {
  project: Project
  labels: {
    preview: string
    noContent: string
  }
}

export function ProjectDetail({ project, labels }: ProjectDetailProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-foreground text-3xl font-semibold">
          {project.title}
        </h1>
        {project.role ? (
          <p className="text-muted-foreground text-sm">{project.role}</p>
        ) : null}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {project.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {project.previewLink ? (
          <Button asChild size="sm">
            <Link href={project.previewLink} target="_blank" rel="noreferrer">
              <ExternalLink />
              {labels.preview}
            </Link>
          </Button>
        ) : null}
      </div>

      {project.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}

      <article className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
        {project.content || labels.noContent}
      </article>
    </section>
  )
}
