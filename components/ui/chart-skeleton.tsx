"use client";

interface ChartSkeletonProps {
  height?: string;
  className?: string;
}

/**
 * Brand Guide V2.0 chart-skeleton — vises mens recharts lazy-loades.
 * Brukes som loading-fallback i dynamic()-imports.
 */
export function ChartSkeleton({
  height = "240px",
  className = "",
}: ChartSkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-surface-soft ${className}`}
      style={{ height }}
      role="status"
      aria-label="Laster diagram"
    >
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-line-soft via-surface-soft to-line-soft" />
      <span className="sr-only">Laster diagram...</span>
    </div>
  );
}
