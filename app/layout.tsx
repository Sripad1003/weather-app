import type React from "react"
import { Suspense } from "react"
import "./globals.css" // Import globals.css at the top of the file

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<div className="sr-only">Loading…</div>}>{children}</Suspense>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
