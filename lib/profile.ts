import { defaultLocale, type Locale } from "@/lib/i18n/config"

export interface Profile {
  name: string
  description: string
  contact: string
  githubUrl: string
  twitterUrl: string
}

const profiles: Record<Locale, Profile> = {
  ja: {
    name: "Katsutoshi Amano",
    description:
      "Webエンジニアとして、AIやデータ活用を軸にプロダクト開発を行っています。",
    contact: "katsu0422.amano@gmail.com",
    githubUrl: "https://github.com/kamano905",
    twitterUrl: "https://x.com/KatsutoshiAmano",
  },
  en: {
    name: "Katsutoshi Amano",
    description:
      "Born in Aichi, Japan in 2000. Received the B.S. degree in Electrical and Electronic Engineering from the University of Tokyo, Japan in 2023. Pursuing the M.S. degree in Interdisciplinary Information Studies at the University of Tokyo. Engaged in internships at several IT venture companies. Currently based in Tokyo, Japan.",
    contact: "katsu0422.amano@gmail.com",
    githubUrl: "https://github.com/kamano905",
    twitterUrl: "https://x.com/KatsutoshiAmano",
  },
}

export function getProfile(locale: Locale): Profile {
  return profiles[locale] ?? profiles[defaultLocale]
}
