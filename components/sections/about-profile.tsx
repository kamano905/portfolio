import type { Profile } from "@/lib/profile"

interface AboutProfileProps {
  profile: Profile
}

export function AboutProfile({ profile }: AboutProfileProps) {
  return (
    <section className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
      <div className="space-y-4">
        <h1 className="text-foreground text-4xl md:text-6xl">{profile.name}</h1>
        <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed">
          {profile.description}
        </p>
      </div>
      <div className="w-full max-w-[520px] bg-transparent md:w-[500px]">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-auto w-full bg-transparent object-contain"
          style={{ backgroundColor: "transparent" }}
        >
          <source src="/profile.webm" type='video/webm; codecs="vp9"' />
          <source src="/profile.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  )
}
