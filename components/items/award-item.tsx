import Link from "next/link"
import type { Award } from "@/lib/notion/types"

interface AwardItemProps {
  award: Award
}

export function AwardItem({ award }: AwardItemProps) {
  const content = (
    <>
      {award.year ? (
        <p className="text-muted-foreground text-xs">{award.year}</p>
      ) : null}
      <h3 className="text-foreground text-sm leading-tight font-medium">
        {award.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {award.description}
      </p>
    </>
  )
  return (
    <article className="space-y-1">
      {award.link ? (
        <Link
          href={award.link}
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
