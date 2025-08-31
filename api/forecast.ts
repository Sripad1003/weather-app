import { GoogleGenerativeAI } from "@google/generative-ai"

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }
  try {
    const buffers: Uint8Array[] = []
    await new Promise<void>((resolve, reject) => {
      req.on("data", (chunk: Uint8Array) => buffers.push(chunk))
      req.on("end", () => resolve())
      req.on("error", reject)
    })
    const body = buffers.length ? JSON.parse(Buffer.concat(buffers).toString("utf-8")) : {}
    const { city, daily, hourly } = body || {}

    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!key) {
      res.status(500).json({ error: "Missing GOOGLE_GENERATIVE_AI_API_KEY" })
      return
    }

    const genAI = new GoogleGenerativeAI(key)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
Provide a natural-language 3-day forecast summary for ${city}.
Daily data: ${JSON.stringify(daily ?? {}, null, 2)}
Hourly highlights: ${JSON.stringify(hourly ?? {}, null, 2)}
Be clear and actionable (rain chances, best times for outdoor activity). Keep each day's summary to 1–2 sentences.
    `.trim()

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    res.status(200).json({ text })
  } catch (error: any) {
    console.error("[v0] /api/forecast error:", error?.message || error)
    res.status(500).json({ error: "Forecast generation failed" })
  }
}
