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
    console.log("[v0] feedback submission:", body)
    res.status(200).json({ ok: true })
  } catch (error: any) {
    console.error("[v0] /api/feedback error:", error?.message || error)
    res.status(500).json({ error: "Feedback failed" })
  }
}
