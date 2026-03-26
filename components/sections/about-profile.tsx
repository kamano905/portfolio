import type { Profile } from "@/lib/profile"

interface AboutProfileProps {
  profile: Profile
}

export function AboutProfile({ profile }: AboutProfileProps) {
  return (
    <section className="space-y-4">
      <h1 className="text-foreground text-6xl">{profile.name}</h1>
      <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed">
        {profile.description}
      </p>
    </section>
  )
}
