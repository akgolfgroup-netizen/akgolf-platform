import { Bell, MapPin, RotateCcw, ShieldCheck } from "lucide-react";

const ITEMS = [
  {
    Icon: RotateCcw,
    title: "Gratis flytting",
    body: "Avbestill eller flytt inntil 12 timer før timen — uten gebyr.",
  },
  {
    Icon: ShieldCheck,
    title: "Trygg betaling",
    body: "Stripe · BankID-alternativ · faktura for medlemmer.",
  },
  {
    Icon: Bell,
    title: "Påminnelser",
    body: "SMS dagen før og kvelden før. Aldri glem en time igjen.",
  },
  {
    Icon: MapPin,
    title: "Gamle Fredrikstad",
    body: "All booking foregår på GFGK — TrackMan-bay og bane.",
  },
] as const;

export function TrustStrip() {
  return (
    <section className="bg-white py-[60px] pb-[90px]">
      <div className="mx-auto max-w-[1200px] px-10">
        <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ Icon, title, body }) => (
            <div key={title} className="flex gap-[14px]">
              <div className="grid h-[38px] w-[38px] flex-shrink-0 place-items-center rounded-[10px] bg-[rgba(0,88,64,0.08)] text-[var(--akgolf-primary,#005840)]">
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </div>
              <div>
                <h4
                  className="m-0 mb-1 text-sm font-bold tracking-[-0.005em] text-[var(--akgolf-ink,#0A1F18)]"
                  style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                >
                  {title}
                </h4>
                <p className="m-0 text-[13px] leading-[1.55] text-[var(--akgolf-text,#324D45)]">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
