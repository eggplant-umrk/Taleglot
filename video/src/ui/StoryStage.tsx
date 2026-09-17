import React from 'react'
import { Img } from 'remotion'
import { colors, fonts, shadows, space } from '../tokens'
import { AnnotatedText } from '../utils/annotations'
import { assetSrc } from '../utils/assets'
import { ToggleButton } from './ToggleButton'
import type { Annotation } from '../data/types'

export function StoryStage({
  image,
  height = 620,
  jaText,
  thaiText,
  thaiReading,
  annotationsById,
  activeWordId,
  pressProgress,
  glow,
  children,
}: {
  image: string
  height?: number
  jaText?: string
  thaiText?: string
  thaiReading?: string
  annotationsById: Map<string, Annotation>
  activeWordId?: string
  pressProgress?: number
  glow?: number
  children?: React.ReactNode
}) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        background: colors.surfaceAlt,
        border: `1px solid ${colors.border}`,
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: shadows.bookEdge,
      }}
    >
      <Img src={assetSrc(image)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

      {children}

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: space[2],
          padding: `${space[2]}px ${space[5]}px ${space[3]}px`,
          background:
            'linear-gradient(180deg, rgba(28, 18, 12, 0) 0%, rgba(28, 18, 12, 0.65) 22%, rgba(28, 18, 12, 0.86) 100%)',
          color: colors.surfaceRaised,
        }}
      >
        {jaText && (
          <div style={{ borderLeft: `3px solid ${colors.highlight}`, paddingLeft: space[3] }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: space[4] }}>
              <ToggleButton label="JA" active />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, lineHeight: 1.35, fontFamily: fonts.bodyJp, fontSize: '1.25rem' }}>
                  <AnnotatedText
                    text={jaText}
                    annotationsById={annotationsById}
                    activeWordId={activeWordId}
                    pressProgress={pressProgress}
                    glow={glow}
                  />
                </p>
              </div>
            </div>
          </div>
        )}

        {thaiText && (
          <div style={{ borderLeft: `3px solid ${colors.highlight}`, paddingLeft: space[3] }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: space[4] }}>
              <ToggleButton label="TH" active />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    lineHeight: 1.35,
                    fontFamily: fonts.bodyThai,
                    fontSize: '1.25rem',
                    color: colors.highlight,
                  }}
                >
                  <AnnotatedText
                    text={thaiText}
                    annotationsById={annotationsById}
                    activeWordId={activeWordId}
                    pressProgress={pressProgress}
                    glow={glow}
                    wordStyle={{ color: colors.text }}
                  />
                </p>
                {thaiReading && (
                  <p style={{ color: 'rgba(248, 241, 222, 0.75)', fontSize: '0.8rem', margin: `${space[1]}px 0 0` }}>
                    {thaiReading}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
