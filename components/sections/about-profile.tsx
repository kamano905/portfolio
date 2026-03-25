import type { About } from "@/lib/notion/types"

import { Badge } from "@/components/ui/badge"

interface AboutProfileProps {
  about: About | null
}

export function AboutProfile({ about }: AboutProfileProps) {
  if (!about) return null

  return (
    <section className="space-y-4">
      <h1 className="text-foreground text-3xl font-semibold">{about.title}</h1>
      <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
        {about.description}
      </p>
      {about.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {about.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
    </section>
  )
}
