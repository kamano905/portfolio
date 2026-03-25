export type RichText = any[]

export interface About {
  id: string
  title: string
  description: string
  contact?: string
  tags: string[]
  githubUrl?: string
  linkedinUrl?: string
}

export interface Experience {
  id: string
  time: string
  title: string
  description: string
  experienceUrl?: string
  experienceName?: string
}

export interface Publication {
  id: string
  title: string
  authors: string
  venue: string
  year: string
  publicationUrl: string
  order: number
}

export interface Project {
  id: string
  title: string
  role: string
  description: string
  content: string
  tags: string[]
  previewLink?: string
}
