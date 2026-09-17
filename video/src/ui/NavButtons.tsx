import React from 'react'
import { colors, fonts, space } from '../tokens'

export function NavButtons({
  komaLabel,
  nextLabel = '次へ →',
  nextScale = 1,
}: {
  komaLabel: string
  nextLabel?: string
  nextScale?: number
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: space[4],
        width: '100%',
        maxWidth: 640,
        margin: '0 auto',
        paddingTop: space[4],
        borderTop: `2px solid ${colors.border}`,
        fontFamily: fonts.bodyJp,
      }}
    >
      <button
        style={{
          fontFamily: fonts.bodyJp,
          fontSize: '1.15rem',
          padding: `${space[3]}px ${space[6]}px`,
          border: `2px solid ${colors.border}`,
          borderRadius: '28px 4px 28px 4px',
          background: colors.surfaceAlt,
          color: colors.text,
        }}
      >
        ← 前へ
      </button>
      <span style={{ fontSize: '0.9rem', color: colors.muted, whiteSpace: 'nowrap' }}>{komaLabel}</span>
      <button
        style={{
          fontFamily: fonts.bodyJp,
          fontSize: '1.15rem',
          padding: `${space[3]}px ${space[6]}px`,
          border: 'none',
          borderRadius: '4px 28px 4px 28px',
          background: colors.accent,
          color: colors.surfaceRaised,
          boxShadow: '0 4px 10px rgba(107, 66, 38, 0.35)',
          transform: `scale(${nextScale})`,
          transformOrigin: 'center',
        }}
      >
        {nextLabel}
      </button>
    </div>
  )
}
