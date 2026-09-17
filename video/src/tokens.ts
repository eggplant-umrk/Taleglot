// design-system.md / App.css の実測トークンをそのまま移植したもの。
// アプリ本体のCSS変数と1:1で対応させ、動画側で独自の配色を作らない。

export const colors = {
  bg: '#e8dcc0',
  surface: '#f3e9d2',
  surfaceAlt: '#ecdfc0',
  surfaceRaised: '#f8f1de',

  text: '#3e2723',
  textThai: '#86633c',
  muted: '#8a7358',

  accent: '#6b4226',
  accentDark: '#4e2f1a',
  lacquer: '#8c2f1b',
  brass: '#a87c3f',

  secondary: '#4b5d3f',
  secondaryDark: '#37452e',

  border: '#bfae8a',
  highlight: '#e8c77a',
} as const

export const fonts = {
  headingJp: "'Klee One', serif",
  headingThai: "'Chonburi', cursive",
  bodyJp: "'Kiwi Maru', sans-serif",
  bodyThai: "'Mitr', sans-serif",
} as const

export const shadows = {
  soft: '0 8px 20px rgba(62, 39, 35, 0.25)',
  card: '0 12px 28px rgba(62, 39, 35, 0.22)',
  bookEdge: '0 2px 0 #ecdfc0, 0 4px 0 #dfd0ab, 0 6px 0 #d3c298, 0 9px 16px rgba(62, 39, 35, 0.35)',
} as const

export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const
