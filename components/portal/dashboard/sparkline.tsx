"use client";

interface SparklineProps {
  data?: number[];
  color?: string;
  height?: number;
}

export function Sparkline({ data = [3, 5, 4, 7, 6, 8, 9], color = "#2D6A4F", height = 32 }: SparklineProps) {
  const max = Math.max(...data);
  const barWidth = 4;
  const gap = 3;
  const totalWidth = data.length * (barWidth + gap) - gap;

  return (
    <svg width={totalWidth} height={height} viewBox={`0 0 ${totalWidth} ${height}`}>
      {data.map((value, i) => {
        const barHeight = (value / max) * height;
        const isLast = i === data.length - 1;
        return (
          <rect
            key={i}
            x={i * (barWidth + gap)}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            rx={2}
            fill={isLast ? color : "#E8E8ED"}
          />
        );
      })}
    </svg>
  );
}
