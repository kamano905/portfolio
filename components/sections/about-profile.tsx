import type { Profile } from "@/lib/profile"

interface AboutProfileProps {
  profile: Profile
}

export function AboutProfile({ profile }: AboutProfileProps) {
  return (
    <section className="flex items-start gap-8">
      <div className="space-y-4">
        <h1 className="text-foreground text-6xl">{profile.name}</h1>
        <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed">
          {profile.description}
        </p>
      </div>
      <div className="w-[500px] bg-transparent">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-full w-full bg-transparent object-contain"
          style={{ backgroundColor: "transparent" }}
        >
          <source src="/profile.webm" type='video/webm; codecs="vp9"' />
          <source src="/profile.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  )
}
