const ANNOTATION_ID_PATTERN = /\{\{([^:{}]+):/g

function extractAnnotationIds(strings) {
  const ids = new Set()
  for (const value of strings ?? []) {
    if (typeof value !== 'string') continue
    ANNOTATION_ID_PATTERN.lastIndex = 0
    let match
    while ((match = ANNOTATION_ID_PATTERN.exec(value)) !== null) {
      ids.add(match[1])
    }
  }
  return ids
}

// 物語のpages[]を、1ページ=1つの独立した「Part」として扱うための変換。
// reviewはそのPartの本文（text/thai）に実際に出てくる単語（annotationId）だけに絞り込む。
export function buildParts(story) {
  const pages = story?.pages ?? []

  return pages.map((page, index) => {
    const usedAnnotationIds = new Set([
      ...extractAnnotationIds(page.text),
      ...extractAnnotationIds(page.thai),
    ])
    const review = (story?.review ?? []).filter(
      (card) => card.annotationId && usedAnnotationIds.has(card.annotationId),
    )

    return {
      storyId: story.id,
      partId: `part${index + 1}`,
      partNumber: index + 1,
      label: `${story.title} Part${index + 1}`,
      storyForViewer: { ...story, pages: [page] },
      storyForReview: { ...story, review },
    }
  })
}
