"use client"

export default function WeatherSummary({ text, onSpeak }) {
  if (!text) return null
  return (
    <div className="card section" role="region" aria-label="Weather Summary">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div className="badge">
          <span aria-hidden>📝</span>
          <span>Summary</span>
        </div>
        <button className="voice" onClick={onSpeak} aria-label="Play summary">
          <span aria-hidden>🔊</span> Speak
        </button>
      </div>
      <p style={{ marginTop: 10, lineHeight: 1.6 }}>{text}</p>
    </div>
  )
}
