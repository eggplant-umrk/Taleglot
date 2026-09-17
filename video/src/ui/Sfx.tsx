import React from 'react'
import { Audio, Sequence, staticFile } from 'remotion'

const SFX_FILES = {
  tap: 'audio/sfx/tap.wav',
  cardPop: 'audio/sfx/card-pop.wav',
  whoosh: 'audio/sfx/whoosh.wav',
  collectChime: 'audio/sfx/collect-chime.wav',
  flip: 'audio/sfx/flip.wav',
  completeFanfare: 'audio/sfx/complete-fanfare.wav',
} as const

export type SfxName = keyof typeof SFX_FILES

/** Fires a one-shot SFX starting at the given local frame within the current scene. */
export function SfxCue({ frame, name, volume = 1 }: { frame: number; name: SfxName; volume?: number }) {
  if (frame < 0) return null
  return (
    <Sequence from={frame} layout="none">
      <Audio src={staticFile(SFX_FILES[name])} volume={volume} />
    </Sequence>
  )
}
