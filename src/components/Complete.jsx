import './Complete.css'

function Complete({ part, onBackToHome }) {
  return (
    <div className="complete">
      <div className="complete__badge">🎉</div>
      <h2 className="complete__title">{part?.label} コンプリート！</h2>
      <p className="complete__message">お疲れさま！ことばをたくさん覚えたね。</p>
      <button type="button" className="complete__button" onClick={onBackToHome}>
        ホームへ戻る
      </button>
    </div>
  )
}

export default Complete
