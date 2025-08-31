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
    const { city, current, forecast3d } = body || {}

    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!key) {
      res.status(500).json({ error: "Missing GOOGLE_GENERATIVE_AI_API_KEY" })
      return
    }

    const genAI = new GoogleGenerativeAI(key)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
Write a friendly, 1–2 sentence weather summary for ${city}.
Current: ${JSON.stringify(current ?? {}, null, 2)}
3-day forecast (compact): ${JSON.stringify(forecast3d ?? {}, null, 2)}
Keep it practical (mention temp, condition, wind, and a suggestion). Limit to ~50 words.
    `.trim()

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    res.status(200).json({ text })
  } catch (error: any) {
    console.error("[v0] /api/summary error:", error?.message || error)
    res.status(500).json({ error: "Summary generation failed" })
  }
}
