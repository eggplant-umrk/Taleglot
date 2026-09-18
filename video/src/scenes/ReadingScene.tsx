import React from 'react'
import { AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { AmbientBackground } from '../ui/AmbientBackground'
import { AppCard } from '../ui/AppCard'
import { HomeScreen } from '../ui/HomeScreen'
import { StoryStage } from '../ui/StoryStage'
import { NavButtons } from '../ui/NavButtons'
import { annotationsById, story01 } from '../data'
import { getTapAnimation } from '../utils/tap'
import { SfxCue } from '../ui/Sfx'
import { TapPointer } from '../ui/TapPointer'

const page1 = story01.pages[0]

const KOMAS = [0, 1, 2].map((i) => ({
  image: page1.images?.[i] ?? page1.image!,
  text: page1.text[i],
  thai: page1.thai?.[i],
}))

const HOME_END = 20
const MORPH_END = 70
// Part1ボタン(リストの1項目目)のおおよその画面上の位置。ズームの原点をここに正確に合わせることで
// 「ボタンの中に入っていく」ような連続性を出す（実測値は静止画レンダリングで微調整）。
const PART1_BUTTON_X = 50
const PART1_BUTTON_Y = 43
const KOMA0_END = 150
const TRANSITION_1_TAP = 155
const TRANSITION_1_END = 172
const KOMA1_END = 260
const TRANSITION_2_TAP = 265
const TRANSITION_2_END = 282

function useKomaSwipe(frame: number) {
  if (frame < TRANSITION_1_TAP) {
    return { index: 0, offset: 0, nextOffset: null as number | null }
  }
  if (frame < TRANSITION_2_TAP) {
    if (frame < TRANSITION_1_END) {
      const t = interpolate(frame, [TRANSITION_1_TAP, TRANSITION_1_END], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.25, 1, 0.5, 1),
      })
      return { index: 0, offset: -t * 100, nextOffset: 100 - t * 100 }
    }
    return { index: 1, offset: 0, nextOffset: null }
  }
  if (frame < TRANSITION_2_END) {
    const t = interpolate(frame, [TRANSITION_2_TAP, TRANSITION_2_END], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 1, 0.5, 1),
    })
    return { index: 1, offset: -t * 100, nextOffset: 100 - t * 100 }
  }
  return { index: 2, offset: 0, nextOffset: null }
}

export function ReadingScene() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const homeTap = getTapAnimation(frame, fps, 15)
  const homeOpacity = interpolate(frame, [HOME_END, MORPH_END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const morphT = interpolate(frame, [HOME_END, MORPH_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 1, 0.5, 1),
  })
  // Zoom "through" the tapped Part1 card into the story stage. The origin is
  // pinned to the button's actual position so the camera reads as pushing
  // INTO that specific button, not just zooming into the middle of the screen.
  const morphScale = interpolate(morphT, [0, 1], [1, 3.4])
  const stageEntranceWindow: [number, number] = [MORPH_END - 24, MORPH_END]
  const stageOpacity = interpolate(frame, stageEntranceWindow, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  // Stage starts slightly zoomed-in and settles to 1x, matching the direction
  // of the Home layer's zoom so the two layers feel like one continuous push.
  const stageEntranceT = interpolate(frame, stageEntranceWindow, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 1, 0.5, 1),
  })
  const stageScale = interpolate(stageEntranceT, [0, 1], [1.16, 1])

  const showHome = frame < MORPH_END
  const showStage = frame >= HOME_END

  const { index, offset, nextOffset } = useKomaSwipe(frame)
  const current = KOMAS[index]
  const next = index < KOMAS.length - 1 ? KOMAS[index + 1] : null

  const isTransitioning1 = frame >= TRANSITION_1_TAP && frame < TRANSITION_1_END
  const isTransitioning2 = frame >= TRANSITION_2_TAP && frame < TRANSITION_2_END
  const isTransitioning = isTransitioning1 || isTransitioning2

  const navTap1 = getTapAnimation(frame, fps, TRANSITION_1_TAP)
  const navTap2 = getTapAnimation(frame, fps, TRANSITION_2_TAP)
  const navPress = frame < KOMA1_END ? navTap1.pressScale : navTap2.pressScale

  const komaLabel = `コマ ${index + 1} / ${KOMAS.length}`

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Audio src={staticFile('audio/narration/scene02.wav')} />
      <AmbientBackground />
      <SfxCue frame={15} name="tap" volume={0.7} />
      <SfxCue frame={TRANSITION_1_TAP} name="whoosh" volume={0.5} />
      <SfxCue frame={TRANSITION_2_TAP} name="whoosh" volume={0.5} />

      {showHome && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: homeOpacity,
            transform: `scale(${morphScale})`,
            transformOrigin: `${PART1_BUTTON_X}% ${PART1_BUTTON_Y}%`,
          }}
        >
          <AppCard width={1160}>
            <HomeScreen titleProgress={1} itemProgress={[1, 1, 1]} itemPress={homeTap.pressScale} />
          </AppCard>
          <TapPointer xPercent={PART1_BUTTON_X} yPercent={PART1_BUTTON_Y} frame={frame} tapFrame={15} />
        </div>
      )}

      {showStage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: stageOpacity,
            transform: `scale(${stageScale})`,
          }}
        >
          <AppCard width={1450}>
            <div style={{ position: 'relative', width: '100%', height: 720, overflow: 'hidden', borderRadius: 4 }}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: `translateX(${offset}%)`,
                }}
              >
                <StoryStage
                  image={current.image}
                  height={720}
                  jaText={current.text}
                  thaiText={current.thai}
                  annotationsById={annotationsById}
                />
              </div>
              {isTransitioning && next && nextOffset !== null && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: `translateX(${nextOffset}%)`,
                  }}
                >
                  <StoryStage
                    image={next.image}
                    height={720}
                    jaText={next.text}
                    thaiText={next.thai}
                    annotationsById={annotationsById}
                  />
                </div>
              )}
            </div>
            <div style={{ marginTop: 20 }}>
              <NavButtons komaLabel={komaLabel} nextScale={navPress} />
            </div>
          </AppCard>
        </div>
      )}
    </AbsoluteFill>
  )
}
