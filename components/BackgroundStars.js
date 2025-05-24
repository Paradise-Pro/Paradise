export default function BackgroundStars() {
  return (
    <svg
      viewBox="0 0 1440 1024"
      preserveAspectRatio="none"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <defs>
        <radialGradient id="bubble" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9cf6f6" />
          <stop offset="100%" stopColor="#0585d0" />
        </radialGradient>

        <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#26c6da" />
          <stop offset="100%" stopColor="#0277bd" />
        </linearGradient>
      </defs>

      <rect width="1440" height="1024" fill="url(#bgGradient)" />

      {/* Animated Bubbles */}
      <circle cx="300" cy="300" r="140" fill="url(#bubble)">
        <animate
          attributeName="cy"
          values="280;320;280"
          dur="8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="700" cy="180" r="80" fill="url(#bubble)">
        <animate
          attributeName="cy"
          values="170;190;170"
          dur="6s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="1100" cy="800" r="160" fill="url(#bubble)">
        <animate
          attributeName="cy"
          values="790;820;790"
          dur="10s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="400" cy="850" r="60" fill="url(#bubble)">
        <animate
          attributeName="cy"
          values="840;860;840"
          dur="5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="1300" cy="300" r="90" fill="url(#bubble)">
        <animate
          attributeName="cy"
          values="290;310;290"
          dur="7s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
