"use client";

interface WeatherPanelProps {
  windDirection: string; // "Ost", "Vest" etc.
  windSpeed: number;
  windAngle: number; // 0-360, 0 = nord, brukt for piltransform
  temperature: number;
  pressure: number;
  conditions: string;
}

/**
 * Vaerpanel for runde v2.
 */
export function WeatherPanel({
  windDirection,
  windSpeed,
  windAngle,
  temperature,
  pressure,
  conditions,
}: WeatherPanelProps) {
  return (
    <div
      className="absolute z-30 p-4 rounded-2xl border border-white/10 backdrop-blur-2xl text-white flex items-center gap-4"
      style={{
        background: "rgba(12,22,17,0.62)",
        top: 360,
        right: 24,
        width: 300,
      }}
    >
      <div className="relative w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center flex-shrink-0">
        <div
          className="absolute w-0 h-0"
          style={{
            transform: `rotate(${windAngle}deg)`,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderBottom: "12px solid #D1F843",
            top: 4,
          }}
        />
        <span className="text-sm font-bold tabular-nums">{windSpeed}</span>
      </div>
      <div className="flex-1">
        <div className="text-[13px] font-semibold mb-1.5">
          {windDirection} {windSpeed} m/s
        </div>
        <div className="text-[11px] text-white/55 flex gap-3">
          <span>{temperature}°C</span>
          <span>{pressure} hPa</span>
          <span>{conditions}</span>
        </div>
      </div>
    </div>
  );
}
