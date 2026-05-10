import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

interface CourseCardProps {
  courseName: string;
  location?: string;
  par: number;
  holes: number;
  rating?: number;
  slope?: number;
  /** URL til bane-bilde (valgfritt) */
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
}

function StatBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: 10,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "#9C9990",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: 14,
          fontWeight: 500,
          color: "#0A1F18",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function CourseCard({
  courseName,
  location,
  par,
  holes,
  rating,
  slope,
  imageUrl,
  onClick,
  className,
}: CourseCardProps) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "relative overflow-hidden text-left transition-all duration-200",
        onClick && "cursor-pointer",
        className
      )}
      style={{
        borderRadius: 20,
        border: imageUrl ? "none" : "1px solid #E5E3DD",
        backgroundColor: imageUrl ? undefined : "#FFFFFF",
        boxShadow:
          "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "scale(1.01)";
        el.style.boxShadow =
          "0 1px 2px rgba(15,31,24,0.06), 0 14px 32px rgba(15,31,24,0.08)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "scale(1)";
        el.style.boxShadow =
          "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)";
      }}
    >
      {/* Bakgrunnsbilde */}
      {imageUrl && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(0.7) brightness(0.85)",
          }}
        />
      )}

      {/* Innhold med glassmorfisk overlay eller direkte */}
      <div
        className="relative"
        style={
          imageUrl
            ? {
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                backgroundColor: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 20,
                margin: 8,
                padding: "16px 20px",
              }
            : {
                padding: "16px 20px",
              }
        }
      >
        {/* Banenavn */}
        <h3
          style={{
            fontFamily: "var(--font-inter-tight)",
            fontSize: 18,
            fontWeight: 700,
            color: "#0A1F18",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {courseName}
        </h3>

        {/* Lokasjon */}
        {location && (
          <div className="mt-1 flex items-center gap-1">
            <MapPin
              size={14}
              strokeWidth={1.75}
              style={{ color: "#5E5C57", flexShrink: 0 }}
            />
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: 12,
                color: "#5E5C57",
              }}
            >
              {location}
            </span>
          </div>
        )}

        {/* Stats-rad */}
        <div className="mt-3 flex items-center gap-4">
          <StatBlock label="Par" value={par} />
          <StatBlock label="Hull" value={holes} />
          {rating !== undefined && (
            <StatBlock label="Rating" value={rating.toFixed(1)} />
          )}
          {slope !== undefined && <StatBlock label="Slope" value={slope} />}
        </div>
      </div>
    </Wrapper>
  );
}
