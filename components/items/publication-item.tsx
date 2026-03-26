import type { Publication } from "@/lib/notion/types"
import Link from "next/link"

interface PublicationItemProps {
  publication: Publication
}

export function PublicationItem({
  publication,
}: PublicationItemProps) {
  const content = (
    <>
      {publication.year ? (
        <p className="text-muted-foreground text-xs">{publication.year}</p>
      ) : null}
      <h3 className="text-foreground text-sm leading-tight font-medium">
        {publication.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {publication.description}
      </p>
    </>
  )
  return (
    <article className="space-y-1">
      {publication.link ? (
        <Link
          href={publication.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground text-xs underline-offset-4 hover:underline"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </article>
  )
}
