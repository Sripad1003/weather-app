export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Basic shape validation
    const { email, city, message } = body || {}
    if (!message || typeof message !== "string") {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    // For now, we just log. Replace with DB/email integration later.
    console.log("[v0] feedback:", { email, city, message, ts: new Date().toISOString() })

    return Response.json({ ok: true })
  } catch (err: any) {
    console.error("[v0] feedback error:", err?.message || err)
    return Response.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
}
