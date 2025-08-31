"use client"

import React from "react"

export default function FeedbackWidget() {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [city, setCity] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [status, setStatus] = React.useState(null) // { type: 'success'|'error', text: string }
  const [submitting, setSubmitting] = React.useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city, message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to submit feedback")
      setStatus({ type: "success", text: "Thanks! Your feedback was sent." })
      setEmail("")
      setCity("")
      setMessage("")
      setOpen(false)
    } catch (err) {
      setStatus({ type: "error", text: err.message || "Something went wrong." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* floating button */}
      <button
        type="button"
        aria-label="Open feedback"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-primary px-4 py-2 text-white shadow-md hover:opacity-90"
      >
        Feedback
      </button>

      {/* simple modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div className="w-full max-w-md rounded-lg bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 id="feedback-title" className="text-lg font-semibold">
                Send feedback
              </h3>
              <button aria-label="Close" onClick={() => setOpen(false)} className="rounded p-1 hover:bg-muted">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Email (optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded border px-3 py-2 text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City (optional)</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded border px-3 py-2 text-sm"
                  placeholder="Bangalore"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded border px-3 py-2 text-sm"
                  rows={4}
                  placeholder="Tell us what’s great or what we can improve…"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded border px-3 py-2 text-sm hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded bg-primary px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send"}
                </button>
              </div>
            </form>

            {status && (
              <p
                className={`mt-3 text-sm ${status.type === "success" ? "text-green-600" : "text-red-600"}`}
                role="status"
                aria-live="polite"
              >
                {status.text}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
