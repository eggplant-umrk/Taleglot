import story01Raw from './story01.json'
import { buildAnnotationsById } from '../utils/annotations'
import type { Story } from './types'

export const story01 = story01Raw as unknown as Story
export const annotationsById = buildAnnotationsById(story01.annotations)

export function getAnnotation(id: string) {
  const annotation = annotationsById.get(id)
  if (!annotation) throw new Error(`Unknown annotation id: ${id}`)
  return annotation
}

export function getReviewCard(id: string) {
  const card = story01.review.find((r) => r.id === id)
  if (!card) throw new Error(`Unknown review card id: ${id}`)
  return card
}
