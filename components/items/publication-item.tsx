import type { Publication } from "@/lib/notion/types"
import Link from "next/link"

interface PublicationItemProps {
  publication: Publication
  viewLabel: string
}

export function PublicationItem({
  publication,
  viewLabel,
}: PublicationItemProps) {
  return (
    <article className="space-y-1">
      <h3 className="text-foreground text-sm leading-tight font-medium">
        {publication.title}
      </h3>
      <p className="text-muted-foreground text-xs leading-relaxed">
        {publication.authors}
      </p>
      <p className="text-muted-foreground text-xs">
        {publication.venue} ({publication.year})
      </p>
      <Link
        href={publication.publicationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground text-xs underline-offset-4 hover:underline"
      >
        {viewLabel}
      </Link>
    </article>
  )
}
