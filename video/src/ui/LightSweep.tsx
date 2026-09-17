import React from 'react'

/** A diagonal light streak that sweeps across its parent once, progress 0..1. */
export function LightSweep({ progress, opacity = 1 }: { progress: number; opacity?: number }) {
  const posPercent = -30 + progress * 160
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: `${posPercent}%`,
          width: '18%',
          height: '140%',
          background: 'linear-gradient(100deg, transparent 0%, rgba(248, 241, 222, 0.55) 45%, transparent 100%)',
          transform: 'rotate(18deg)',
          filter: 'blur(2px)',
        }}
      />
    </div>
  )
}
