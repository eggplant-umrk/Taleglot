import React from 'react'
import { colors, fonts, space } from '../tokens'
import { EyeIcon } from './EyeIcon'

export function ToggleButton({
  label,
  active,
  scale = 1,
}: {
  label: 'JA' | 'TH'
  active: boolean
  scale?: number
}) {
  const onColor = colors.secondary
  const offBg = colors.surfaceAlt
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: space[2],
        fontFamily: fonts.bodyJp,
        fontSize: '0.9rem',
        padding: `${space[1]}px ${space[3]}px`,
        borderRadius: '3px 14px 3px 14px',
        border: `2px solid ${active ? onColor : colors.border}`,
        background: active ? onColor : offBg,
        color: active ? colors.surfaceRaised : colors.muted,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
      }}
    >
      <EyeIcon active={active} color={active ? colors.surfaceRaised : colors.muted} />
      <span style={{ lineHeight: 1 }}>{label}</span>
    </div>
  )
}
