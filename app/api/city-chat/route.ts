import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { city, question, weather, forecast, history } = body || {}

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GOOGLE_GENERATIVE_AI_API_KEY" }, { status: 500 })
    }

    // Lazy import to keep cold start light
    const { GoogleGenerativeAI } = await import("@google/generative-ai")
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const sys = [
      "You are Weather Now's city assistant.",
      "Answer briefly and helpfully about the chosen city using the provided weather and forecast data.",
      "If the user asks for something unrelated to the city/weather, politely steer them back.",
      "Be concise by default; include specifics (temps, wind, precipitation) when relevant.",
    ].join(" ")

    const contextParts: string[] = []
    if (city) contextParts.push(`City: ${typeof city === "string" ? city : JSON.stringify(city)}`)
    if (weather) contextParts.push(`Current: ${JSON.stringify(weather)}`)
    if (forecast) contextParts.push(`Forecast: ${JSON.stringify(forecast)}`)

    const historyText =
      Array.isArray(history) && history.length
        ? `\nConversation history:\n${history
            .slice(-6)
            .map((m: any) => `${m.role}: ${m.content}`)
            .join("\n")}\n`
        : ""

    const prompt = [
      sys,
      "",
      "Context:",
      contextParts.join("\n"),
      "",
      "User question:",
      question || "Give me a concise overview.",
      historyText,
    ].join("\n")

    const result = await model.generateContent(prompt)
    const text = result.response.text() || ""
    return NextResponse.json({ text })
  } catch (err: any) {
    console.error("[v0] city-chat error:", err?.message)
    return NextResponse.json({ error: "Failed to get response from Gemini" }, { status: 500 })
  }
}
