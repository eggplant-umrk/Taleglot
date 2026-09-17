import React from 'react'
import { Img } from 'remotion'
import { colors, fonts, shadows } from '../tokens'
import { assetSrc } from '../utils/assets'
import type { ReviewCard } from '../data/types'

const cardTexture: React.CSSProperties = {
  backgroundColor: colors.surfaceRaised,
  backgroundImage: `repeating-linear-gradient(
    180deg,
    rgba(107, 66, 38, 0.22) 0px,
    rgba(107, 66, 38, 0.22) 3px,
    rgba(107, 66, 38, 0.08) 3px,
    rgba(107, 66, 38, 0.08) 6px,
    transparent 6px,
    transparent 15px
  )`,
}

export function FlashCard({
  card,
  flipDegrees,
  width = 420,
}: {
  card: ReviewCard
  /** 0 = front(image) facing camera, 180 = back(word) facing camera */
  flipDegrees: number
  width?: number
}) {
  const height = (width * 3) / 4
  return (
    <div style={{ perspective: 1600 }}>
      <div
        style={{
          position: 'relative',
          width,
          height,
          transformStyle: 'preserve-3d',
          transform: `rotateY(${flipDegrees}deg)`,
          boxShadow: shadows.bookEdge,
          borderRadius: 3,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            border: `1px solid ${colors.border}`,
            borderRadius: 3,
            overflow: 'hidden',
            background: colors.surfaceAlt,
          }}
        >
          {card.image ? (
            <Img src={assetSrc(card.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.muted,
              }}
            >
              画像準備中
            </div>
          )}
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 3,
            border: `1px solid ${colors.accent}`,
            ...cardTexture,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            textAlign: 'center',
            padding: 24,
          }}
        >
          <p style={{ margin: 0, fontFamily: fonts.headingThai, fontSize: '2.2rem', color: colors.textThai }}>
            {card.word}
          </p>
          {card.reading && (
            <p style={{ margin: 0, fontSize: '0.8rem', color: colors.muted }}>{card.reading}</p>
          )}
          <p style={{ margin: 0, fontFamily: fonts.bodyJp, fontSize: '1.25rem', color: colors.text }}>
            {card.meaning}
          </p>
        </div>
      </div>
    </div>
  )
}
