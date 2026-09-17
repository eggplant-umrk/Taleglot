import React from 'react'
import { colors, fonts, shadows, space } from '../tokens'

const PARTS = ['黄金のハゼ Part1', '黄金のハゼ Part2', '黄金のハゼ Part3']

export function HomeScreen({
  titleProgress,
  itemProgress,
  itemPress,
  showTitle = true,
}: {
  titleProgress: number
  itemProgress: number[]
  itemPress?: number
  showTitle?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: space[5],
        fontFamily: fonts.bodyJp,
        color: colors.text,
        textAlign: 'center',
      }}
    >
      {showTitle && (
        <h1
          style={{
            margin: 0,
            fontFamily: fonts.headingJp,
            fontSize: '2.2rem',
            color: colors.accentDark,
            opacity: titleProgress,
            transform: `translateZ(0) scale(${0.85 + titleProgress * 0.15})`,
          }}
        >
          Taleglot
        </h1>
      )}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: space[4] }}>
        {PARTS.map((label, i) => {
          const p = itemProgress[i] ?? 0
          const isFirst = i === 0
          const press = isFirst ? itemPress ?? 1 : 1
          return (
            <li key={label} style={{ opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.15rem',
                  padding: `${space[5]}px ${space[6]}px`,
                  border: `2px solid ${isFirst ? colors.brass : colors.border}`,
                  borderRadius: '4px 28px 4px 28px',
                  background: colors.surfaceAlt,
                  color: colors.text,
                  boxShadow: shadows.bookEdge,
                  fontWeight: 600,
                  transform: `scale(${press})`,
                }}
              >
                {label}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
