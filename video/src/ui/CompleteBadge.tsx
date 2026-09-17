import React from 'react'
import { colors, fonts } from '../tokens'

export function CompleteBadge({ scale, opacity }: { scale: number; opacity: number }) {
  return (
    <div style={{ textAlign: 'center', opacity }}>
      <div style={{ fontSize: '4.5rem', transform: `scale(${scale})`, transformOrigin: 'center' }}>🎉</div>
      <h2
        style={{
          margin: '12px 0 0',
          fontFamily: fonts.headingJp,
          fontSize: '2rem',
          color: colors.accentDark,
        }}
      >
        Part1 コンプリート！
      </h2>
      <p style={{ margin: '8px 0 0', color: colors.muted, fontFamily: fonts.bodyJp, fontSize: '1.15rem' }}>
        お疲れさま！ことばをたくさん覚えたね。
      </p>
    </div>
  )
}
