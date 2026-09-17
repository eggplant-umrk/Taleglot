import { interpolate, spring, type VideoConfig } from 'remotion'

export type TapAnimation = {
  /** 1 = resting size, <1 while pressed down */
  pressScale: number
  /** 0 -> 1 growth of the ripple ring */
  rippleProgress: number
  /** ripple fade-out */
  rippleOpacity: number
  /** true while the ripple should be rendered at all */
  showRipple: boolean
}

const PRESS_LEAD_FRAMES = 6
const RIPPLE_DURATION_FRAMES = 18

/**
 * Physicality of a tap: a quick sink to 95% right before `tapFrame`,
 * a springy bounce back afterwards, and an expanding ripple starting at `tapFrame`.
 * Mirrors the "operation has weight" principle instead of an instant state swap.
 */
export function getTapAnimation(
  frame: number,
  fps: number,
  tapFrame: number,
): TapAnimation {
  const pressStart = tapFrame - PRESS_LEAD_FRAMES

  let pressScale = 1
  if (frame >= pressStart && frame < tapFrame) {
    pressScale = interpolate(frame, [pressStart, tapFrame], [1, 0.95], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  } else if (frame >= tapFrame) {
    pressScale = spring({
      frame: frame - tapFrame,
      fps,
      from: 0.95,
      to: 1,
      config: { damping: 11, stiffness: 180, mass: 0.6 },
    })
  }

  const rippleFrame = frame - tapFrame
  const showRipple = rippleFrame >= 0 && rippleFrame <= RIPPLE_DURATION_FRAMES
  const rippleProgress = showRipple
    ? interpolate(rippleFrame, [0, RIPPLE_DURATION_FRAMES], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0
  const rippleOpacity = showRipple
    ? interpolate(rippleFrame, [0, RIPPLE_DURATION_FRAMES], [0.55, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0

  return { pressScale, rippleProgress, rippleOpacity, showRipple }
}

/** Ease-Out curve for camera/layout moves — a "luxury car suspension" deceleration. */
export const EASE_OUT_BEZIER: [number, number, number, number] = [0.25, 1, 0.5, 1]

export function springIn(frame: number, fps: number, delay = 0, config?: Parameters<typeof spring>[0]['config']) {
  return spring({
    frame: frame - delay,
    fps,
    config: config ?? { damping: 14, stiffness: 140, mass: 0.9 },
  })
}

export type Fps = VideoConfig['fps']
