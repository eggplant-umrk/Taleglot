export type AnnotationCategories = {
  lifestyle?: string
  language?: string
  values?: string
}

export type Annotation = {
  id: string
  word: string
  categories?: AnnotationCategories
}

export type StoryPage = {
  id: number
  text: string[]
  thai?: string[]
  thaiReading?: string[]
  images?: string[]
  image?: string
  audioJa?: string
  audioThai?: string
}

export type ReviewCard = {
  id: string
  annotationId?: string
  image?: string
  word: string
  reading?: string
  meaning: string
  audio?: string
}

export type Story = {
  id: string
  title: string
  titleThai?: string
  source: string
  pages: StoryPage[]
  annotations: Annotation[]
  review: ReviewCard[]
}
