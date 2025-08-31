import type { NextRequest } from "next/server"
import { streamText, convertToCoreMessages } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const messages = Array.isArray(body?.messages) ? body.messages : []

  const trimmed = messages.slice(-20)

  const result = await streamText({
    model: google("models/gemini-1.5-flash"),
    system:
      "You are WeatherNow Assistant. Help concisely with weather conditions, 3-day outlooks, and practical tips. Ask clarifying questions when needed.",
    messages: convertToCoreMessages(trimmed),
  })

  return result.toAIStreamResponse()
}
