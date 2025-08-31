// Open-Meteo helpers: geocode -> current weather -> 3-day daily forecast
import { CONFIG } from "../config.js"

const WMO_CODE = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
}

function codeToCondition(code) {
  return WMO_CODE[code] ?? "Unknown"
}

export async function geocodeCity(name) {
  const url = `${CONFIG.GEOCODING_BASE}/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error("Network error during geocoding")
  const data = await res.json()
  if (!data?.results?.length) {
    const err = new Error("City not found")
    err.code = "CITY_NOT_FOUND"
    throw err
  }
  const c = data.results[0]
  return {
    name: c.name,
    country: c.country,
    admin1: c.admin1,
    latitude: c.latitude,
    longitude: c.longitude,
  }
}

export async function getCurrentWeather(lat, lon) {
  const url = `${CONFIG.OPEN_METEO_BASE}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh&timezone=auto`
  const res = await fetch(url)
  if (!res.ok) throw new Error("Network error during weather fetch")
  const data = await res.json()
  const current = data.current
  return {
    temperature: Math.round(current.temperature_2m),
    wind_speed: Math.round(current.wind_speed_10m),
    condition: codeToCondition(current.weather_code),
    weather_code: current.weather_code,
    timezone: data.timezone,
  }
}

export async function get3DayForecast(lat, lon) {
  // Request 3 days of daily weather codes and temps
  const url = `${CONFIG.OPEN_METEO_BASE}/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max&wind_speed_unit=kmh&forecast_days=3&timezone=auto`
  const res = await fetch(url)
  if (!res.ok) throw new Error("Network error during forecast fetch")
  const data = await res.json()
  const { time, weather_code, temperature_2m_max, temperature_2m_min, wind_speed_10m_max } = data.daily || {}
  const list = (time || []).map((t, i) => ({
    date: t,
    condition: codeToCondition(weather_code?.[i]),
    weather_code: weather_code?.[i],
    temp_max: Math.round(temperature_2m_max?.[i]),
    temp_min: Math.round(temperature_2m_min?.[i]),
    wind_max: Math.round(wind_speed_10m_max?.[i]),
  }))
  return list
}

export async function getHourlyDaily(lat, lon) {
  const url = `${CONFIG.OPEN_METEO_BASE}/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,dew_point_2m,cloud_cover,visibility,uv_index,wind_speed_10m,wind_gusts_10m&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max,wind_speed_10m_max&wind_speed_unit=kmh&forecast_days=3&timezone=auto`
  const res = await fetch(url)
  if (!res.ok) throw new Error("Network error during details fetch")
  const data = await res.json()
  return {
    timezone: data.timezone,
    hourly: {
      time: data.hourly?.time || [],
      temperature_2m: data.hourly?.temperature_2m || [],
      relative_humidity_2m: data.hourly?.relative_humidity_2m || [],
      apparent_temperature: data.hourly?.apparent_temperature || [],
      precipitation_probability: data.hourly?.precipitation_probability || [],
      precipitation: data.hourly?.precipitation || [],
      dew_point_2m: data.hourly?.dew_point_2m || [],
      cloud_cover: data.hourly?.cloud_cover || [],
      visibility: data.hourly?.visibility || [],
      uv_index: data.hourly?.uv_index || [],
      wind_speed_10m: data.hourly?.wind_speed_10m || [],
      wind_gusts_10m: data.hourly?.wind_gusts_10m || [],
    },
    daily: {
      time: data.daily?.time || [],
      temperature_2m_max: data.daily?.temperature_2m_max || [],
      temperature_2m_min: data.daily?.temperature_2m_min || [],
      sunrise: data.daily?.sunrise || [],
      sunset: data.daily?.sunset || [],
      precipitation_sum: data.daily?.precipitation_sum || [],
      uv_index_max: data.daily?.uv_index_max || [],
      wind_speed_10m_max: data.daily?.wind_speed_10m_max || [],
    },
  }
}
