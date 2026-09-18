import React from 'react'
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from 'remotion'
import { AmbientBackground } from '../ui/AmbientBackground'
import { AppCard } from '../ui/AppCard'
import { HomeScreen } from '../ui/HomeScreen'
import { colors, fonts } from '../tokens'
import { springIn } from '../utils/tap'
import { Logo } from '../ui/Logo'

export function OpeningScene() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const cardEntrance = springIn(frame, fps, 0, { damping: 16, stiffness: 120, mass: 1 })
  const cardScale = interpolate(cardEntrance, [0, 1], [0.92, 1])
  const cardOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' })

  // Kinetic typography: punched in from 120% -> 100% with a strong ease-out.
  const titleT = interpolate(frame, [4, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 1, 0.5, 1),
  })
  const titleScale = interpolate(titleT, [0, 1], [1.2, 1])
  const titleOpacity = interpolate(frame, [4, 16], [0, 1], { extrapolateRight: 'clamp' })

  const taglineOpacity = interpolate(frame, [20, 34], [0, 1], { extrapolateRight: 'clamp' })
  const taglineY = interpolate(frame, [20, 34], [16, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })

  const itemProgress = [0, 1, 2].map((i) =>
    springIn(frame, fps, 34 + i * 8, { damping: 15, stiffness: 130, mass: 0.9 }),
  )

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Audio src={staticFile('audio/narration/scene01.wav')} />
      <AmbientBackground />
      <AppCard scale={cardScale} style={{ opacity: cardOpacity, width: 1160 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1
            style={{
              margin: 0,
              opacity: titleOpacity,
              transform: `scale(${titleScale})`,
              transformOrigin: 'center',
            }}
          >
            <Logo fontSize="4rem" />
          </h1>
          <p
            style={{
              margin: '10px 0 0',
              fontFamily: fonts.bodyJp,
              fontSize: '1.3rem',
              color: colors.muted,
              opacity: taglineOpacity,
              transform: `translateY(${taglineY}px)`,
            }}
          >
            物語を読みながら、タイ語と文化に出会う
          </p>
        </div>
        <HomeScreen titleProgress={0} itemProgress={itemProgress} showTitle={false} />
      </AppCard>
    </AbsoluteFill>
  )
}
