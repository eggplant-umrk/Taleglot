import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { AmbientBackground } from '../ui/AmbientBackground'
import { CompleteBadge } from '../ui/CompleteBadge'
import { LightSweep } from '../ui/LightSweep'
import { colors, fonts } from '../tokens'
import { springIn } from '../utils/tap'
import { SfxCue } from '../ui/Sfx'

export function ClosingScene() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const badgeEntry = springIn(frame, fps, 0, { damping: 9, stiffness: 160, mass: 1 })
  const badgeScale = interpolate(badgeEntry, [0, 1], [0.4, 1])
  const badgeOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' })

  const sweepProgress = interpolate(frame, [14, 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const logoOpacity = interpolate(frame, [50, 65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const fadeOut = interpolate(frame, [105, 120], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: fadeOut }}>
      <AmbientBackground />
      <SfxCue frame={0} name="completeFanfare" volume={0.65} />
      <LightSweep progress={sweepProgress} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <CompleteBadge scale={badgeScale} opacity={badgeOpacity} />
        <p
          style={{
            margin: 0,
            fontFamily: fonts.headingJp,
            fontSize: '2.4rem',
            color: colors.accentDark,
            opacity: logoOpacity,
          }}
        >
          Taleglot
        </p>
      </div>
    </AbsoluteFill>
  )
}
