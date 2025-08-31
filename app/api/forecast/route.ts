import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { location, daily } = body || {}

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GOOGLE_GENERATIVE_AI_API_KEY" }, { status: 500 })
    }

    const { GoogleGenerativeAI } = await import("@google/generative-ai")
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const sys =
      "You are Weather Now's assistant. Write a clear, compact 3-day outlook using °C. Use 2-4 short bullet points. Include condition, temp range, and notable wind/precipitation."

    const user = [
      `Location: ${location || "Unknown"}`,
      `Daily (array of {date, condition, temp_min, temp_max, wind_max}):`,
      JSON.stringify(daily || []),
    ].join("\n")

    const prompt = `${sys}\n\n${user}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return NextResponse.json({ text })
  } catch (err: any) {
    console.error("[v0] /api/forecast error:", err?.message)
    return NextResponse.json({ error: "Failed to summarize forecast" }, { status: 500 })
  }
}
