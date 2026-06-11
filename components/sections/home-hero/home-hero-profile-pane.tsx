import type { Profile } from "@/lib/profile"
import { Github, Twitter } from "lucide-react"
import Link from "next/link"
import { Button } from "../../ui/button"

interface HomeHeroProfilePaneProps {
  profile: Profile
  firstName: string
  lastName: string
  labels: {
    socialTwitter: string
    socialGithub: string
  }
}

export function HomeHeroProfilePane({
  profile,
  firstName,
  lastName,
  labels,
}: HomeHeroProfilePaneProps) {
  return (
    <div className="flex flex-col gap-8 md:min-h-[calc(100vh-6rem)] md:justify-between">
      <header className="text-black">
        <p className="text-xl leading-none tracking-[0.03em] md:text-2xl">
          {firstName}
        </p>
        {lastName ? (
          <p className="mt-2 text-xl leading-none tracking-[0.03em] md:text-2xl">
            {lastName}
          </p>
        ) : null}
      </header>

      <div className="flex items-center gap-2 text-sm text-black/85 md:text-base">
        {profile.twitterUrl ? (
          <Button variant="outline" size="icon" asChild>
            <Link
              href={profile.twitterUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={labels.socialTwitter}
            >
              <Twitter className="h-4 w-4" />
            </Link>
          </Button>
        ) : null}
        {profile.githubUrl ? (
          <Button variant="outline" size="icon" asChild>
            <Link
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={labels.socialGithub}
            >
              <Github className="h-4 w-4" />
            </Link>
          </Button>
        ) : null}
        {/* {profile.contact ? (
          <Button size="sm" asChild variant="ghost" className="h-8">
            <Link href={`mailto:${profile.contact}`} aria-label="Send email">
              Contact
            </Link>
          </Button>
        ) : null} */}
      </div>
    </div>
  )
}
