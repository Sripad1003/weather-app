import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { location, current, persona = "outdoor enthusiast" } = body || {}

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GOOGLE_GENERATIVE_AI_API_KEY" }, { status: 500 })
    }

    const { GoogleGenerativeAI } = await import("@google/generative-ai")
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const sys =
      "You are Weather Now's assistant. Create a concise, friendly 1-2 sentence weather summary grounded in the provided data. Use °C. Mention temperature, condition, wind, and a quick activity tip. Keep it specific to the location."

    const user = [
      `Location: ${location || "Unknown"}`,
      `Current: ${JSON.stringify(current || {})}`,
      `Persona: ${persona}`,
    ].join("\n")

    const prompt = `${sys}\n\n${user}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return NextResponse.json({ text })
  } catch (err: any) {
    console.error("[v0] /api/summary error:", err?.message)
    return NextResponse.json({ error: "Failed to summarize weather" }, { status: 500 })
  }
}
