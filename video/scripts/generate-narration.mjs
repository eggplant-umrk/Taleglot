// VOICEVOX ENGINE（ローカルREST API）を直接fetchで叩いてナレーションwavを生成するスクリプト。
// シェル経由でテキストを渡すと文字化けする問題を避けるため、必ずNode.jsのfetchで
// 日本語テキストをそのままUTF-8として送る（URLエンコードもfetch/URLSearchParamsに任せる）。
//
// 前提: デスクトップでVOICEVOX ENGINEを起動しておくこと（デフォルト http://127.0.0.1:50021）。
// 実行: npm run narration
//
// 環境変数:
//   VOICEVOX_HOST   VOICEVOX ENGINEのURL（デフォルト http://127.0.0.1:50021）
//   VOICEVOX_SPEAKER 話者ID（デフォルト 3 = ずんだもん・ノーマル相当。/speakers で確認可能）

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const HOST = process.env.VOICEVOX_HOST ?? 'http://127.0.0.1:50021'
const SPEAKER = process.env.VOICEVOX_SPEAKER ?? '3'
const OUT_DIR = join(__dirname, '..', 'public', 'audio', 'narration')
const SCRIPT_PATH = join(__dirname, '..', 'narration-script.md')

function parseScript(markdown) {
  const scenes = []
  // CRLF/LF どちらの改行でも読めるよう正規化してから走査する
  const normalized = markdown.replace(/\r\n/g, '\n')
  const sceneRegex = /## (scene\d+)[^\n]*\n\n```\n([\s\S]*?)\n```/g
  let match
  while ((match = sceneRegex.exec(normalized)) !== null) {
    const [, id, rawText] = match
    // [表記|読み] -> 読み だけを残して、VOICEVOXに正しい読みを渡す
    const text = rawText
      .trim()
      .replace(/\[([^|\]]+)\|([^\]]+)\]/g, '$2')
    scenes.push({ id, text })
  }
  return scenes
}

async function synthesize(text) {
  const queryUrl = new URL('/audio_query', HOST)
  queryUrl.searchParams.set('text', text)
  queryUrl.searchParams.set('speaker', SPEAKER)

  const queryRes = await fetch(queryUrl, { method: 'POST' })
  if (!queryRes.ok) {
    throw new Error(`audio_query failed (${queryRes.status}): ${await queryRes.text()}`)
  }
  const audioQuery = await queryRes.json()

  const synthUrl = new URL('/synthesis', HOST)
  synthUrl.searchParams.set('speaker', SPEAKER)
  const synthRes = await fetch(synthUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(audioQuery),
  })
  if (!synthRes.ok) {
    throw new Error(`synthesis failed (${synthRes.status}): ${await synthRes.text()}`)
  }
  return Buffer.from(await synthRes.arrayBuffer())
}

async function main() {
  const markdown = readFileSync(SCRIPT_PATH, 'utf-8')
  const scenes = parseScript(markdown)

  if (scenes.length === 0) {
    console.error('narration-script.md からシーンを読み取れませんでした。フォーマットを確認してください。')
    process.exit(1)
  }

  mkdirSync(OUT_DIR, { recursive: true })

  for (const scene of scenes) {
    process.stdout.write(`generating ${scene.id} ... `)
    try {
      const wav = await synthesize(scene.text)
      writeFileSync(join(OUT_DIR, `${scene.id}.wav`), wav)
      console.log('done')
    } catch (error) {
      console.log('FAILED')
      console.error(`  ${scene.id}: ${error.message}`)
      console.error('  VOICEVOX ENGINEが起動しているか（デフォルト http://127.0.0.1:50021）を確認してください。')
      process.exitCode = 1
    }
  }
}

main()
