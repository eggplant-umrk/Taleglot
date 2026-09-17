import React from 'react'
import { Img } from 'remotion'
import { colors, fonts, shadows, space } from '../tokens'
import { assetSrc } from '../utils/assets'
import type { ReviewCard } from '../data/types'

export function CollectionGrid({
  cards,
  incomingIndex,
  incomingScale,
  incomingOpacity,
  incomingTranslateY,
  incomingRotate,
  glowOpacity,
  placeholderCount = 0,
}: {
  cards: ReviewCard[]
  /** index of the slot currently receiving the newly-collected word */
  incomingIndex?: number
  incomingScale?: number
  incomingOpacity?: number
  incomingTranslateY?: number
  incomingRotate?: number
  glowOpacity?: number
  /** extra dashed "not yet found" slots rendered after the real cards */
  placeholderCount?: number
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: space[5],
      }}
    >
      {cards.map((card, i) => {
        const isIncoming = i === incomingIndex
        const scale = isIncoming ? incomingScale ?? 1 : 1
        const opacity = isIncoming ? incomingOpacity ?? 1 : 1
        const translateY = isIncoming ? incomingTranslateY ?? 0 : 0
        const rotate = isIncoming ? incomingRotate ?? 0 : 0
        return (
          <div
            key={card.id}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              border: `1px solid ${colors.border}`,
              borderRadius: 4,
              background: colors.surfaceAlt,
              overflow: 'visible',
              boxShadow: shadows.bookEdge,
              transform: `translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
              opacity,
            }}
          >
            {isIncoming && glowOpacity ? (
              <div
                style={{
                  position: 'absolute',
                  inset: -18,
                  borderRadius: 12,
                  background: `radial-gradient(circle, ${colors.highlight}bb 0%, transparent 70%)`,
                  opacity: glowOpacity,
                  pointerEvents: 'none',
                }}
              />
            ) : null}
            <div
              style={{
                aspectRatio: '4 / 3',
                overflow: 'hidden',
                borderRadius: '4px 4px 0 0',
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
                    fontSize: '0.8rem',
                  }}
                >
                  画像準備中
                </div>
              )}
            </div>
            <div style={{ padding: space[3], textAlign: 'center' }}>
              <p
                style={{
                  margin: `0 0 ${space[1]}px`,
                  fontFamily: fonts.headingThai,
                  fontSize: '1rem',
                  color: colors.textThai,
                }}
              >
                {card.word}
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: colors.text }}>{card.meaning}</p>
            </div>
          </div>
        )
      })}
      {Array.from({ length: placeholderCount }).map((_, i) => (
        <div
          key={`placeholder-${i}`}
          style={{
            aspectRatio: '4 / 3',
            borderRadius: 4,
            border: `2px dashed ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.muted,
            fontSize: '1.6rem',
          }}
        >
          ？
        </div>
      ))}
    </div>
  )
}
