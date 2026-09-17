import './Home.css'

function Home({ parts, completedParts, onSelectPart }) {
  const isCompleted = (part) =>
    completedParts?.some((entry) => entry.storyId === part.storyId && entry.partId === part.partId)

  return (
    <div className="home">
      <h1 className="home__title">Taleglot</h1>
      <p className="home__lead">読みたいお話をえらんでね</p>
      <ul className="home__list">
        {parts.map((part, index) => (
          <li key={part.partId}>
            <button type="button" className="home__item" onClick={() => onSelectPart(index)}>
              <span className="home__item-label">{part.label}</span>
              {isCompleted(part) && <span className="home__item-badge">読了ずみ</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home
