import React from 'react'
import { colors } from '../tokens'
import type { Annotation } from '../data/types'

const ANNOTATION_MARKER = /\{\{([^:{}]+):([^{}]+)\}\}/g

type AnnotatedTextProps = {
  text: string | undefined
  annotationsById: Map<string, Annotation>
  /** id of the word currently being demonstrated as "tapped" in this scene */
  activeWordId?: string
  /** 0 = resting, 1 = fully pressed down (95%) */
  pressProgress?: number
  /** 0..1 glow ring opacity shown around the active word right at tap time */
  glow?: number
  wordStyle?: React.CSSProperties
}

export function AnnotatedText({
  text,
  annotationsById,
  activeWordId,
  pressProgress = 0,
  glow = 0,
  wordStyle,
}: AnnotatedTextProps) {
  if (!text) return null

  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let key = 0
  let match: RegExpExecArray | null

  ANNOTATION_MARKER.lastIndex = 0
  while ((match = ANNOTATION_MARKER.exec(text)) !== null) {
    const [full, id, label] = match

    if (match.index > lastIndex) {
      nodes.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>)
    }

    const isActive = id === activeWordId
    const scale = isActive ? 1 - pressProgress * 0.05 : 1
    const activeGlow = isActive ? glow : 0

    if (annotationsById.has(id)) {
      nodes.push(
        <span
          key={key++}
          data-annotation-id={id}
          style={{
            fontWeight: 'bold',
            background: colors.highlight,
            padding: '0.05rem 8px',
            borderRadius: 2,
            color: colors.text,
            display: 'inline-block',
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            boxShadow: activeGlow > 0 ? `0 0 ${18 * activeGlow}px ${4 * activeGlow}px ${colors.brass}aa` : undefined,
            ...wordStyle,
          }}
        >
          {label}
        </span>,
      )
    } else {
      nodes.push(
        <strong key={key++} style={{ fontWeight: 'bold' }}>
          {label}
        </strong>,
      )
    }

    lastIndex = match.index + full.length
  }

  if (lastIndex < text.length) {
    nodes.push(<span key={key++}>{text.slice(lastIndex)}</span>)
  }

  return <>{nodes}</>
}

export function buildAnnotationsById(annotations: Annotation[]) {
  const map = new Map<string, Annotation>()
  for (const a of annotations) map.set(a.id, a)
  return map
}
