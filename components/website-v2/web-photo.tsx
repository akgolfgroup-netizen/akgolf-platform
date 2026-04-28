import { Camera } from "lucide-react";
import Image from "next/image";

type Ratio = "16-9" | "4-3" | "3-2" | "1-1" | "3-4" | "2-3" | "21-9";
type Variant = "default" | "warm" | "lime" | "cream";

interface WebPhotoProps {
  src?: string;
  alt?: string;
  ratio?: Ratio;
  variant?: Variant;
  description?: string;
  tag?: string;
  className?: string;
  rounded?: boolean;
  children?: React.ReactNode;
}

const RATIOS: Record<Ratio, string> = {
  "16-9": "aspect-[16/9]",
  "4-3": "aspect-[4/3]",
  "3-2": "aspect-[3/2]",
  "1-1": "aspect-square",
  "3-4": "aspect-[3/4]",
  "2-3": "aspect-[2/3]",
  "21-9": "aspect-[21/9]",
};

const VARIANT_BG: Record<Variant, string> = {
  default: "linear-gradient(135deg, #0A1F18 0%, #005840 100%)",
  warm: "linear-gradient(135deg, #2a1a10 0%, #5a3a20 100%)",
  lime: "linear-gradient(135deg, #1a2a08 0%, #3d5a15 100%)",
  cream: "linear-gradient(135deg, #d8d0bc 0%, #f5efde 100%)",
};

export function WebPhoto({
  src,
  alt,
  ratio = "3-2",
  variant = "default",
  description,
  tag = "[Foto]",
  className = "",
  rounded = true,
  children,
}: WebPhotoProps) {
  const isCream = variant === "cream";

  return (
    <div
      className={`relative isolate flex items-center justify-center overflow-hidden ${
        RATIOS[ratio]
      } ${rounded ? "rounded-[20px]" : ""} ${className}`}
      style={{ background: VARIANT_BG[variant] }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? description ?? ""}
          fill
          className="object-cover"
          sizes="(max-width: 900px) 100vw, 50vw"
        />
      ) : (
        <>
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(circle at 20% 30%, rgba(209,248,67,0.10), transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.04), transparent 60%), repeating-linear-gradient(45deg, transparent 0 12px, rgba(255,255,255,0.02) 12px 24px)",
            }}
          />
          {description ? (
            <div className="relative z-[2] flex max-w-[80%] flex-col items-center gap-3 px-6 text-center">
              <div
                className={`grid h-14 w-14 place-items-center rounded-2xl border backdrop-blur-md ${
                  isCream
                    ? "border-[rgba(10,31,24,0.15)] bg-[rgba(10,31,24,0.08)] text-[var(--akgolf-ink,#0A1F18)]"
                    : "border-white/20 bg-white/[0.12] text-white/85"
                }`}
              >
                <Camera className="h-6 w-6" strokeWidth={1.6} />
              </div>
              <div
                className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                  isCream
                    ? "text-[var(--akgolf-primary,#005840)]"
                    : "text-[rgba(209,248,67,0.95)]"
                }`}
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                {tag}
              </div>
              <div
                className={`text-[13px] font-medium leading-[1.45] tracking-[-0.005em] ${
                  isCream ? "text-[rgba(10,31,24,0.75)]" : "text-white/85"
                }`}
              >
                {description}
              </div>
              <div
                className={`text-[9px] tracking-[0.14em] ${
                  isCream ? "text-[rgba(10,31,24,0.40)]" : "text-white/45"
                }`}
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                {ratio} · landscape
              </div>
            </div>
          ) : null}
        </>
      )}
      {children}
    </div>
  );
}
