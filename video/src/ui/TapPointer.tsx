import React from 'react'
import { interpolate } from 'remotion'

/**
 * A small fingertip-like dot that approaches a tap point, presses down at the
 * moment of contact, and fades away — makes the "what got tapped" causality
 * explicit instead of jumping straight to the result.
 */
export function TapPointer({
  xPercent,
  yPercent,
  frame,
  tapFrame,
  size = 40,
}: {
  xPercent: number
  yPercent: number
  frame: number
  tapFrame: number
  size?: number
}) {
  const appearStart = tapFrame - 16
  const appearEnd = tapFrame - 4
  const disappearStart = tapFrame + 3
  const disappearEnd = tapFrame + 13

  const opacity = interpolate(
    frame,
    [appearStart, appearEnd, disappearStart, disappearEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  if (opacity <= 0) return null

  const approachT = interpolate(frame, [appearStart, tapFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const pressT = interpolate(frame, [tapFrame - 5, tapFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const dropOffset = interpolate(approachT, [0, 1], [18, 0])
  const scale = 1 - pressT * 0.35

  return (
    <div
      style={{
        position: 'absolute',
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        opacity,
        pointerEvents: 'none',
        transform: `translateY(${dropOffset}px)`,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 35% 28%, rgba(255,255,255,0.95) 0%, rgba(232,199,122,0.9) 45%, rgba(168,124,63,0.95) 100%)',
          boxShadow: '0 6px 14px rgba(62, 39, 35, 0.45)',
          transform: `scale(${scale})`,
        }}
      />
    </div>
  )
}
