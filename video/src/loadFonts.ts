import { continueRender, delayRender } from 'remotion'
import { story01 } from './data'

// アプリ本体のindex.html（design-system.md）と全く同じGoogle Fontsの<link>を使う。
// @remotion/google-fonts のloadFont()は日本語(japanese)サブセットを
// unicode-rangeごとに100個以上の個別リクエストとして即座に全取得しようとするため、
// レンダリング中に稀なネットワーク瞬断やGoogle側のレート制限でdelayRenderが
// タイムアウトすることがあった。<link>方式ならブラウザのネイティブな
// unicode-range遅延読み込みに任せられるが、それだけだと「実際に描画されてから
// 読み込みが走る」ため初回フレームでフォールバック書体が写り込む恐れがある。
// そこで document.fonts.load() で動画内に実際に登場する文字だけを明示的に
// 先読みし、確実に反映されてからフレームをキャプチャさせる。
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Klee+One:wght@400;600&family=Chonburi&family=Kiwi+Maru:wght@400;500&family=Mitr:wght@400;500;600&display=swap'

const JA_SAMPLE =
  story01.pages.map((p) => p.text.join('')).join('') +
  'TaleglotコレクションもどるコマページPart123次へ前へ読み終わる恋しい・会いたいことば黄金のハゼ暮らし価値観次のカードへコンプリートお疲れさま覚えたね物語を読みながらタイ語と文化に出会う'

const THAI_SAMPLE = story01.pages.map((p) => (p.thai ?? []).join('')).join('') + story01.review.map((r) => r.word).join('')

let started = false

function ensureLink() {
  if (typeof document === 'undefined') return
  if (document.querySelector(`link[href="${FONT_HREF}"]`)) return

  const preconnect1 = document.createElement('link')
  preconnect1.rel = 'preconnect'
  preconnect1.href = 'https://fonts.googleapis.com'
  document.head.appendChild(preconnect1)

  const preconnect2 = document.createElement('link')
  preconnect2.rel = 'preconnect'
  preconnect2.href = 'https://fonts.gstatic.com'
  preconnect2.crossOrigin = 'anonymous'
  document.head.appendChild(preconnect2)

  const stylesheet = document.createElement('link')
  stylesheet.rel = 'stylesheet'
  stylesheet.href = FONT_HREF
  document.head.appendChild(stylesheet)
}

/** Call once (e.g. from the root composition component) to fetch exactly the
 * glyphs this video actually uses, before Remotion starts capturing frames. */
export function waitForFonts() {
  if (started || typeof document === 'undefined' || !('fonts' in document)) return
  started = true
  ensureLink()

  const handle = delayRender('Waiting for Taleglot promo fonts to load')

  const specs: [string, string][] = [
    ['400 32px "Klee One"', JA_SAMPLE],
    ['600 32px "Klee One"', JA_SAMPLE],
    ['400 32px "Kiwi Maru"', JA_SAMPLE],
    ['500 32px "Kiwi Maru"', JA_SAMPLE],
    ['400 32px "Chonburi"', THAI_SAMPLE],
    ['400 32px "Mitr"', THAI_SAMPLE],
    ['500 32px "Mitr"', THAI_SAMPLE],
    ['600 32px "Mitr"', THAI_SAMPLE],
  ]

  Promise.all(specs.map(([spec, text]) => document.fonts.load(spec, text).catch(() => [])))
    .then(() => document.fonts.ready)
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle))
}
