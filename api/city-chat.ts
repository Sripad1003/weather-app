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
    const { city, question, context } = body || {}

    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!key) {
      res.status(500).json({ error: "Missing GOOGLE_GENERATIVE_AI_API_KEY" })
      return
    }

    const genAI = new GoogleGenerativeAI(key)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
You are a helpful assistant answering questions about the city "${city}".
Use the given context (current weather and short forecast) when helpful.
Keep answers concise (<= 120 words) unless the question clearly needs detail.

Question: ${question || "General guidance about the city weather"}
Context: ${typeof context === "string" ? context : JSON.stringify(context ?? {}, null, 2)}
    `.trim()

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    res.status(200).json({ text })
  } catch (error: any) {
    console.error("[v0] city-chat error:", error?.message || error)
    res.status(500).json({ error: "City chat failed" })
  }
}
