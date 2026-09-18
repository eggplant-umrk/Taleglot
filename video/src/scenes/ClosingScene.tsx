import React from 'react'
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { AmbientBackground } from '../ui/AmbientBackground'
import { CompleteBadge } from '../ui/CompleteBadge'
import { LightSweep } from '../ui/LightSweep'
import { colors, fonts } from '../tokens'
import { springIn } from '../utils/tap'
import { SfxCue } from '../ui/Sfx'
import { Logo } from '../ui/Logo'

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

  const taglineOpacity = interpolate(frame, [55, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const taglineY = interpolate(frame, [55, 70], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const logoOpacity = interpolate(frame, [78, 93], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const fadeOut = interpolate(frame, [132, 150], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: fadeOut }}>
      <Audio src={staticFile('audio/narration/scene06.wav')} />
      <AmbientBackground />
      <SfxCue frame={0} name="completeFanfare" volume={0.65} />
      <LightSweep progress={sweepProgress} />
      {/*
        position:absolute な AmbientBackground/LightSweep は、transform等を持たない
        通常フローのコンテンツより手前(paint順で後)に描画されるCSSのスタッキングルールがある
        （position:absoluteの要素は、たとえDOM順で先でも、z-index:auto同士のグループとして
        通常フローの子要素より後に描画される）。position+zIndexで明示的にスタッキングコンテキストを
        作り、この見出し/バッジを背景より確実に手前に出す。
      */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <CompleteBadge scale={badgeScale} opacity={badgeOpacity} />
        <p
          style={{
            margin: 0,
            fontFamily: fonts.bodyJp,
            fontSize: '1.4rem',
            color: colors.accent,
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
          }}
        >
          物語から、ことばを集めよう。
        </p>
        <div style={{ opacity: logoOpacity, marginTop: 4 }}>
          <Logo fontSize="2.4rem" />
        </div>
      </div>
    </AbsoluteFill>
  )
}
