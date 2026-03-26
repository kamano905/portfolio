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
      "2000年に日本の愛知県で生まれた。2023年に東京大学工学部電気電子工学科にて学士号を取得、2026年に東京大学大学院学際情報学府にて修士号を取得。現在は同博士課程に在籍しつつ株式会社ディー・エヌ・エーにてAIエンジニアとして活動。東京都在住。",
    contact: "katsu0422.amano@gmail.com",
    githubUrl: "https://github.com/kamano905",
    twitterUrl: "https://x.com/KatsutoshiAmano",
  },
  en: {
    name: "Katsutoshi Amano",
    description:
      "Born in Aichi, Japan in 2000. Received the B.S. degree in Electrical and Electronic Engineering from the University of Tokyo, Japan in 2023, and the M.S. degree in Interdisciplinary Information Studies from the University of Tokyo in 2026. Currently pursuing a Ph.D. in the same field while working as an AI engineer at DeNA Co., Ltd. Currently based in Tokyo, Japan.",
    contact: "katsu0422.amano@gmail.com",
    githubUrl: "https://github.com/kamano905",
    twitterUrl: "https://x.com/KatsutoshiAmano",
  },
}

export function getProfile(locale: Locale): Profile {
  return profiles[locale] ?? profiles[defaultLocale]
}
