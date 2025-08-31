// Optional LLM integration. If CONFIG.LLM_ENDPOINT is set, it will call that endpoint.
// Otherwise, it falls back to deterministic, human-friendly summaries on-device.
import { CONFIG } from "../config.js"

async function callLLM(type, payload) {
  if (!CONFIG.LLM_ENDPOINT) return null // no remote LLM configured
  const res = await fetch(CONFIG.LLM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, payload }),
  })
  if (!res.ok) throw new Error("LLM service error")
  const data = await res.json()
  return data?.text || null
}

export async function summarizeWeather({ location, current, persona = "outdoor enthusiast" }) {
  // Try remote LLM first
  try {
    const llm = await callLLM("summary", { location, current, persona })
    if (llm) return llm
  } catch {
    // fallthrough to heuristic
  }

  // Heuristic fallback summary
  const { temperature, condition, wind_speed } = current || {}
  let rec = ""
  if (temperature >= 30) {
    rec = "It's quite hot. Prefer early morning or evening activities; stay hydrated."
  } else if (temperature >= 22) {
    rec = "Warm and pleasant—great for a run or cycling."
  } else if (temperature >= 15) {
    rec = "Mild conditions—ideal for a walk or light jog."
  } else if (temperature >= 8) {
    rec = "Cool weather—layer up if you're heading outside."
  } else {
    rec = "Chilly conditions—dress warmly if you go out."
  }

  if (/rain|shower/i.test(condition)) {
    rec = "Expect rain—consider indoor workouts or bring a waterproof jacket."
  } else if (/thunder/i.test(condition)) {
    rec = "Thunderstorms possible—postpone outdoor activities for safety."
  } else if (/snow/i.test(condition)) {
    rec = "Snowy—great for winter activities if you're prepared."
  } else if (/clear|sun/i.test(condition)) {
    // keep as is
  }

  const breeze =
    wind_speed <= 8
      ? "a calm breeze"
      : wind_speed <= 18
        ? "a light breeze"
        : wind_speed <= 30
          ? "a noticeable wind"
          : "strong winds"

  return `It's a ${temperature}°C ${condition.toLowerCase()} day in ${location}. Winds at ${wind_speed} km/h (${breeze}). ${rec}`
}

export async function forecastSummary({ location, daily }) {
  try {
    const llm = await callLLM("forecast", { location, daily })
    if (llm) return llm
  } catch {
    // fallback
  }

  // Heuristic 3-day summary
  if (!daily?.length) return "No forecast data available."
  const lines = daily.map((d) => {
    return `${d.date}: ${d.condition.toLowerCase()}, ${d.temp_min}°C–${d.temp_max}°C, wind up to ${d.wind_max} km/h.`
  })
  return `3‑Day Outlook for ${location}:\n• ${lines.join("\n• ")}`
}

export async function chatAnswer({ question, context }) {
  try {
    const llm = await callLLM("chat", { question, context })
    if (llm) return llm
  } catch {
    // fallback
  }
  // Fallback rule-based response for common intents
  const q = question.toLowerCase()
  if (q.includes("best time") || q.includes("when should i")) {
    return "Generally, early morning or late afternoon offers cooler temperatures and lower UV exposure. Check wind and precipitation before heading out."
  }
  if (q.includes("hike") || q.includes("run") || q.includes("jog")) {
    return "Aim for times with moderate temperatures (15–22°C), minimal wind, and no precipitation. Adjust for your comfort and route difficulty."
  }
  return "I recommend lighter outdoor activities if conditions are warm and clear; consider indoor options if it's rainy or stormy. Check the forecast above."
}
