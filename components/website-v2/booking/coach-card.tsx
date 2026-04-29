"use client";

import Image from "next/image";
import { Check } from "lucide-react";

interface CoachCardProps {
  name: string;
  role: string;
  image: string | null;
  description: string;
  tags: string[];
  selected: boolean;
  onSelect: () => void;
  photoVariant?: "default" | "lime";
}

export function CoachCard({
  name,
  role,
  image,
  description,
  tags,
  selected,
  onSelect,
  photoVariant = "default",
}: CoachCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group grid grid-cols-[200px_1fr] overflow-hidden rounded-[24px] border-[1.5px] bg-white text-left transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_18px_48px_rgba(10,31,24,0.10)] sm:grid-cols-[200px_1fr] ${
        selected
          ? "border-[var(--akgolf-primary,#005840)] shadow-[0_0_0_3px_rgba(0,88,64,0.10),0_18px_48px_rgba(10,31,24,0.08)]"
          : "border-[var(--akgolf-line-light,#E0E8E5)]"
      }`}
    >
      {/* Bilde */}
      <div
        className="relative h-full min-h-[260px] w-full overflow-hidden"
        style={{
          background:
            photoVariant === "lime"
              ? "linear-gradient(135deg, #1a2a08 0%, #3d5a15 100%)"
              : "linear-gradient(135deg, #0A1F18 0%, #005840 100%)",
        }}
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover object-[center_20%]"
            sizes="200px"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-4xl font-extrabold tracking-[-0.04em] text-white/85">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Innhold */}
      <div className="flex flex-col p-[28px_30px]">
        <div
          className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--akgolf-primary,#005840)]"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          {role}
        </div>
        <h3
          className="m-0 mb-[10px] flex items-center gap-[10px] text-[24px] font-extrabold leading-tight tracking-[-0.02em] text-[var(--akgolf-ink,#0A1F18)]"
          style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
        >
          {name}
          {selected ? (
            <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-[var(--akgolf-primary,#005840)] text-white">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
          ) : null}
        </h3>
        <p className="m-0 mb-4 text-sm leading-[1.55] text-[var(--akgolf-text,#324D45)]">
          {description}
        </p>
        <div className="mt-auto flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[rgba(0,88,64,0.06)] px-[9px] py-1 text-[10px] font-bold uppercase tracking-[0.10em] text-[var(--akgolf-primary,#005840)]"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
