"use client"

import { useCallback, useState } from "react"
import SearchBar from "../components/SearchBar.jsx"
import WeatherCard from "../components/WeatherCard.jsx"
import WeatherSummary from "../components/WeatherSummary.jsx"
import ErrorMessage from "../components/ErrorMessage.jsx"
import WeatherDetails from "../components/WeatherDetails.jsx"
import { useWeather } from "../hooks/useWeather.js"
import Logo from "../components/Logo.jsx"
import CityChat from "../components/CityChat.jsx"
import AboutSection from "../components/AboutSection.jsx"
import ContactSection from "../components/ContactSection.jsx"
import AppFooter from "../components/AppFooter.jsx"
import FeedbackWidget from "../components/FeedbackWidget.jsx"

export default function Home() {
  const [
    { loading, location, current, daily, summary, forecastText, error, favorites, hourly, dailyDetail },
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

  const [showDetails, setShowDetails] = useState(false)
  const openDetails = () => setShowDetails(true)
  const closeDetails = () => setShowDetails(false)

  return (
    <main className="container" id="top">
      <header className="header">
        <div className="brand">
          <Logo size={28} withText={false} title="Weather Now logo" />
          <div>
            <h1 className="title">Weather Now</h1>
            <p className="subtitle">Search city. Get insights. Plan your day.</p>
          </div>
        </div>
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
            favorites.map((f) => {
              const label =
                typeof f === "string" ? f : f?.label || [f?.name, f?.admin1, f?.country].filter(Boolean).join(", ")
              const key = typeof f === "string" ? f : f?.key || label
              return (
                <div key={key} className="row">
                  <button className="fav" onClick={() => fetchWeather(f)} aria-label={`Search ${label}`}>
                    {label}
                  </button>
                  <button
                    className="button ghost"
                    onClick={() => removeFavorite(f)}
                    aria-label={`Remove ${label} from favorites`}
                  >
                    Remove
                  </button>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* Results */}
      {current ? (
        <section className="grid grid-2" style={{ marginTop: 16 }}>
          <WeatherCard location={location} current={current} onFavorite={addFavorite} onDetails={openDetails} />
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

      {/* City-specific chat assistant */}
      {location ? (
        <section className="card section" style={{ marginTop: 16 }} aria-label="City chat">
          <CityChat
            cityLabel={[location?.name, location?.admin1, location?.country].filter(Boolean).join(", ")}
            cityObj={location}
            weather={current}
            forecast={daily}
          />
        </section>
      ) : null}

      <WeatherDetails
        open={showDetails}
        onClose={closeDetails}
        location={location}
        current={current}
        hourly={hourly}
        daily={dailyDetail}
        timezone={current?.timezone}
      />

      {/* About Section */}
      <AboutSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Feedback Widget */}
      <FeedbackWidget />

      {/* Attribution */}
      <section className="section" aria-label="Attribution" style={{ marginTop: 16 }}>
        <p className="small">Data from Open-Meteo.</p>
      </section>

      {/* App Footer */}
      <AppFooter />
    </main>
  )
}
