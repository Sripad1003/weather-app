/**
 * Weather Now Logo
 * Colors (4 total):
 * - Brand Blue: #2563EB
 * - Sun Amber:  #F59E0B
 * - Text:       #0F172A
 * - White:      #FFFFFF (negative space)
 *
 * Usage:
 *   import Logo from "./components/Logo"
 *   <Logo size={32} withText />   // icon + wordmark
 *   <Logo size={24} />            // icon only
 */
export default function Logo({ size = 32, withText = true, title = "Weather Now" }) {
  const BLUE = "#2563EB"
  const AMBER = "#F59E0B"
  const TEXT = "#0F172A"

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: withText ? 10 : 0,
        color: TEXT,
      }}
      aria-label={title}
    >
      {/* Icon */}
      <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-labelledby="weather-now-logo-title">
        <title id="weather-now-logo-title">{title}</title>
        {/* Sun */}
        <circle cx="22" cy="22" r="9" fill={AMBER} />
        {/* Sun rays */}
        <g stroke={AMBER} strokeWidth="2" strokeLinecap="round">
          <line x1="22" y1="8" x2="22" y2="4" />
          <line x1="22" y1="40" x2="22" y2="44" />
          <line x1="8" y1="22" x2="4" y2="22" />
          <line x1="40" y1="22" x2="44" y2="22" />
          <line x1="12.7" y1="12.7" x2="9.9" y2="9.9" />
          <line x1="31.3" y1="31.3" x2="34.1" y2="34.1" />
          <line x1="31.3" y1="12.7" x2="34.1" y2="9.9" />
          <line x1="12.7" y1="31.3" x2="9.9" y2="34.1" />
        </g>

        {/* Cloud */}
        <g>
          <path
            d="M41 36c0-4.4-3.6-8-8-8-2.4 0-4.6 1.1-6 2.8-0.9-0.5-1.9-0.8-3-0.8-3.3 0-6 2.7-6 6 0 0.4 0 0.7 0.1 1H41c0-0.3 0-0.7 0-1z"
            fill={BLUE}
          />
          <rect x="18" y="36" width="30" height="8" rx="4" fill={BLUE} />
        </g>

        {/* Wind swirl */}
        <g stroke={BLUE} strokeWidth="2" fill="none" strokeLinecap="round">
          <path d="M12 49c6 0 10-2 16-2s10 2 16 2" />
          <path d="M18 53c4 0 6-1 10-1s6 1 10 1" />
        </g>
      </svg>

      {/* Wordmark */}
      {withText && (
        <span
          style={{
            fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
            fontSize: Math.round(size * 0.56),
            fontWeight: 700,
            letterSpacing: 0.2,
            lineHeight: 1,
            color: TEXT,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: BLUE }}>Weather</span> Now
        </span>
      )}
    </div>
  )
}
