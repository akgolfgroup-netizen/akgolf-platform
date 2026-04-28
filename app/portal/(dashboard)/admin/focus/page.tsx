import { FocusHero } from "@/components/admin/focus/focus-hero";
import { AiStrip } from "@/components/admin/focus/ai-strip";
import { FocusCard } from "@/components/admin/focus/focus-card";
import { CompletedStrip } from "@/components/admin/focus/completed-strip";
import { TomorrowPreview } from "@/components/admin/focus/tomorrow-preview";
import {
  FOCUS_ITEMS,
  COMPLETED_ITEMS,
  TOMORROW_ITEMS,
  AI_BLURB,
} from "@/components/admin/focus/mock-data";

// TODO: koble til ekte data
// - dagens 3: ny tabell CoachFocusItem eller AI-utvalgte CoachTask
// - completed: audit-log / fullforte CoachTask siste 8t
// - tomorrow: prisma.booking.findMany for neste dag pa coach.userId
// - klokke: client component for live-tid

export default function FocusPage() {
  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      <FocusHero
        eyebrow="Focus · Dagens 3"
        title="De tre tingene som flytter mest i dag"
        lede="Alt annet er støy. Klikk på en oppgave for å starte. Når dagens 3 er ferdig — gå hjem."
        clock="17:24"
        clockSub="i dag"
      />

      <AiStrip
        heading="Coach AI har valgt dagens 3 basert på risiko, plan-momentum og din kalender."
        body={AI_BLURB}
      />

      <div className="mb-5 grid grid-cols-3 gap-3.5">
        {FOCUS_ITEMS.map((item) => (
          <FocusCard key={item.num} item={item} />
        ))}
      </div>

      <CompletedStrip items={COMPLETED_ITEMS} />

      <TomorrowPreview
        items={TOMORROW_ITEMS}
        subtitle="torsdag 1. mai · stille dag"
      />
    </div>
  );
}
