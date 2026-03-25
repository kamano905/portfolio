import type { Publication } from "@/lib/notion/types"

import { PublicationItem } from "@/components/items/publication-item"

interface PublicationsSectionProps {
  publications: Publication[]
  title: string
  viewLabel: string
}

export function PublicationsSection({
  publications,
  title,
  viewLabel,
}: PublicationsSectionProps) {
  if (publications.length === 0) return null

  return (
    <section className="space-y-6">
      <h2 className="text-foreground text-2xl font-semibold">{title}</h2>
      <div className="space-y-5">
        {publications.map((publication) => (
          <PublicationItem
            key={publication.id}
            publication={publication}
            viewLabel={viewLabel}
          />
        ))}
      </div>
    </section>
  )
}
