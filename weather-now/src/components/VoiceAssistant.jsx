"use client"

// Simple voice assistant: STT (if available) + TTS responses.
// Uses Web Speech API where supported, with graceful fallbacks.
import { useEffect, useRef, useState } from "react"

export default function VoiceAssistant({ onAsk }) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const recRef = useRef(null)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SR) {
      setSupported(true)
      const recognition = new SR()
      recognition.lang = "en-US"
      recognition.interimResults = false
      recognition.maxAlternatives = 1
      recognition.onresult = async (e) => {
        const transcript = e.results?.[0]?.[0]?.transcript
        if (transcript) {
          const reply = (await onAsk?.(transcript)) || ""
          if ("speechSynthesis" in window && reply) {
            const utter = new SpeechSynthesisUtterance(reply)
            window.speechSynthesis.speak(utter)
          }
        }
      }
      recognition.onend = () => setListening(false)
      recognition.onerror = () => setListening(false)
      recRef.current = recognition
    }
  }, [onAsk])

  const toggle = () => {
    if (!supported) return
    if (listening) {
      recRef.current?.stop()
      setListening(false)
    } else {
      try {
        window.speechSynthesis?.cancel()
        recRef.current?.start()
        setListening(true)
      } catch {
        setListening(false)
      }
    }
  }

  return (
    <button
      className="voice"
      onClick={toggle}
      aria-pressed={listening}
      aria-label="Voice Assistant"
      title={supported ? "Ask by voice" : "Voice not supported in this browser"}
      disabled={!supported}
    >
      <span aria-hidden>{listening ? "🛑" : "🎙️"}</span>
      {supported ? (listening ? "Listening..." : "Ask by voice") : "Voice N/A"}
    </button>
  )
}
