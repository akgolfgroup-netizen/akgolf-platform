import {
  Bookmark,
  Download,
  FileText,
  Play,
  Users,
} from "lucide-react";
import type { ResourceCard as ResourceCardData } from "./mock-data";

export function ResourceCard({ resource }: { resource: ResourceCardData }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[14px] border border-[#1a4a3a] bg-[#0D2E23]">
      <div
        className="relative flex aspect-[16/10] items-end px-3.5 py-3"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(13,46,35,0.40), rgba(0,0,0,0.30)), repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0 12px, rgba(255,255,255,0.05) 12px 24px)",
        }}
      >
        <span className="absolute left-2.5 top-2.5 rounded-md bg-black/50 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.10em] text-white">
          {resource.type} · {resource.category}
        </span>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="grid h-[46px] w-[46px] place-items-center rounded-full border-[1.5px] border-white/30 bg-black/50">
            {resource.isVideo ? (
              <Play className="h-[18px] w-[18px] text-white" strokeWidth={1.8} />
            ) : (
              <FileText
                className="h-[18px] w-[18px] text-white"
                strokeWidth={1.8}
              />
            )}
          </div>
        </div>
        <span className="absolute bottom-2.5 right-2.5 rounded-[4px] bg-black/60 px-1.5 py-0.5 font-mono text-[9.5px] text-white">
          {resource.duration}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 py-3.5">
        <div className="text-[14px] font-bold leading-[1.35] tracking-[-0.01em] text-white">
          {resource.title}
        </div>
        <div className="mt-1.5 flex-1 text-[12px] leading-[1.5] text-white/65">
          {resource.description}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1">
          {resource.tags.map((t) => (
            <span
              key={t}
              className="rounded-[4px] border border-white/[0.06] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-[0.06em] text-white/65"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#1a4a3a] px-4 py-2.5 font-mono text-[10px] text-white/55">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1">
            <Users className="h-[11px] w-[11px]" strokeWidth={1.8} />
            {resource.views}
          </span>
          <span className="inline-flex items-center gap-1">
            {resource.iconType === "bookmark" ? (
              <Bookmark className="h-[11px] w-[11px]" strokeWidth={1.8} />
            ) : (
              <Download className="h-[11px] w-[11px]" strokeWidth={1.8} />
            )}
            {resource.saves}
          </span>
        </div>
        <span>{resource.age}</span>
      </div>
    </article>
  );
}
