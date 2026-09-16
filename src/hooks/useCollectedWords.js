import { useCallback, useState } from 'react'

const STORAGE_KEY = 'taleglot:collectedWords'

function loadCollectedWords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCollectedWords(words) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words))
  } catch {
    // localStorageが使えない環境（プライベートモードなど）では記録をあきらめる
  }
}

function useCollectedWords() {
  const [collectedWords, setCollectedWords] = useState(() => loadCollectedWords())

  const addCollectedWord = useCallback((storyId, wordId) => {
    if (!storyId || !wordId) return
    setCollectedWords((prev) => {
      if (prev.some((entry) => entry.storyId === storyId && entry.wordId === wordId)) {
        return prev
      }
      const next = [...prev, { storyId, wordId }]
      saveCollectedWords(next)
      return next
    })
  }, [])

  return { collectedWords, addCollectedWord }
}

export default useCollectedWords
