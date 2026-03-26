import type { Publication } from "@/lib/notion/types"

import { PublicationItem } from "@/components/items/publication-item"

interface PublicationsSectionProps {
  publications: Publication[]
  title: string
}

export function PublicationsSection({
  publications,
  title,
}: PublicationsSectionProps) {
  if (publications.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className="text-foreground text-xl">{title}</h2>
      <div className="space-y-4">
        {publications.map((publication) => (
          <PublicationItem
            key={publication.id}
            publication={publication}
          />
        ))}
      </div>
    </section>
  )
}
