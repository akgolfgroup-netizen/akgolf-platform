import { Sparkles } from "lucide-react";

interface AiStripProps {
  heading: string;
  body: string;
}

export function AiStrip({ heading, body }: AiStripProps) {
  return (
    <div
      className="mb-5 flex items-start gap-3.5 rounded-2xl border px-5 py-4"
      style={{
        background: "rgba(175,82,222,0.06)",
        borderColor: "rgba(175,82,222,0.20)",
      }}
    >
      <div
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
        style={{ background: "rgba(175,82,222,0.20)", color: "#C896E8" }}
      >
        <Sparkles className="h-4 w-4" strokeWidth={1.8} />
      </div>
      <div>
        <h4 className="m-0 mb-1 text-[13px] font-semibold text-white">
          {heading}
        </h4>
        <p className="m-0 text-[12px] leading-[1.55] text-white/70">{body}</p>
      </div>
    </div>
  );
}
