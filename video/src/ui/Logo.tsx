import React from 'react'
import { Img } from 'remotion'
import { colors, fonts } from '../tokens'
import { assetSrc } from '../utils/assets'

// ロゴ画像(Geminiで作成中)が届いたら public/logo/logo.png に配置し、
// HAS_LOGO_IMAGE を true にするだけで Opening/Home/Closing 全箇所に反映される。
const HAS_LOGO_IMAGE = false
const LOGO_IMAGE_PATH = '/logo/logo.png'

export function Logo({ fontSize = '2.2rem', color = colors.accentDark }: { fontSize?: string; color?: string }) {
  if (HAS_LOGO_IMAGE) {
    return (
      <Img
        src={assetSrc(LOGO_IMAGE_PATH)}
        style={{ height: `calc(${fontSize} * 1.6)`, width: 'auto', display: 'block', margin: '0 auto' }}
      />
    )
  }

  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: fonts.headingJp,
        fontSize,
        color,
      }}
    >
      Taleglot
    </span>
  )
}
