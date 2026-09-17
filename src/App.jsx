import { useEffect, useMemo, useState } from 'react'
import story01 from './stories/story01.json'
import StoryViewer from './components/StoryViewer'
import Review from './components/Review'
import Collection from './components/Collection'
import Home from './components/Home'
import Complete from './components/Complete'
import useCollectedWords from './hooks/useCollectedWords'
import useCompletedParts from './hooks/useCompletedParts'
import { buildParts } from './utils/parts'
import './App.css'

function App() {
  const [view, setView] = useState('home')
  const [previousView, setPreviousView] = useState('home')
  const [activePartIndex, setActivePartIndex] = useState(0)
  const { collectedWords, addCollectedWord } = useCollectedWords()
  const { completedParts, markPartCompleted } = useCompletedParts()

  const parts = useMemo(() => buildParts(story01), [])
  const activePart = parts[activePartIndex]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view])

  const handleWordCollected = (wordId) => addCollectedWord(story01.id, wordId)

  const openCollection = () => {
    setPreviousView(view)
    setView('collection')
  }

  const handleSelectPart = (index) => {
    setActivePartIndex(index)
    setView('story')
  }

  const handleReviewFinish = () => {
    markPartCompleted(activePart.storyId, activePart.partId)
    setView('complete')
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
        {view === 'home' && (
          <Home parts={parts} completedParts={completedParts} onSelectPart={handleSelectPart} />
        )}
        {view === 'story' && activePart && (
          <StoryViewer
            story={activePart.storyForViewer}
            onFinish={() => setView('review')}
            onWordCollected={handleWordCollected}
          />
        )}
        {view === 'review' && activePart && (
          <Review
            story={activePart.storyForReview}
            onWordCollected={handleWordCollected}
            onFinish={handleReviewFinish}
          />
        )}
        {view === 'complete' && activePart && (
          <Complete part={activePart} onBackToHome={() => setView('home')} />
        )}
        {view === 'collection' && <Collection story={story01} collectedWords={collectedWords} />}
      </main>
    </div>
  )
}

export default App
