import React from 'react'
import { colors } from '../tokens'

/**
 * Soft environmental light behind the app card — takes the place of a device
 * bezel to sell depth (per design brief: no phone frame, this is the desktop
 * web app as-is, so the "frame" is ambient light instead of hardware).
 */
export function AmbientBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(120% 90% at 30% 20%, #6b422633 0%, transparent 55%),
          radial-gradient(100% 80% at 80% 85%, #a87c3f2e 0%, transparent 60%),
          linear-gradient(160deg, #d8c9a3 0%, ${colors.bg} 45%, #dccea3 100%)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  )
}
