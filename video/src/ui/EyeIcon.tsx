import React from 'react'

export function EyeIcon({ active = true, color }: { active?: boolean; color: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M2 12C4.5 6.5 8 4 12 4s7.5 2.5 10 8c-2.5 5.5-6 8-10 8s-7.5-2.5-10-8Z"
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <circle cx={12} cy={12} r={3} fill={active ? color : 'none'} stroke={active ? 'none' : color} strokeWidth={1.5} />
    </svg>
  )
}
