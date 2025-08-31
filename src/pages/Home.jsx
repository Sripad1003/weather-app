"use client"

import { useCallback } from "react"
import SearchBar from "../components/SearchBar.jsx"
import WeatherCard from "../components/WeatherCard.jsx"
import WeatherSummary from "../components/WeatherSummary.jsx"
import ErrorMessage from "../components/ErrorMessage.jsx"
import { useWeather } from "../hooks/useWeather.js"
import VoiceAssistant from "../components/VoiceAssistant.jsx"

export default function Home() {
  const [
    { loading, location, current, daily, summary, forecastText, error, favorites },
    { fetchWeather, addFavorite, removeFavorite },
  ] = useWeather()

  const speakText = useCallback((text) => {
    if (!("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = 1
    utter.pitch = 1
    utter.lang = "en-US"
    window.speechSynthesis.speak(utter)
  }, [])

  const handleSpeakSummary = useCallback(() => {
    if (summary) speakText(summary)
  }, [speakText, summary])

  const handleVoiceQuery = useCallback(
    async (q) => {
      // Simple intent: "weather in X" or "Bangalore" => run search
      // Previously used named groups (?<city>...), which can fail in some runtimes.
      const m1 = /(?:weather|forecast|in)\s+([a-z\s-]+)$/i.exec(q || "")
      const m2 = /^([a-z\s-]+)$/i.exec(q || "")
      const city = (m1 && m1[1]) || (m2 && m2[1])
      if (city) {
        const normalized = city.trim()
        if (normalized) {
          await fetchWeather(normalized)
          return `Searching weather for ${normalized}...`
        }
      }
      return "You can say 'weather in Bangalore' or just a city name."
    },
    [fetchWeather],
  )

  return (
    <main className="container">
      <header className="header">
        <div className="brand">
          <div className="logo" aria-hidden="true"></div>
          <div>
            <h1 className="title">Weather Now</h1>
            <p className="subtitle">Search city. Get insights. Plan your day.</p>
          </div>
        </div>
        <VoiceAssistant onAsk={handleVoiceQuery} />
      </header>

      <div className="grid" style={{ gap: 16 }}>
        <SearchBar onSearch={fetchWeather} loading={loading} />
        <ErrorMessage message={error} />
      </div>

      {/* Favorites */}
      <section className="card section" aria-label="Favorites">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="badge">
            <span aria-hidden>⭐</span> <span>Favorites</span>
          </div>
          <span className="hint">Quick access to saved cities</span>
        </div>
        <div className="favs" style={{ marginTop: 10 }}>
          {favorites.length === 0 ? (
            <span className="small">No favorites yet. Search a city and press "Save".</span>
          ) : (
            favorites.map((f) => (
              <div key={f} className="row">
                <button className="fav" onClick={() => fetchWeather(f)} aria-label={`Search ${f}`}>
                  {f}
                </button>
                <button
                  className="button ghost"
                  onClick={() => removeFavorite(f)}
                  aria-label={`Remove ${f} from favorites`}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Results */}
      {current ? (
        <section className="grid grid-2" style={{ marginTop: 16 }}>
          <WeatherCard location={location} current={current} onFavorite={addFavorite} />
          <WeatherSummary text={summary} onSpeak={handleSpeakSummary} />
        </section>
      ) : null}

      {/* 3-day forecast summary */}
      {daily?.length ? (
        <section className="card section" style={{ marginTop: 16 }} aria-label="3-Day Forecast">
          <div className="badge">
            <span aria-hidden>📅</span> <span>3-Day Forecast</span>
          </div>
          <pre style={{ marginTop: 10, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{forecastText}</pre>
        </section>
      ) : null}

      <footer style={{ marginTop: 24 }}>
        <p className="small">Data from Open‑Meteo. LLM text optional. Built for the “Weather Now” spec.</p>
      </footer>
    </main>
  )
}
