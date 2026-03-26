import { Experience } from "@/lib/notion/types"
import { ExperienceItem } from "../items/experience-item"

interface ExperienceSectionProps {
  experience: Experience[]
  title: string
}

export function ExperienceSection({
  experience,
  title,
}: ExperienceSectionProps) {
  if (experience.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <h2 className="text-foreground text-xl">{title}</h2>
      <div className="space-y-4">
        {experience.map((exp) => (
          <ExperienceItem key={exp.id} {...exp} />
        ))}
      </div>
    </section>
  )
}
