import type { Award } from "@/lib/notion/types"

import { AwardItem } from "@/components/items/award-item"

interface AwardsSectionProps {
  awards: Award[]
  title: string
}

export function AwardsSection({
  awards,
  title,
}: AwardsSectionProps) {
  if (awards.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className="text-foreground text-xl">{title}</h2>
      <div className="space-y-4">
        {awards.map((award) => (
          <AwardItem key={award.id} award={award} />
        ))}
      </div>
    </section>
  )
}
