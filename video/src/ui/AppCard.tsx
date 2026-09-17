import React from 'react'
import { colors, shadows, space } from '../tokens'

type AppCardProps = {
  children: React.ReactNode
  width?: number
  scale?: number
  style?: React.CSSProperties
}

/**
 * The actual `.app` card from App.css (desktop breakpoint), reused as-is:
 * max-width 1080, padding space-6/space-16, surface color, book-edge shadow.
 * No browser chrome, no phone bezel — this IS the real app surface, just large.
 */
export function AppCard({ children, width = 1080, scale = 1, style }: AppCardProps) {
  return (
    <div
      style={{
        width,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
        padding: `${space[6]}px ${space[16]}px`,
        background: colors.surface,
        borderRadius: 6,
        boxShadow: shadows.bookEdge,
        color: colors.text,
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
