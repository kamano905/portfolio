import type { Project } from "@/lib/notion/types"

import { Badge } from "@/components/ui/badge"

interface ProjectDetailProps {
  project: Project
  labels: {
    noContent: string
  }
}

export function ProjectDetail({ project, labels }: ProjectDetailProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-foreground text-3xl">{project.title}</h1>
        {project.time ? (
          <p className="text-muted-foreground text-xs">{project.time}</p>
        ) : null}
        {project.role ? (
          <p className="text-muted-foreground text-sm">{project.role}</p>
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
