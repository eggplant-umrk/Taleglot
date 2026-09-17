import { useState } from 'react'
import './Collection.css'

function CollectionCard({ annotation, review }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="collection__card">
      <div className="collection__card-image">
        {review?.image && !imageError ? (
          <img src={review.image} alt="" onError={() => setImageError(true)} />
        ) : (
          <div className="collection__card-image-placeholder">画像準備中</div>
        )}
      </div>
      <div className="collection__card-body">
        {review?.word && <p className="collection__card-thai">{review.word}</p>}
        <p className="collection__card-meaning">{annotation.word}</p>
      </div>
    </div>
  )
}

function Collection({ story, collectedWords }) {
  const annotationsById = new Map((story?.annotations ?? []).map((annotation) => [annotation.id, annotation]))
  const reviewByAnnotationId = new Map(
    (story?.review ?? []).filter((card) => card.annotationId).map((card) => [card.annotationId, card]),
  )

  const entries = (collectedWords ?? [])
    .filter((entry) => entry.storyId === story?.id)
    .map((entry) => {
      const annotation = annotationsById.get(entry.wordId)
      if (!annotation) return null
      const review = reviewByAnnotationId.get(entry.wordId)
      return { id: entry.wordId, annotation, review }
    })
    .filter(Boolean)

  return (
    <div className="collection">
      <p className="collection__count">見つけたことば：{entries.length}個</p>

      {entries.length === 0 ? (
        <p className="collection__empty">
          物語の中の太字になっていることばをタップすると、ここに集まっていきます。
        </p>
      ) : (
        <div className="collection__grid">
          {entries.map(({ id, annotation, review }) => (
            <CollectionCard key={id} annotation={annotation} review={review} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Collection
