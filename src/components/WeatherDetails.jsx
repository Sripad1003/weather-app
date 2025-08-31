"use client"

function fmtTime(t) {
  try {
    return new Date(t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  } catch {
    return t
  }
}

export default function WeatherDetails({ open, onClose, location, current, hourly, daily, timezone }) {
  if (!open) return null
  const locLine = [location?.name, location?.admin1, location?.country].filter(Boolean).join(", ")
  const todayIdx = 0

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
        aria-describedby="details-body"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2 id="details-title" className="title" style={{ margin: 0 }}>
            Weather details
          </h2>
          <button className="button ghost" onClick={onClose} aria-label="Close details">
            Close
          </button>
        </div>
        <p className="small" style={{ marginTop: 4 }}>
          {locLine}
          {timezone ? ` • ${timezone}` : ""}
        </p>

        {/* Now */}
        <section className="section" id="details-body" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div className="badge">
            <span aria-hidden>🌤️</span>
            <span>Now</span>
          </div>
          <div className="kv" style={{ marginTop: 10 }}>
            <div>Temperature</div>
            <div>
              <strong>{current?.temperature}°C</strong>
            </div>
            <div>Feels like</div>
            <div>
              {hourly?.apparent_temperature?.[0] != null ? Math.round(hourly.apparent_temperature[0]) + "°C" : "—"}
            </div>
            <div>Humidity</div>
            <div>{hourly?.relative_humidity_2m?.[0] != null ? `${hourly.relative_humidity_2m[0]}%` : "—"}</div>
            <div>Wind</div>
            <div>{current?.wind_speed} km/h</div>
            <div>Condition</div>
            <div>{current?.condition}</div>
            <div>UV Index</div>
            <div>{hourly?.uv_index?.[0] ?? "—"}</div>
            <div>Cloud cover</div>
            <div>{hourly?.cloud_cover?.[0] != null ? `${hourly.cloud_cover[0]}%` : "—"}</div>
            <div>Visibility</div>
            <div>{hourly?.visibility?.[0] != null ? `${Math.round(hourly.visibility[0] / 1000)} km` : "—"}</div>
          </div>
        </section>

        {/* Today */}
        <section className="section" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div className="badge">
            <span aria-hidden>☀️</span>
            <span>Today</span>
          </div>
          <div className="kv" style={{ marginTop: 10 }}>
            <div>High / Low</div>
            <div>
              {daily?.temperature_2m_max?.[todayIdx] != null ? Math.round(daily.temperature_2m_max[todayIdx]) : "—"}°C /{" "}
              {daily?.temperature_2m_min?.[todayIdx] != null ? Math.round(daily.temperature_2m_min[todayIdx]) : "—"}°C
            </div>
            <div>Sunrise / Sunset</div>
            <div>
              {daily?.sunrise?.[todayIdx] ? fmtTime(daily.sunrise[todayIdx]) : "—"} /{" "}
              {daily?.sunset?.[todayIdx] ? fmtTime(daily.sunset[todayIdx]) : "—"}
            </div>
            <div>Precipitation</div>
            <div>{daily?.precipitation_sum?.[todayIdx] != null ? `${daily.precipitation_sum[todayIdx]} mm` : "—"}</div>
            <div>UV max</div>
            <div>{daily?.uv_index_max?.[todayIdx] ?? "—"}</div>
            <div>Max wind</div>
            <div>
              {daily?.wind_speed_10m_max?.[todayIdx] != null
                ? `${Math.round(daily.wind_speed_10m_max[todayIdx])} km/h`
                : "—"}
            </div>
          </div>
        </section>

        {/* Next hours */}
        <section className="section" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div className="badge">
            <span aria-hidden>🕒</span>
            <span>Next hours</span>
          </div>
          <div className="grid" style={{ marginTop: 10, gap: 8 }}>
            {(hourly?.time || []).slice(0, 12).map((t, i) => (
              <div key={t + i} className="card section" style={{ padding: 10 }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div className="small">{fmtTime(t)}</div>
                  <div className="small">
                    {hourly?.precipitation_probability?.[i] != null
                      ? `${hourly.precipitation_probability[i]}% rain`
                      : ""}
                  </div>
                </div>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div>
                    <strong>
                      {hourly?.temperature_2m?.[i] != null ? `${Math.round(hourly.temperature_2m[i])}°C` : "—"}
                    </strong>
                  </div>
                  <div className="small">
                    {hourly?.wind_speed_10m?.[i] != null ? `${Math.round(hourly.wind_speed_10m[i])} km/h wind` : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
