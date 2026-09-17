import React from 'react'
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { AmbientBackground } from '../ui/AmbientBackground'
import { AppCard } from '../ui/AppCard'
import { FlashCard } from '../ui/FlashCard'
import { colors, fonts, space } from '../tokens'
import { getReviewCard } from '../data'
import { getTapAnimation, springIn } from '../utils/tap'
import { SfxCue } from '../ui/Sfx'

// review01/02の指定画像(review01.png等)はイラスト未納品のため、
// 動画では実際に登場した挿絵（黄金のハゼ/ウアイのシーン）を代わりに使う。
const CARDS = [
  { ...getReviewCard('review01'), image: '/stories/story01/page03.jpg' },
  { ...getReviewCard('review02'), image: '/stories/story01/page02.jpg' },
]

const CARD1_TAP = 40
const CARD1_FLIP_END = 85
const SWITCH_START = 160
const SWITCH_END = 178
const CARD2_TAP = 195
const CARD2_FLIP_END = 240

function flipDegrees(frame: number, tapFrame: number, endFrame: number) {
  if (frame < tapFrame) return 0
  return interpolate(frame, [tapFrame, endFrame], [0, 180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 1, 0.5, 1),
  })
}

export function ReviewScene() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const showCard1 = frame < SWITCH_START + (SWITCH_END - SWITCH_START) / 2
  const cardIndex = showCard1 ? 0 : 1
  const card = CARDS[cardIndex]

  const flip1 = flipDegrees(frame, CARD1_TAP, CARD1_FLIP_END)
  const flip2 = flipDegrees(frame, CARD2_TAP, CARD2_FLIP_END)
  const flip = showCard1 ? flip1 : flip2

  const tap = getTapAnimation(frame, fps, showCard1 ? CARD1_TAP : CARD2_TAP)

  const switchT = interpolate(frame, [SWITCH_START, SWITCH_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 1, 0.5, 1),
  })
  const isSwitching = frame >= SWITCH_START && frame < SWITCH_END
  const switchOpacity = isSwitching ? interpolate(switchT, [0, 0.5, 1], [1, 0, 1]) : 1
  const switchOffsetX = isSwitching ? interpolate(switchT, [0, 0.5, 1], [0, -50, 0]) : 0

  const entry = springIn(frame, fps, 0, { damping: 15, stiffness: 130, mass: 0.9 })
  const entryScale = interpolate(entry, [0, 1], [0.9, 1])
  const entryOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <AmbientBackground />
      <SfxCue frame={CARD1_TAP} name="flip" volume={0.6} />
      <SfxCue frame={CARD2_TAP} name="flip" volume={0.6} />
      <AppCard width={1050} scale={entryScale} style={{ opacity: entryOpacity }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: space[5],
            paddingTop: space[6],
            borderTop: `2px solid ${colors.border}`,
          }}
        >
          <p style={{ margin: 0, color: colors.muted, fontSize: '0.9rem', fontFamily: fonts.bodyJp }}>
            {cardIndex + 1} / {CARDS.length}
          </p>
          <div
            style={{
              opacity: switchOpacity,
              transform: `translateX(${switchOffsetX}px) scale(${tap.pressScale})`,
            }}
          >
            <FlashCard card={card} flipDegrees={flip} width={580} />
          </div>
          <div
            style={{
              fontFamily: fonts.bodyJp,
              fontSize: '1.15rem',
              padding: `${space[3]}px ${space[6]}px`,
              borderRadius: '4px 28px 4px 28px',
              background: colors.accent,
              color: colors.surfaceRaised,
              boxShadow: '0 4px 10px rgba(107, 66, 38, 0.35)',
            }}
          >
            次のカードへ
          </div>
        </div>
      </AppCard>
    </AbsoluteFill>
  )
}
