"use client"

import { useState } from "react"

export default function CityChat({ cityLabel, cityObj, weather, forecast }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Ask me anything about ${cityLabel || cityObj?.name || "this city"}!` },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSend(e) {
    e.preventDefault()
    const q = input.trim()
    if (!q) return
    const next = [...messages, { role: "user", content: q }]
    setMessages(next)
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/city-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: cityObj || cityLabel,
          weather,
          forecast,
          question: q,
          history: messages,
        }),
      })
      const data = await res.json()
      const answer = data?.text || "Sorry, I couldn’t generate a response."
      setMessages((m) => [...m, { role: "assistant", content: answer }])
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I ran into an issue answering that. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section aria-labelledby="city-chat-title" style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16 }}>
      <h2 id="city-chat-title" style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
        Ask about this city
      </h2>
      <div
        role="log"
        aria-live="polite"
        style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 260, overflow: "auto", marginBottom: 12 }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
            <div
              style={{
                background: m.role === "user" ? "#2563EB" : "#F3F4F6",
                color: m.role === "user" ? "#ffffff" : "#0F172A",
                padding: "8px 10px",
                borderRadius: 10,
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={onSend} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., What’s a good time for a run today?"
          aria-label="Ask a question about the city"
          style={{
            flex: 1,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "10px 12px",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#2563EB",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: 8,
            border: 0,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </section>
  )
}
