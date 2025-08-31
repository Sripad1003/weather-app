// Use a client component so we can render hooks and client-only logic safely.
// Also wrap in Suspense to satisfy components that use useSearchParams.

"use client"

import { Suspense } from "react"
import "../src/styles/global.css"
import Home from "../src/pages/Home"

export default function Page() {
  return (
    <Suspense fallback={<div className="sr-only">Loading…</div>}>
      <Home />
    </Suspense>
  )
}
