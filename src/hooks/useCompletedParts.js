import { useCallback, useState } from 'react'

const STORAGE_KEY = 'taleglot:completedParts'

function loadCompletedParts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCompletedParts(parts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parts))
  } catch {
    // localStorageが使えない環境（プライベートモードなど）では記録をあきらめる
  }
}

function useCompletedParts() {
  const [completedParts, setCompletedParts] = useState(() => loadCompletedParts())

  const markPartCompleted = useCallback((storyId, partId) => {
    if (!storyId || !partId) return
    setCompletedParts((prev) => {
      if (prev.some((entry) => entry.storyId === storyId && entry.partId === partId)) {
        return prev
      }
      const next = [...prev, { storyId, partId }]
      saveCompletedParts(next)
      return next
    })
  }, [])

  return { completedParts, markPartCompleted }
}

export default useCompletedParts
