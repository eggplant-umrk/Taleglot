import React from 'react'
import { colors } from '../tokens'
import { RippleBurst } from './RippleBurst'

/**
 * Marks a tappable element inside the illustration itself (e.g. the golden
 * fish). This is a video-only dramatization — the live app does not have
 * in-image hotspots yet.
 */
export function ImageHotspot({
  xPercent,
  yPercent,
  diameter = 90,
  pulse,
  pressScale = 1,
  rippleProgress = 0,
  rippleOpacity = 0,
}: {
  xPercent: number
  yPercent: number
  diameter?: number
  /** 0..1 breathing pulse before the tap happens */
  pulse: number
  pressScale?: number
  rippleProgress?: number
  rippleOpacity?: number
}) {
  const glow = 0.4 + pulse * 0.4
  return (
    <div
      style={{
        position: 'absolute',
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        width: diameter,
        height: diameter,
        marginLeft: -diameter / 2,
        marginTop: -diameter / 2,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `2.5px solid ${colors.highlight}`,
          boxShadow: `0 0 ${16 + pulse * 14}px ${4 + pulse * 4}px ${colors.highlight}${Math.round(glow * 255)
            .toString(16)
            .padStart(2, '0')}`,
          transform: `scale(${(0.9 + pulse * 0.15) * pressScale})`,
          opacity: 0.55 + pulse * 0.35,
        }}
      />
      <RippleBurst progress={rippleProgress} opacity={rippleOpacity} size={diameter * 1.6} color={colors.highlight} />
    </div>
  )
}
