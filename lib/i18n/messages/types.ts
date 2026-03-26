export interface Dictionary {
  metadata: {
    title: string
    description: string
  }
  navigation: {
    seekAboutMe: string
    languageJa: string
    languageEn: string
  }
  home: {
    fallbackName: string
    fallbackRole: string
    noProjects: string
    noProjectSelected: string
    socialTwitter: string
    socialGithub: string
  }
  sections: {
    experience: string
    awards: string
    publications: string
  }
  project: {
    preview: string
    noContent: string
  }
  publication: {
    view: string
  }
  award: {
    view: string
  }
}
