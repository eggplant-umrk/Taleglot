import React from 'react'
import { colors } from '../tokens'

type RippleBurstProps = {
  progress: number
  opacity: number
  size?: number
  color?: string
}

/** Expanding ring drawn centered on its parent (parent must be position:relative). */
export function RippleBurst({ progress, opacity, size = 140, color = colors.brass }: RippleBurstProps) {
  if (opacity <= 0) return null
  const scale = 0.3 + progress * 1.4
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: '50%',
        border: `3px solid ${color}`,
        boxShadow: `0 0 24px 4px ${color}55`,
        transform: `scale(${scale})`,
        opacity,
        pointerEvents: 'none',
      }}
    />
  )
}
