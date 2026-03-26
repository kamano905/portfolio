import type { Locale } from "@/lib/i18n/config"
import { Project } from "@/lib/notion/types"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

interface ProjectItemProps extends Project {
  locale?: Locale
}

export function ProjectItem({
  id,
  title,
  description,
  tags,
  previewLink,
  locale,
}: ProjectItemProps) {
  const detailHref = locale ? `/${locale}/projects/${id}` : `/projects/${id}`

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <Link
            href={detailHref}
            className="text-md text-foreground truncate leading-tight font-medium hover:underline"
          >
            {title}
          </Link>
          <div className="flex shrink-0 gap-1">
            {previewLink && (
              <Button
                asChild
                size="xs"
                variant="secondary"
                className="hover:bg-muted h-6 w-6 p-0"
              >
                <Link
                  href={previewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Preview"
                >
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        <p className="text-muted-foreground mb-2 text-sm leading-relaxed">
          {description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="h-5 px-1.5 py-0 text-xs"
              >
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
