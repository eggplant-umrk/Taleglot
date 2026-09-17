import React, { useMemo } from 'react'
import { colors } from '../tokens'

type Particle = { angle: number; distance: number; size: number; delay: number }

function seededParticles(count: number): Particle[] {
  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    // deterministic pseudo-random spread so every render (every frame) is stable
    const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.35
    const distance = 60 + ((i * 37) % 50)
    const size = 5 + ((i * 13) % 6)
    const delay = (i % 4) * 2
    particles.push({ angle, distance, size, delay })
  }
  return particles
}

/** Small radiating glow particles for the "found it!" collection moment. */
export function GlowParticles({ progress, originX = 50, originY = 50 }: { progress: number; originX?: number; originY?: number }) {
  const particles = useMemo(() => seededParticles(14), [])
  if (progress <= 0) return null

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {particles.map((p, i) => {
        const localProgress = Math.max(0, Math.min(1, progress * 1.3 - p.delay * 0.05))
        const dist = p.distance * localProgress
        const x = originX + (Math.cos(p.angle) * dist) / 8
        const y = originY + (Math.sin(p.angle) * dist) / 8
        const opacity = localProgress <= 0 ? 0 : 1 - localProgress
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: p.size,
              height: p.size,
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
              borderRadius: '50%',
              background: colors.highlight,
              boxShadow: `0 0 8px 2px ${colors.brass}aa`,
              opacity,
            }}
          />
        )
      })}
    </div>
  )
}
