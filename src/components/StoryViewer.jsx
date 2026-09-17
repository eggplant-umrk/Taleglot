import { useCallback, useEffect, useMemo, useState } from 'react'
import useAudioPlayer from '../hooks/useAudioPlayer'
import './StoryViewer.css'

const ANNOTATION_MARKER = /\{\{([^:{}]+):([^{}]+)\}\}/g

function EyeIcon() {
  return (
    <svg
      className="story-viewer__toggle-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path d="M2 12C4.5 6.5 8 4 12 4s7.5 2.5 10 8c-2.5 5.5-6 8-10 8s-7.5-2.5-10-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function renderAnnotatedText(text, annotationsById, onWordTap) {
  if (!text) return null

  const nodes = []
  let lastIndex = 0
  let key = 0
  let match

  ANNOTATION_MARKER.lastIndex = 0
  while ((match = ANNOTATION_MARKER.exec(text)) !== null) {
    const [full, id, label] = match

    if (match.index > lastIndex) {
      nodes.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>)
    }

    if (annotationsById.has(id)) {
      nodes.push(
        <button
          key={key++}
          type="button"
          className="story-viewer__word"
          onClick={() => onWordTap(id)}
        >
          {label}
        </button>,
      )
    } else {
      nodes.push(
        <strong key={key++} className="story-viewer__word story-viewer__word--plain">
          {label}
        </strong>,
      )
    }

    lastIndex = match.index + full.length
  }

  if (lastIndex < text.length) {
    nodes.push(<span key={key++}>{text.slice(lastIndex)}</span>)
  }

  return nodes
}

function StoryViewer({ story, onFinish, onWordCollected }) {
  const pages = story?.pages ?? []
  const [pageIndex, setPageIndex] = useState(0)
  const [komaIndex, setKomaIndex] = useState(0)
  const [showJa, setShowJa] = useState(true)
  const [showThai, setShowThai] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [openAnnotationId, setOpenAnnotationId] = useState(null)

  const currentPage = pages[pageIndex]
  // 本文は「コマ」単位の配列。1コマ = 画面に一度に表示する2〜3文程度のまとまり
  const komas = currentPage?.text ?? []
  const komaCount = komas.length
  const isLastKoma = komaIndex >= komaCount - 1
  const isLastPage = pageIndex >= pages.length - 1
  const isFirstKoma = pageIndex === 0 && komaIndex === 0

  const annotationsById = useMemo(() => {
    const map = new Map()
    for (const annotation of story?.annotations ?? []) {
      map.set(annotation.id, annotation)
    }
    return map
  }, [story])

  useEffect(() => {
    setImageError(false)
  }, [pageIndex])

  // コマが切り替わるたびに、新しい内容を画面の上から読めるようにする
  // （ページ送り・コマ送りのどちらでも同じ「新しい画面」として振る舞う）
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pageIndex, komaIndex])

  // 開いたままの単語詳細カードが、別のコマ/ページに送っても残り続けないようにする
  useEffect(() => {
    setOpenAnnotationId(null)
  }, [pageIndex, komaIndex])

  // audioJa/audioThaiはページ単位のまま（コマ単位には分割しない）。
  // 参照する値（currentPage?.audioJa等）はコマが変わっても変化しないため、
  // 下の<audio>要素もコマ送りではアンマウントされず、再生中の音声はコマを
  // 送っても途切れない。
  const jaAudio = useAudioPlayer(currentPage?.audioJa)
  const thaiAudio = useAudioPlayer(currentPage?.audioThai)

  const handleWordTap = useCallback(
    (id) => {
      onWordCollected?.(id)
      setOpenAnnotationId(id)
    },
    [onWordCollected],
  )

  const closeCard = useCallback(() => setOpenAnnotationId(null), [])

  const handlePrev = () => {
    if (komaIndex > 0) {
      setKomaIndex((index) => index - 1)
      return
    }
    if (pageIndex > 0) {
      const prevKomaCount = pages[pageIndex - 1]?.text?.length ?? 1
      setPageIndex((index) => index - 1)
      setKomaIndex(Math.max(0, prevKomaCount - 1))
    }
  }

  const handleNext = () => {
    if (!isLastKoma) {
      setKomaIndex((index) => index + 1)
      return
    }
    if (isLastPage) {
      onFinish?.()
      return
    }
    setPageIndex((index) => index + 1)
    setKomaIndex(0)
  }

  if (!currentPage) {
    return (
      <div className="story-viewer">
        <p>物語データがありません。</p>
      </div>
    )
  }

  const hasThaiOnPage = Array.isArray(currentPage.thai)
  const currentText = komas[komaIndex]
  const currentThai = hasThaiOnPage ? currentPage.thai[komaIndex] : undefined
  const currentThaiReading = Array.isArray(currentPage.thaiReading)
    ? currentPage.thaiReading[komaIndex]
    : undefined
  const openAnnotation = openAnnotationId ? annotationsById.get(openAnnotationId) : null

  return (
    <div className="story-viewer">
      <div className="story-viewer__image">
        {currentPage.image && !imageError ? (
          <img src={currentPage.image} alt="" onError={() => setImageError(true)} />
        ) : (
          <div className="story-viewer__image-placeholder">画像準備中</div>
        )}
      </div>

      <div className="story-viewer__toggles">
        <button
          type="button"
          className="story-viewer__toggle"
          aria-pressed={showJa}
          onClick={() => setShowJa((value) => !value)}
        >
          <EyeIcon />
          <span className="story-viewer__toggle-label">日本語</span>
        </button>
        {hasThaiOnPage && (
          <button
            type="button"
            className="story-viewer__toggle"
            aria-pressed={showThai}
            onClick={() => setShowThai((value) => !value)}
          >
            <EyeIcon />
            <span className="story-viewer__toggle-label">タイ語</span>
          </button>
        )}
      </div>

      <div className="story-viewer__text">
        {showJa && (
          <div className="story-viewer__text-block story-viewer__text-block--ja">
            <div className="story-viewer__text-row">
              <div className="story-viewer__text-content">
                <p>{renderAnnotatedText(currentText, annotationsById, handleWordTap)}</p>
              </div>
              {currentPage.audioJa && (
                <div className="story-viewer__audio">
                  <button
                    type="button"
                    className={`story-viewer__audio-button${jaAudio.hasError ? ' story-viewer__audio-button--error' : ''}`}
                    onClick={jaAudio.toggle}
                  >
                    {jaAudio.isPlaying ? '⏹ 停止' : '▶ 再生'}
                  </button>
                  <audio
                    ref={jaAudio.audioRef}
                    src={currentPage.audioJa}
                    preload="none"
                    onEnded={jaAudio.handleEnded}
                    onError={jaAudio.handleError}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {showThai && hasThaiOnPage && (
          <div className="story-viewer__text-block story-viewer__text-block--thai">
            <div className="story-viewer__text-row">
              <div className="story-viewer__text-content">
                <p>{renderAnnotatedText(currentThai, annotationsById, handleWordTap)}</p>
                {currentThaiReading && <p className="story-viewer__reading">{currentThaiReading}</p>}
              </div>
              {currentPage.audioThai && (
                <div className="story-viewer__audio">
                  <button
                    type="button"
                    className={`story-viewer__audio-button${thaiAudio.hasError ? ' story-viewer__audio-button--error' : ''}`}
                    onClick={thaiAudio.toggle}
                  >
                    {thaiAudio.isPlaying ? '⏹ 停止' : '▶ 再生'}
                  </button>
                  <audio
                    ref={thaiAudio.audioRef}
                    src={currentPage.audioThai}
                    preload="none"
                    onEnded={thaiAudio.handleEnded}
                    onError={thaiAudio.handleError}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="story-viewer__nav">
        <button type="button" onClick={handlePrev} disabled={isFirstKoma}>
          ← 前へ
        </button>
        <div className="story-viewer__page-count">
          <span className="story-viewer__page-count-main">
            {pageIndex + 1} / {pages.length}
          </span>
          {komaCount > 1 && (
            <span className="story-viewer__koma-count">
              {komaIndex + 1} / {komaCount}
            </span>
          )}
        </div>
        <button type="button" onClick={handleNext}>
          {isLastPage && isLastKoma ? '読み終わる' : '次へ →'}
        </button>
      </div>

      {openAnnotation && (
        <div className="story-viewer__overlay" onClick={closeCard}>
          <div className="story-viewer__card" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="story-viewer__card-close"
              onClick={closeCard}
              aria-label="閉じる"
            >
              ×
            </button>
            <h3>{openAnnotation.word}</h3>
            {openAnnotation.categories?.lifestyle && (
              <section>
                <h4>暮らし</h4>
                <p>{openAnnotation.categories.lifestyle}</p>
              </section>
            )}
            {openAnnotation.categories?.language && (
              <section>
                <h4>ことば</h4>
                <p>{openAnnotation.categories.language}</p>
              </section>
            )}
            {openAnnotation.categories?.values && (
              <section>
                <h4>価値観</h4>
                <p>{openAnnotation.categories.values}</p>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default StoryViewer
