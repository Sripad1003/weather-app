export const CONFIG = {
  OPEN_METEO_BASE: "https://api.open-meteo.com/v1",
  GEOCODING_BASE: "https://geocoding-api.open-meteo.com/v1",
  // Optional: point this to your backend that wraps an LLM provider (OpenAI, Groq, etc.)
  // Expected POST body: { type: "summary"|"forecast"|"chat", payload: {...} }
  // Return: { text: "..." }
  LLM_ENDPOINT: "",
}
