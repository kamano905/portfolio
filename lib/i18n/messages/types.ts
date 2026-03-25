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
    socialLinkedIn: string
    socialGithub: string
  }
  sections: {
    experience: string
    publications: string
  }
  project: {
    preview: string
    noContent: string
  }
  publication: {
    view: string
  }
}
