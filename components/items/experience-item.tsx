import { Experience } from "@/lib/notion/types"

export function ExperienceItem({
  time,
  title,
  description,
  experienceName,
}: Experience) {
  return (
    <div className="space-y-1">
      <time className="text-muted-foreground block font-mono text-xs">
        {time}
      </time>

      <h3 className="text-md text-foreground leading-tight font-medium">
        {title}
      </h3>

      {experienceName ? (
        <p className="text-muted-foreground text-sm font-medium">
          {experienceName}
        </p>
      ) : null}

      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}
