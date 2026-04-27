import { Bookmark, Play, Share2 } from "lucide-react";

export function FeaturedCard() {
  return (
    <section className="mb-[18px] grid gap-6 rounded-[18px] border border-accent/25 bg-gradient-to-br from-accent/10 to-transparent bg-[#0D2E23] px-7 py-6 [grid-template-columns:1.4fr_1fr]">
      <div>
        <div className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-accent">
          ★ FEATURED · DENNE UKEN
        </div>
        <h3 className="mt-2 font-inter-tight text-[22px] font-extrabold tracking-[-0.02em] text-white">
          Trackman 4: Slik leser du spin-axis
        </h3>
        <p className="mt-2 max-w-[50ch] text-[13.5px] leading-[1.55] text-white/70">
          Erik forklarer hva spin-axis virkelig betyr, hvorfor +12° er
          problematisk for high-handicap, og hvordan du jobber det ned mot 0
          over en sesong. 18 minutter, eksempler fra Anders, Markus, Sofie.
        </p>
        <div className="mt-3.5 flex gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-[13px] font-bold text-ink"
          >
            <Play className="h-3.5 w-3.5" strokeWidth={2.2} /> Spill
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-white/90"
          >
            <Share2 className="h-3.5 w-3.5" strokeWidth={1.8} /> Del med spiller
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-medium text-white/70 hover:bg-white/5"
          >
            <Bookmark className="h-3.5 w-3.5" strokeWidth={1.8} /> Lagre
          </button>
        </div>
      </div>
      <div
        className="grid aspect-video place-items-center rounded-xl"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(13,46,35,0.40), rgba(0,0,0,0.30)), repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0 14px, rgba(255,255,255,0.05) 14px 28px)",
        }}
      >
        <div className="grid h-15 w-15 place-items-center rounded-full border border-accent/40 bg-black/50">
          <Play className="h-[22px] w-[22px] text-accent" strokeWidth={1.8} />
        </div>
      </div>
    </section>
  );
}
