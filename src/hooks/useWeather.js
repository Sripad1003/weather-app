"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { geocodeCity, getCurrentWeather, get3DayForecast, getHourlyDaily } from "../api/weatherApi.js"
import { summarizeWeather, forecastSummary } from "../api/llmApi.js"

export function useWeather() {
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState(null)
  const [current, setCurrent] = useState(null)
  const [daily, setDaily] = useState([])
  const [summary, setSummary] = useState("")
  const [forecastText, setForecastText] = useState("")
  const [error, setError] = useState("")

  const [favorites, setFavorites] = useState([])
  const [hourly, setHourly] = useState(null)
  const [dailyDetail, setDailyDetail] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("weather:favorites")
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return
      const normalized = parsed.map((item) => {
        if (typeof item === "string") {
          // legacy entry: only label/key
          return { key: item, label: item }
        }
        // ensure key + label exist
        const label = item?.label || [item?.name, item?.admin1, item?.country].filter(Boolean).join(", ")
        const key = item?.key || label
        return { ...item, key, label }
      })
      setFavorites(normalized)
    } catch {}
  }, [])

  const saveFavorites = useCallback((list) => {
    setFavorites(list)
    try {
      localStorage.setItem("weather:favorites", JSON.stringify(list))
    } catch {}
  }, [])

  const addFavorite = useCallback(() => {
    if (!location?.name) return
    const label = [location.name, location.admin1, location.country].filter(Boolean).join(", ")
    const key = label
    const newFav = {
      key,
      label,
      name: location.name,
      admin1: location.admin1,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
    }
    const exists = favorites.some((f) => (f?.key || f) === key)
    if (exists) return
    const next = [...favorites, newFav].slice(0, 12)
    saveFavorites(next)
  }, [favorites, location, saveFavorites])

  const removeFavorite = useCallback(
    (item) => {
      const k =
        typeof item === "string"
          ? item
          : item?.key || [item?.name, item?.admin1, item?.country].filter(Boolean).join(", ")
      const next = favorites.filter((f) => (typeof f === "string" ? f !== k : f?.key !== k))
      saveFavorites(next)
    },
    [favorites, saveFavorites],
  )

  const fetchWeather = useCallback(async (cityOrFav) => {
    setError("")
    setLoading(true)
    setSummary("")
    setForecastText("")
    try {
      let geo

      // If object favorite with coordinates, use directly
      if (cityOrFav && typeof cityOrFav === "object") {
        const fav = cityOrFav
        if (typeof fav.latitude === "number" && typeof fav.longitude === "number") {
          geo = {
            name: fav.name || fav.label || "Selected",
            admin1: fav.admin1,
            country: fav.country,
            latitude: fav.latitude,
            longitude: fav.longitude,
          }
        } else {
          // No coords on favorite (legacy) -> geocode by best available label/name
          const query = fav.name || fav.label || [fav.name, fav.admin1, fav.country].filter(Boolean).join(", ")
          geo = await geocodeCity(query)
        }
      } else {
        // String city name
        geo = await geocodeCity(String(cityOrFav || "").trim())
      }

      setLocation(geo)
      const [cur, days, details] = await Promise.all([
        getCurrentWeather(geo.latitude, geo.longitude),
        get3DayForecast(geo.latitude, geo.longitude),
        getHourlyDaily(geo.latitude, geo.longitude), // fetch details
      ])
      setCurrent(cur)
      setDaily(days)
      setHourly(details.hourly)
      setDailyDetail(details.daily)

      // Generate summaries (LLM or heuristic)
      const locLine = [geo.name, geo.admin1, geo.country].filter(Boolean).join(", ")
      const [s1, s2] = await Promise.all([
        summarizeWeather({ location: locLine, current: cur }),
        forecastSummary({ location: locLine, daily: days }),
      ])
      setSummary(s1)
      setForecastText(s2)
    } catch (err) {
      if (err?.code === "CITY_NOT_FOUND") {
        setError("City not found. Please check the spelling and try again.")
      } else {
        setError(err?.message || "Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const state = useMemo(
    () => ({
      loading,
      location,
      current,
      daily,
      summary,
      forecastText,
      error,
      favorites,
      hourly,
      dailyDetail,
    }),
    [loading, location, current, daily, summary, forecastText, error, favorites, hourly, dailyDetail],
  )

  const actions = useMemo(
    () => ({
      fetchWeather,
      addFavorite,
      removeFavorite,
    }),
    [fetchWeather, addFavorite, removeFavorite],
  )

  return [state, actions]
}
