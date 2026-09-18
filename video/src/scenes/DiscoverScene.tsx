import React from 'react'
import { AbsoluteFill, Audio, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { AmbientBackground } from '../ui/AmbientBackground'
import { AppCard } from '../ui/AppCard'
import { StoryStage } from '../ui/StoryStage'
import { ImageHotspot } from '../ui/ImageHotspot'
import { CardBackdrop, WordDetailCard } from '../ui/WordDetailCard'
import { annotationsById, getAnnotation, story01 } from '../data'
import { getTapAnimation } from '../utils/tap'
import { SfxCue } from '../ui/Sfx'
import { TapPointer } from '../ui/TapPointer'

const page1 = story01.pages[0]

// Beat A: word tap on 「恋しくて」(kidteung) — koma index 2, page02.jpg
const KOMA_A = { image: page1.images![2], text: page1.text[2], thai: page1.thai![2] }
// Beat B: image-element tap on the golden fish (paaboothong) — koma index 5, page03.jpg
const KOMA_B = { image: page1.images![5], text: page1.text[5], thai: page1.thai![5] }
// Estimated position of the fish within page03.jpg (% of stage box, re-measured
// after the stage was enlarged to 1450x720)
const FISH_HOTSPOT = { x: 41, y: 85 }
// Approximate position of 「恋しくて」within the overlay bar text (% of stage box)
const WORD_A_HOTSPOT = { x: 29, y: 90 }

const TAP_A = 30
const CLOSE_A_START = 150
const CLOSE_A_END = 172
const SWIPE_START = 172
const SWIPE_END = 195
const HOTSPOT_FADE_END = 225
const TAP_B = 270
const CARD_B_DELAY = 306
const HOLD_B_END = 400
const FLY_END = 430

export function DiscoverScene() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // ---- Beat A: word tap ----
  const tapA = getTapAnimation(frame, fps, TAP_A)
  const pressProgressA = (1 - tapA.pressScale) / 0.05

  const backdropA = interpolate(frame, [TAP_A, TAP_A + 18, CLOSE_A_START, CLOSE_A_END], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const cardAEntry = spring({
    frame: frame - (TAP_A + 18),
    fps,
    config: { damping: 9, stiffness: 200, mass: 0.8 },
  })
  const cardAOpacity = interpolate(frame, [TAP_A + 18, TAP_A + 34, CLOSE_A_START, CLOSE_A_END], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  // 50%→~110%→100%のオーバーシュートで「発見できた」ことを弾むように示す
  const cardAScale = frame < CLOSE_A_START
    ? interpolate(cardAEntry, [0, 1], [0.5, 1])
    : interpolate(frame, [CLOSE_A_START, CLOSE_A_END], [1, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const cardATranslateY = interpolate(cardAEntry, [0, 1], [60, 0])

  // ---- Page swipe: page02 -> page03 ----
  const showingB = frame >= SWIPE_START + (SWIPE_END - SWIPE_START) / 2
  const swipeT = interpolate(frame, [SWIPE_START, SWIPE_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 1, 0.5, 1),
  })
  const isSwiping = frame >= SWIPE_START && frame < SWIPE_END

  // ---- Beat B: image hotspot tap ----
  const hotspotOpacity = interpolate(frame, [SWIPE_END, HOTSPOT_FADE_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const pulse = (Math.sin((frame - SWIPE_END) / 9) + 1) / 2
  const tapB = getTapAnimation(frame, fps, TAP_B)

  const backdropB = interpolate(frame, [TAP_B + 18, TAP_B + 36, HOLD_B_END, FLY_END], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const cardBEntry = spring({
    frame: frame - CARD_B_DELAY,
    fps,
    config: { damping: 9, stiffness: 200, mass: 0.8 },
  })
  const cardBOpacity = interpolate(frame, [CARD_B_DELAY, CARD_B_DELAY + 16, HOLD_B_END, FLY_END], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const flyT = interpolate(frame, [HOLD_B_END, FLY_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  })
  const cardBScaleIn = interpolate(cardBEntry, [0, 1], [0.5, 1])
  const cardBScale = frame < HOLD_B_END ? cardBScaleIn : interpolate(flyT, [0, 1], [1, 0.18])
  const cardBTranslateY = frame < HOLD_B_END ? interpolate(cardBEntry, [0, 1], [60, 0]) : interpolate(flyT, [0, 1], [0, 360])
  const cardBTranslateX = frame < HOLD_B_END ? 0 : interpolate(flyT, [0, 1], [0, 620])

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Audio src={staticFile('audio/narration/scene03.wav')} />
      <AmbientBackground />
      <SfxCue frame={TAP_A} name="tap" volume={0.7} />
      <SfxCue frame={TAP_A + 18} name="cardPop" volume={0.6} />
      <SfxCue frame={TAP_B} name="tap" volume={0.7} />
      <SfxCue frame={TAP_B + 18} name="cardPop" volume={0.6} />
      <AppCard width={1450}>
        <div style={{ position: 'relative', width: '100%', height: 720, overflow: 'hidden', borderRadius: 4 }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translateX(${-swipeT * 100}%)`,
            }}
          >
            <StoryStage
              image={KOMA_A.image}
              height={720}
              jaText={KOMA_A.text}
              thaiText={KOMA_A.thai}
              annotationsById={annotationsById}
              activeWordId="kidteung"
              pressProgress={pressProgressA}
              glow={tapA.rippleOpacity}
            />
            {frame < SWIPE_START && (
              <TapPointer xPercent={WORD_A_HOTSPOT.x} yPercent={WORD_A_HOTSPOT.y} frame={frame} tapFrame={TAP_A} />
            )}
          </div>

          {(isSwiping || showingB) && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `translateX(${(1 - swipeT) * 100}%)`,
              }}
            >
              <StoryStage
                image={KOMA_B.image}
                height={720}
                jaText={KOMA_B.text}
                thaiText={KOMA_B.thai}
                annotationsById={annotationsById}
              >
                {hotspotOpacity > 0 && (
                  <div style={{ position: 'absolute', inset: 0, opacity: hotspotOpacity }}>
                    <ImageHotspot
                      xPercent={FISH_HOTSPOT.x}
                      yPercent={FISH_HOTSPOT.y}
                      pulse={frame < TAP_B ? pulse : 0}
                      pressScale={tapB.pressScale}
                      rippleProgress={tapB.rippleProgress}
                      rippleOpacity={tapB.rippleOpacity}
                    />
                    <TapPointer xPercent={FISH_HOTSPOT.x} yPercent={FISH_HOTSPOT.y} frame={frame} tapFrame={TAP_B} />
                  </div>
                )}
              </StoryStage>
            </div>
          )}
        </div>
      </AppCard>

      <CardBackdrop progress={Math.max(backdropA, backdropB)} />
      {backdropA > 0 && frame < SWIPE_START && (
        <WordDetailCard
          annotation={getAnnotation('kidteung')}
          scale={cardAScale}
          opacity={cardAOpacity}
          translateY={cardATranslateY}
        />
      )}
      {backdropB > 0 && (
        <WordDetailCard
          annotation={getAnnotation('paaboothong')}
          scale={cardBScale}
          opacity={cardBOpacity}
          translateY={cardBTranslateY}
          translateX={cardBTranslateX}
        />
      )}
    </AbsoluteFill>
  )
}
