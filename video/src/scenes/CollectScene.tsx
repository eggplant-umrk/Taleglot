import React from 'react'
import { AbsoluteFill, Audio, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { AmbientBackground } from '../ui/AmbientBackground'
import { AppCard } from '../ui/AppCard'
import { CollectionGrid } from '../ui/CollectionGrid'
import { GlowParticles } from '../ui/GlowParticles'
import { colors, fonts, space } from '../tokens'
import { getReviewCard } from '../data'
import { SfxCue } from '../ui/Sfx'

const ARRIVAL = 90
const GLOW_END = 130

export function CollectScene() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const enter = spring({ frame, fps, config: { damping: 15, stiffness: 120, mass: 0.9 } })
  const containerOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp' })
  const containerScale = interpolate(enter, [0, 1], [0.94, 1])

  const flightT = interpolate(frame, [20, ARRIVAL], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 1, 0.5, 1),
  })
  // 直線移動ではなく、二次ベジェで弧を描く軌跡にする（開始点→制御点→着地点）。
  // 制御点を右上に張り出させることで、吸い込まれるような曲線の動きになる。
  const ARC_START = { x: -220, y: -300 }
  const ARC_CONTROL = { x: 90, y: -110 }
  const bezier1 = (t: number, p0: number, p1: number, p2: number) =>
    (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t ** 2 * p2
  const incomingTranslateX = bezier1(flightT, ARC_START.x, ARC_CONTROL.x, 0)
  const incomingTranslateY = bezier1(flightT, ARC_START.y, ARC_CONTROL.y, 0)
  const incomingScale = interpolate(flightT, [0, 1], [2.3, 1])
  const incomingRotate = interpolate(flightT, [0, 1], [-16, 0])
  const incomingOpacity = interpolate(frame, [16, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const glowProgress = interpolate(frame, [ARRIVAL, GLOW_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const glowRingOpacity = interpolate(frame, [ARRIVAL, ARRIVAL + 6, GLOW_END], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const count = frame < ARRIVAL ? 1 : 2

  // review0X.png(専用イラスト)は未納品のため、動画では実際の挿絵を代わりに使う
  const cards = [
    { ...getReviewCard('review02'), image: '/stories/story01/page02.jpg' },
    { ...getReviewCard('review01'), image: '/stories/story01/page03.jpg' },
  ]

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Audio src={staticFile('audio/narration/scene04.wav')} />
      <AmbientBackground />
      <SfxCue frame={ARRIVAL} name="collectChime" volume={0.7} />
      <AppCard width={1250} scale={containerScale} style={{ opacity: containerOpacity }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: space[5] }}>
          <div
            style={{
              fontFamily: fonts.bodyJp,
              fontSize: '0.9rem',
              padding: `${space[2]}px ${space[4]}px`,
              borderRadius: '4px 4px 0 0',
              background: colors.secondary,
              color: colors.surfaceRaised,
            }}
          >
            📚 コレクション（{count}）
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <CollectionGrid
            cards={cards}
            incomingIndex={1}
            incomingScale={incomingScale}
            incomingOpacity={incomingOpacity}
            incomingTranslateX={incomingTranslateX}
            incomingTranslateY={incomingTranslateY}
            incomingRotate={incomingRotate}
            glowOpacity={glowRingOpacity}
            placeholderCount={1}
          />
          <GlowParticles progress={glowProgress} originX={50} originY={40} />
        </div>
      </AppCard>
    </AbsoluteFill>
  )
}
