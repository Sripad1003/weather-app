"use client"

import { useState } from "react"

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState("")

  const submit = (e) => {
    e.preventDefault()
    const v = value.trim()
    if (!v) return
    onSearch(v)
  }

  return (
    <form className="card section" onSubmit={submit} aria-label="Search City">
      <div className="grid" style={{ gap: 8 }}>
        <label htmlFor="city" className="small">
          Enter a city to see current weather
        </label>
        <div className="input-row">
          <input
            id="city"
            className="input"
            placeholder="Search city (e.g., Bangalore)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={loading}
            aria-disabled={loading}
            aria-label="City name"
          />
          <button className="button" type="submit" disabled={loading} aria-busy={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
    </form>
  )
}
