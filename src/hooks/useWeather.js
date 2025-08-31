"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { geocodeCity, getCurrentWeather, get3DayForecast } from "../api/weatherApi.js"
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

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("weather:favorites")
      if (raw) setFavorites(JSON.parse(raw))
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
    const key = [location.name, location.admin1, location.country].filter(Boolean).join(", ")
    if (favorites.includes(key)) return
    const next = [...favorites, key].slice(0, 12)
    saveFavorites(next)
  }, [favorites, location, saveFavorites])

  const removeFavorite = useCallback(
    (key) => {
      const next = favorites.filter((f) => f !== key)
      saveFavorites(next)
    },
    [favorites, saveFavorites],
  )

  const fetchWeather = useCallback(async (city) => {
    setError("")
    setLoading(true)
    setSummary("")
    setForecastText("")
    try {
      const geo = await geocodeCity(city)
      setLocation(geo)
      const [cur, days] = await Promise.all([
        getCurrentWeather(geo.latitude, geo.longitude),
        get3DayForecast(geo.latitude, geo.longitude),
      ])
      setCurrent(cur)
      setDaily(days)

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
    }),
    [loading, location, current, daily, summary, forecastText, error, favorites],
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
