export function HcpLineChart() {
  return (
    <section
      className="mb-[18px] rounded-[14px] p-6"
      style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
    >
      <div className="mb-[18px] flex items-end justify-between">
        <h3 className="text-[15px] font-bold text-white">
          HCP-utvikling per spillertype · siste 12 måneder
        </h3>
        <div className="font-mono text-[10px] tracking-[0.10em] text-white/55">
          42 SPILLERE · MÅNEDLIG SNITT · ELITE = HCP &lt;12, MID = 12–24
        </div>
      </div>

      <div className="relative" style={{ height: "240px", paddingBottom: "24px" }}>
        <svg
          viewBox="0 0 800 220"
          preserveAspectRatio="none"
          className="block h-full w-full"
        >
          <defs>
            <linearGradient id="rapportGrad1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#D1F843" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#D1F843" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2">
            <line x1="0" y1="20" x2="800" y2="20" />
            <line x1="0" y1="65" x2="800" y2="65" />
            <line x1="0" y1="110" x2="800" y2="110" />
            <line x1="0" y1="155" x2="800" y2="155" />
            <line x1="0" y1="200" x2="800" y2="200" />
          </g>

          <text x="6" y="24" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.45)">20</text>
          <text x="6" y="69" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.45)">15</text>
          <text x="6" y="114" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.45)">10</text>
          <text x="6" y="159" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.45)">5</text>
          <text x="6" y="204" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.45)">0</text>

          {/* Elite area + line */}
          <path
            d="M 40 138 L 100 132 L 160 128 L 220 130 L 280 122 L 340 116 L 400 110 L 460 108 L 520 105 L 580 100 L 640 96 L 700 92 L 760 86 L 760 200 L 40 200 Z"
            fill="url(#rapportGrad1)"
            opacity="0.5"
          />
          <path
            d="M 40 138 L 100 132 L 160 128 L 220 130 L 280 122 L 340 116 L 400 110 L 460 108 L 520 105 L 580 100 L 640 96 L 700 92 L 760 86"
            stroke="#D1F843"
            strokeWidth="2.5"
            fill="none"
          />
          <circle cx="760" cy="86" r="4" fill="#D1F843" />

          {/* Mid line dashed */}
          <path
            d="M 40 60 L 100 62 L 160 60 L 220 58 L 280 60 L 340 56 L 400 52 L 460 54 L 520 50 L 580 46 L 640 44 L 700 42 L 760 38"
            stroke="#6BB1FF"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 3"
          />
          <circle cx="760" cy="38" r="3" fill="#6BB1FF" />

          <text x="40" y="218" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.45)">MAI</text>
          <text x="160" y="218" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.45)">JUL</text>
          <text x="280" y="218" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.45)">SEP</text>
          <text x="400" y="218" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.45)">NOV</text>
          <text x="520" y="218" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.45)">JAN</text>
          <text x="640" y="218" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.45)">MAR</text>
          <text x="730" y="218" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.45)">APR</text>
        </svg>

        <div
          className="absolute right-3.5 top-1.5 font-mono text-[11px] text-white/65"
        >
          <span style={{ color: "#D1F843" }}>●</span> ELITE 11.4 → 8.2
          <span className="ml-3.5" style={{ color: "#6BB1FF" }}>●</span> MID 18.7 → 14.4
        </div>
      </div>
    </section>
  );
}
