'use client';

export default function DocBrioLogo({ size = 38, showWordmark = false, className = '' }) {
  return (
    <div className={`docbrio-logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="docbrio-svg-mark"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 4px 12px rgba(37, 99, 235, 0.35))' }}
      >
        <defs>
          {/* Main Electric Blue Gradient */}
          <linearGradient id="db-grad-blue" x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>

          {/* Vibeans Sunset Orange Energy Gradient */}
          <linearGradient id="db-grad-orange" x1="18" y1="12" x2="38" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="45%" stopColor="#ff7a00" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          {/* Surface Gloss Gradient */}
          <linearGradient id="db-grad-gloss" x1="0" y1="0" x2="0" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>

          {/* Document Fold Facet Gradient */}
          <linearGradient id="db-grad-facet" x1="22" y1="8" x2="34" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Base Obsidian Squircle Frame */}
        <rect
          x="1"
          y="1"
          width="42"
          height="42"
          rx="11"
          fill="#080e23"
          stroke="rgba(255, 255, 255, 0.14)"
          strokeWidth="1.2"
        />
        <rect
          x="1"
          y="1"
          width="42"
          height="42"
          rx="11"
          fill="url(#db-grad-gloss)"
        />

        {/* Left Vertical Spine of "D" / Document Stack */}
        <rect
          x="9"
          y="10"
          width="6"
          height="24"
          rx="3"
          fill="url(#db-grad-blue)"
        />

        {/* Outer Curved Body of "D" (Document Sheet Curve) */}
        <path
          d="M13 10H24C30.627 10 36 15.373 36 22C36 28.627 30.627 34 24 34H13V27.5H23C26.038 27.5 28.5 25.038 28.5 22C28.5 18.962 26.038 16.5 23 16.5H13V10Z"
          fill="url(#db-grad-blue)"
        />

        {/* Vibeans Orange Dynamic Fold & High-Speed "Brio" Conversion Wave */}
        <path
          d="M16 16.5H23.5C26.538 16.5 29 18.962 29 22C29 25.038 26.538 27.5 23.5 27.5H16L21 22L16 16.5Z"
          fill="url(#db-grad-orange)"
        />

        {/* Dynamic Fold Facet Upper Corner */}
        <path
          d="M23 10L32 19L27 20L23 10Z"
          fill="url(#db-grad-facet)"
          fillOpacity="0.75"
        />

        {/* Sleek Spark / Precision Node */}
        <circle cx="22" cy="22" r="1.8" fill="#ffffff" />
        <circle cx="30" cy="14" r="1.2" fill="#fed7aa" />
      </svg>

      {showWordmark && (
        <span
          className="logo-title"
          style={{
            color: '#ffffff',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          Doc<span className="gradient-text-blue" style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text' }}>Brio</span>
        </span>
      )}
    </div>
  );
}
