import { useEffect, useState } from 'react'
import story01 from './stories/story01.json'
import StoryViewer from './components/StoryViewer'
import Review from './components/Review'
import Collection from './components/Collection'
import useCollectedWords from './hooks/useCollectedWords'
import './App.css'

// TODO: 実装予定
// - 物語データの読み込み方法の整理（複数話に対応する場合は一覧化）

function App() {
  const [view, setView] = useState('story')
  const [previousView, setPreviousView] = useState('story')
  const { collectedWords, addCollectedWord } = useCollectedWords()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view])

  const handleWordCollected = (wordId) => addCollectedWord(story01.id, wordId)

  const openCollection = () => {
    setPreviousView(view)
    setView('collection')
  }

  return (
    <div className="app">
      <div className="app__nav">
        {view === 'collection' ? (
          <button type="button" className="app__nav-button" onClick={() => setView(previousView)}>
            ← もどる
          </button>
        ) : (
          <button type="button" className="app__nav-button" onClick={openCollection}>
            📚 コレクション（{collectedWords.length}）
          </button>
        )}
      </div>
      <main>
        {view === 'story' && (
          <StoryViewer story={story01} onFinish={() => setView('review')} onWordCollected={handleWordCollected} />
        )}
        {view === 'review' && <Review story={story01} onWordCollected={handleWordCollected} />}
        {view === 'collection' && <Collection story={story01} collectedWords={collectedWords} />}
      </main>
    </div>
  )
}

export default App
