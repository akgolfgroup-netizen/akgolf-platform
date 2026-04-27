"use client";

// Forenklet approach-illustrasjon (green med dispersion)
export function ApproachIllustration() {
  return (
    <svg
      viewBox="0 0 360 432"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full block"
    >
      <defs>
        <radialGradient id="approachGrass" cx="50%" cy="48%" r="62%">
          <stop offset="0%" stopColor="#5A8F3E" />
          <stop offset="55%" stopColor="#4A7A35" />
          <stop offset="100%" stopColor="#2F5524" />
        </radialGradient>
        <radialGradient id="approachGreen" cx="50%" cy="48%" r="55%">
          <stop offset="0%" stopColor="#7BB04A" />
          <stop offset="70%" stopColor="#5E924A" />
          <stop offset="100%" stopColor="#3F6B30" />
        </radialGradient>
        <radialGradient id="approachEllTight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#D1F843" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#D1F843" stopOpacity="0.18" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="360" height="432" fill="url(#approachGrass)" />

      <g transform="translate(180, 200)">
        <circle r="155" fill="#3D6B2C" opacity="0.55" />
        <circle r="115" fill="#3F6B30" opacity="0.7" />
        <circle r="92" fill="#5E924A" />
        <circle r="84" fill="#4A7A35" />
        <circle r="70" fill="url(#approachGreen)" />
      </g>

      <g
        fontFamily="JetBrains Mono"
        fontSize="9"
        fill="#FFFFFF"
        fillOpacity="0.55"
        letterSpacing="0.1em"
      >
        <text x="180" y="80" textAnchor="middle">
          160m
        </text>
        <text
          x="180"
          y="118"
          textAnchor="middle"
          fontWeight="600"
          fill="#D1F843"
          fillOpacity="0.9"
        >
          152m · MÅL
        </text>
        <text x="180" y="318" textAnchor="middle">
          140m
        </text>
      </g>

      <g transform="translate(180, 200)">
        <line x1="0" y1="0" x2="0" y2="-26" stroke="#F4F4F0" strokeWidth="1.4" />
        <path d="M 0 -26 L 12 -22 L 0 -18 Z" fill="#F4F4F0" />
        <circle cx="0" cy="0" r="2.4" fill="#0A1F18" />
      </g>

      <ellipse
        cx="178"
        cy="208"
        rx="46"
        ry="64"
        fill="rgba(209,248,67,0.10)"
        stroke="#FFF7B0"
        strokeOpacity="0.45"
        strokeWidth="1"
        strokeDasharray="3,3"
        transform="rotate(-4 178 208)"
      />
      <ellipse
        cx="180"
        cy="204"
        rx="22"
        ry="32"
        fill="url(#approachEllTight)"
        stroke="#FFFFFF"
        strokeOpacity="0.7"
        strokeWidth="1.2"
        transform="rotate(-4 180 204)"
      />

      {Array.from({ length: 14 }).map((_, i) => {
        const x = 170 + ((i * 17) % 30);
        const y = 188 + ((i * 11) % 36);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={3.2}
            fill="#FFFCEA"
            stroke="#0A1F18"
            strokeWidth="0.6"
          />
        );
      })}
    </svg>
  );
}

// Forenklet tee-illustrasjon (fairway med dispersion + tee-marker)
export function TeeIllustration() {
  return (
    <svg
      viewBox="0 0 360 432"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full block"
    >
      <defs>
        <linearGradient id="teeFw" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#5A8F3E" />
          <stop offset="100%" stopColor="#3A6428" />
        </linearGradient>
        <radialGradient id="teeRough" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#3F6B30" />
          <stop offset="100%" stopColor="#1F3814" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="360" height="432" fill="url(#teeRough)" />

      <path
        d="M 110 0 Q 100 220, 130 432 L 230 432 Q 260 220, 250 0 Z"
        fill="url(#teeFw)"
      />

      <g opacity="0.10" stroke="#2E5220" strokeWidth="14">
        <line x1="-50" y1="0" x2="220" y2="540" />
        <line x1="20" y1="0" x2="290" y2="540" />
        <line x1="90" y1="0" x2="360" y2="540" />
      </g>

      <ellipse
        cx="298"
        cy="160"
        rx="32"
        ry="20"
        fill="#E5D9B8"
        stroke="#A8915F"
        strokeWidth="0.5"
      />
      <ellipse
        cx="68"
        cy="240"
        rx="28"
        ry="18"
        fill="#E5D9B8"
        stroke="#A8915F"
        strokeWidth="0.5"
      />

      <ellipse
        cx="180"
        cy="195"
        rx="40"
        ry="100"
        fill="rgba(209,248,67,0.10)"
        stroke="rgba(209,248,67,0.6)"
        strokeWidth="1"
        strokeDasharray="3,3"
      />
      <ellipse
        cx="180"
        cy="195"
        rx="20"
        ry="50"
        fill="rgba(209,248,67,0.50)"
        stroke="#FFFFFF"
        strokeOpacity="0.7"
        strokeWidth="1.2"
      />

      {Array.from({ length: 22 }).map((_, i) => {
        const x = 165 + ((i * 13) % 32);
        const y = 150 + ((i * 23) % 90);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={3}
            fill="#FFFCEA"
            stroke="#0A1F18"
            strokeWidth="0.6"
          />
        );
      })}

      <g transform="translate(180, 410)">
        <rect
          x="-14"
          y="-3"
          width="28"
          height="6"
          rx="1"
          fill="#7A6240"
          stroke="#A8915F"
          strokeWidth="0.5"
        />
        <text
          y="-9"
          fontFamily="JetBrains Mono"
          fontSize="9"
          fill="#D1F843"
          textAnchor="middle"
          fontWeight="700"
          letterSpacing="0.1em"
        >
          TEE
        </text>
      </g>
    </svg>
  );
}
