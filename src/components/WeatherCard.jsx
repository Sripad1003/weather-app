"use client"

export default function WeatherCard({ location, current, onFavorite, onDetails }) {
  if (!current) return null
  const locLine = [location?.name, location?.admin1, location?.country].filter(Boolean).join(", ")

  return (
    <div className="card section" role="region" aria-label="Current Weather">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div className="row">
          <div className="badge" aria-label="Current Conditions">
            <span aria-hidden>🌤️</span>
            <span>Now</span>
          </div>
          <div className="small" aria-label="Location" style={{ marginLeft: 6 }}>
            {locLine}
          </div>
        </div>
        <div className="row">
          {onFavorite ? (
            <button className="favorite-btn border-green-700" onClick={onFavorite} aria-label="Save city to favorites">
              ★ Save
            </button>
          ) : null}
          {onDetails ? (
            <button className="button ghost" onClick={onDetails} aria-label="View detailed weather">
              View details
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid" style={{ marginTop: 12, gap: 6 }}>
        <div className="kv">
          <div>Temperature</div>
          <div>
            <strong>{current.temperature}°C</strong>
          </div>

          <div>Condition</div>
          <div>{current.condition}</div>

          <div>Wind</div>
          <div>{current.wind_speed} km/h</div>
        </div>
      </div>
    </div>
  )
}
