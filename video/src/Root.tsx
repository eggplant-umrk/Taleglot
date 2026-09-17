import React from 'react'
import { Composition, Series } from 'remotion'
import { waitForFonts } from './loadFonts'
import { OpeningScene } from './scenes/OpeningScene'
import { ReadingScene } from './scenes/ReadingScene'
import { DiscoverScene } from './scenes/DiscoverScene'
import { CollectScene } from './scenes/CollectScene'
import { ReviewScene } from './scenes/ReviewScene'
import { ClosingScene } from './scenes/ClosingScene'

const FPS = 30

export const SCENES = [
  { name: 'Opening', durationInFrames: 4 * FPS, Component: OpeningScene },
  { name: 'Reading', durationInFrames: 12 * FPS, Component: ReadingScene },
  { name: 'Discover', durationInFrames: 16 * FPS, Component: DiscoverScene },
  { name: 'Collect', durationInFrames: 9 * FPS, Component: CollectScene },
  { name: 'Review', durationInFrames: 9 * FPS, Component: ReviewScene },
  { name: 'Closing', durationInFrames: 4 * FPS, Component: ClosingScene },
]

const TOTAL_DURATION = SCENES.reduce((sum, scene) => sum + scene.durationInFrames, 0)

function TaleglotPromo() {
  waitForFonts()
  return (
    <Series>
      {SCENES.map(({ name, durationInFrames, Component }) => (
        <Series.Sequence key={name} durationInFrames={durationInFrames}>
          <Component />
        </Series.Sequence>
      ))}
    </Series>
  )
}

export function RemotionRoot() {
  return (
    <Composition
      id="TaleglotPromo"
      component={TaleglotPromo}
      durationInFrames={TOTAL_DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
  )
}
