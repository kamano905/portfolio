export type RichText = any[]

export interface Experience {
  id: string
  time: string
  title: string
  description: string
  experienceName?: string
}

export interface Publication {
  id: string
  title: string
  description: string
  year: string
  link: string
}

export interface Award {
  id: string
  title: string
  description: string
  year: string
  link: string
}

export interface Project {
  id: string
  time: string
  title: string
  role: string
  description: string
  content: string
  tags: string[]
  previewLink?: string
}
