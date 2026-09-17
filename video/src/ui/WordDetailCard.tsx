import React from 'react'
import { colors, fonts, shadows, space } from '../tokens'
import type { Annotation } from '../data/types'

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

const CATEGORY_LABELS: Record<'lifestyle' | 'language' | 'values', string> = {
  lifestyle: '暮らし',
  language: 'ことば',
  values: '価値観',
}

/** Dimmed + blurred backdrop that appears behind a popped-up card. */
export function CardBackdrop({ progress }: { progress: number }) {
  if (progress <= 0) return null
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `rgba(62, 39, 35, ${0.55 * progress})`,
        backdropFilter: `blur(${10 * progress}px)`,
        WebkitBackdropFilter: `blur(${10 * progress}px)`,
      }}
    />
  )
}

export function WordDetailCard({
  annotation,
  scale,
  opacity,
  translateY,
  translateX = 0,
}: {
  annotation: Annotation
  scale: number
  opacity: number
  translateY: number
  translateX?: number
}) {
  if (opacity <= 0) return null
  const categories = Object.entries(annotation.categories ?? {}) as [
    keyof typeof CATEGORY_LABELS,
    string,
  ][]

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          ...cardTexture,
          position: 'relative',
          width: 480,
          borderRadius: 4,
          padding: space[6],
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.card,
          transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
          opacity,
        }}
      >
        <h3
          style={{
            margin: `0 0 ${space[5]}px`,
            fontFamily: fonts.headingJp,
            fontWeight: 600,
            color: colors.accentDark,
            fontSize: '1.4rem',
          }}
        >
          {annotation.word}
        </h3>
        {categories.map(([key, value]) => (
          <section key={key} style={{ marginBottom: space[5] }}>
            <h4
              style={{
                margin: `0 0 ${space[1]}px`,
                fontFamily: fonts.headingJp,
                color: colors.secondaryDark,
                fontSize: '1rem',
              }}
            >
              {CATEGORY_LABELS[key]}
            </h4>
            <p style={{ margin: 0, lineHeight: 1.7, fontFamily: fonts.bodyJp }}>{value}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
