import type { Profile } from "@/lib/profile"

interface AboutProfileProps {
  profile: Profile
}

export function AboutProfile({ profile }: AboutProfileProps) {
  return (
    <section className="flex gap-8 items-start">
      <div className="space-y-4">
        <h1 className="text-foreground text-6xl">{profile.name}</h1>
        <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed">
          {profile.description}
        </p>
      </div>
      <div className="w-[500px]">
        <video autoPlay loop muted playsInline className="w-full h-full object-contain">
          <source src="/profile.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  )
}
