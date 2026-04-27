type MissionRingProps = {
  /** 0–100 */
  percent: number;
  color: string;
};

const RADIUS = 32;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 201

export function MissionRing({ percent, color }: MissionRingProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <svg
      className="h-[76px] w-[76px] shrink-0"
      viewBox="0 0 76 76"
      role="img"
      aria-label={`${clamped} prosent fullført`}
    >
      <circle
        cx="38"
        cy="38"
        r={RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="6"
      />
      <circle
        cx="38"
        cy="38"
        r={RADIUS}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        transform="rotate(-90 38 38)"
      />
      <text
        x="38"
        y="42"
        textAnchor="middle"
        fill="#fff"
        fontSize="14"
        fontWeight="700"
        fontFamily="JetBrains Mono, monospace"
      >
        {clamped}%
      </text>
    </svg>
  );
}
