"use client"

import * as React from "react"
import { useChat } from "ai/react"

type ChatWidgetProps = {
  title?: string
}

export default function ChatWidget({ title = "Ask WeatherNow" }: ChatWidgetProps) {
  const [open, setOpen] = React.useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  })

  React.useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeydown)
    return () => window.removeEventListener("keydown", onKeydown)
  }, [])

  return (
    <>
      <button
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-blue-600 text-white px-4 py-2 shadow-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {open ? "Close" : "Chat"}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="weathernow-chat-title"
          className="fixed bottom-20 right-4 z-50 w-[320px] max-w-[90vw] rounded-lg border border-gray-200 bg-white shadow-2xl dark:bg-neutral-900 dark:border-neutral-800"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-neutral-800">
            <h2 id="weathernow-chat-title" className="text-sm font-semibold">
              {title}
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800"
            >
              Esc
            </button>
          </div>

          <div className="h-64 overflow-y-auto px-3 py-2 space-y-2 text-sm">
            {messages.length === 0 && (
              <p className="text-gray-600 dark:text-gray-300">
                Ask about current conditions, a 3‑day forecast, or what to wear.
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.role === "user" ? "text-gray-900 dark:text-gray-100" : "text-blue-700 dark:text-blue-300"}
              >
                <span className="font-medium">{m.role === "user" ? "You: " : "Assistant: "}</span>
                <span>{m.content}</span>
              </div>
            ))}
            {isLoading && <p className="text-gray-500 dark:text-gray-400">Thinking…</p>}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 p-2 border-t border-gray-200 dark:border-neutral-800">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your question…"
              className="flex-1 rounded border border-gray-200 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:text-gray-100 dark:border-neutral-800"
              aria-label="Chat input"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded bg-blue-600 px-3 py-1 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  )
}
