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
    <section className="animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards space-y-6 delay-400 duration-500">
      <h2 className="text-foreground flex items-center gap-3 text-2xl font-bold tracking-tight">
        <div className="bg-foreground h-6 w-1 rounded-full" />
        {title}
      </h2>
      <div className="space-y-6">
        {experience.map((exp) => (
          <ExperienceItem key={exp.id} {...exp} />
        ))}
      </div>
    </section>
  )
}
