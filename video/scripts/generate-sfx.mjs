// UIの手触りを支える効果音を、外部音源を使わずコードだけで合成するスクリプト。
// 実行: npm run sfx (video/ディレクトリ内)
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { writeWav } from './wav.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'audio', 'sfx')
const SAMPLE_RATE = 44100

function silence(seconds) {
  return new Array(Math.round(seconds * SAMPLE_RATE)).fill(0)
}

function tone(freq, seconds, { amp = 0.3, attack = 0.005, decay = 0.08, shape = 'sine' } = {}) {
  const n = Math.round(seconds * SAMPLE_RATE)
  const samples = new Array(n)
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE
    const envAttack = Math.min(1, t / attack)
    const envDecay = Math.exp(-t / decay)
    const env = envAttack * envDecay
    let value
    if (shape === 'sine') value = Math.sin(2 * Math.PI * freq * t)
    else if (shape === 'triangle') value = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * freq * t))
    else value = Math.sin(2 * Math.PI * freq * t)
    samples[i] = value * env * amp
  }
  return samples
}

function noiseBurst(seconds, { amp = 0.2, decay = 0.05 } = {}) {
  const n = Math.round(seconds * SAMPLE_RATE)
  const samples = new Array(n)
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE
    const env = Math.exp(-t / decay)
    samples[i] = (Math.random() * 2 - 1) * env * amp
  }
  return samples
}

function mix(...tracks) {
  const length = Math.max(...tracks.map((t) => t.length))
  const out = new Array(length).fill(0)
  for (const track of tracks) {
    for (let i = 0; i < track.length; i++) out[i] += track[i]
  }
  return out
}

function sweep(startFreq, endFreq, seconds, { amp = 0.25, decay = 0.3 } = {}) {
  const n = Math.round(seconds * SAMPLE_RATE)
  const samples = new Array(n)
  let phase = 0
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE
    const freq = startFreq + (endFreq - startFreq) * (t / seconds)
    phase += (2 * Math.PI * freq) / SAMPLE_RATE
    const env = Math.exp(-t / decay)
    samples[i] = Math.sin(phase) * env * amp
  }
  return samples
}

mkdirSync(OUT_DIR, { recursive: true })

// 1. tap: 太字の単語や画像内要素をタップした瞬間の、木の実がコツンと当たるような短いクリック音
const tap = mix(tone(880, 0.08, { amp: 0.35, decay: 0.05 }), noiseBurst(0.04, { amp: 0.15, decay: 0.02 }))
writeFileSync(join(OUT_DIR, 'tap.wav'), writeWav(join(OUT_DIR, 'tap.wav'), tap, SAMPLE_RATE))

// 2. card-pop: 詳細カードがバウンスして飛び出す瞬間の、軽やかな「ポンッ」
const cardPop = mix(sweep(420, 900, 0.18, { amp: 0.3, decay: 0.14 }), tone(1200, 0.1, { amp: 0.12, decay: 0.06 }))
writeFileSync(join(OUT_DIR, 'card-pop.wav'), writeWav(join(OUT_DIR, 'card-pop.wav'), cardPop, SAMPLE_RATE))

// 3. whoosh: ページ送り/スワイプ遷移の空気の流れる音
const whoosh = mix(sweep(200, 60, 0.28, { amp: 0.22, decay: 0.22 }), noiseBurst(0.28, { amp: 0.08, decay: 0.2 }))
writeFileSync(join(OUT_DIR, 'whoosh.wav'), writeWav(join(OUT_DIR, 'whoosh.wav'), whoosh, SAMPLE_RATE))

// 4. collect-chime: コレクションに単語が収まった瞬間の達成感を出すキラキラ音（分散和音）
const collectChimeStack = mix(
  tone(523.25, 0.55, { amp: 0.22, decay: 0.45 }), // C5
  (() => {
    const delayed = silence(0.05).concat(tone(659.25, 0.5, { amp: 0.2, decay: 0.4 })) // E5
    return delayed
  })(),
  (() => {
    const delayed = silence(0.1).concat(tone(783.99, 0.5, { amp: 0.2, decay: 0.4 })) // G5
    return delayed
  })(),
  (() => {
    const delayed = silence(0.15).concat(tone(1046.5, 0.45, { amp: 0.18, decay: 0.35 })) // C6
    return delayed
  })(),
)
writeFileSync(
  join(OUT_DIR, 'collect-chime.wav'),
  writeWav(join(OUT_DIR, 'collect-chime.wav'), collectChimeStack, SAMPLE_RATE),
)

// 5. flip: フラッシュカードがめくれる紙のような音
const flip = mix(noiseBurst(0.12, { amp: 0.18, decay: 0.06 }), sweep(1500, 400, 0.1, { amp: 0.1, decay: 0.08 }))
writeFileSync(join(OUT_DIR, 'flip.wav'), writeWav(join(OUT_DIR, 'flip.wav'), flip, SAMPLE_RATE))

// 6. complete-fanfare: クロージングのバッジ登場に合わせた明るい和音
const fanfare = mix(
  tone(523.25, 1.1, { amp: 0.2, decay: 0.9 }), // C5
  tone(659.25, 1.1, { amp: 0.18, decay: 0.9 }), // E5
  tone(783.99, 1.1, { amp: 0.18, decay: 0.9 }), // G5
  tone(1046.5, 1.1, { amp: 0.16, decay: 0.9 }), // C6
)
writeFileSync(join(OUT_DIR, 'complete-fanfare.wav'), writeWav(join(OUT_DIR, 'complete-fanfare.wav'), fanfare, SAMPLE_RATE))

console.log('SFX generated in', OUT_DIR)
