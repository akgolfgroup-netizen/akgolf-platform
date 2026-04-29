"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "Hvor raskt svarer dere?",
    a: "På e-post: 4 timer i åpningstid (man–lør 09–17). Skjemaet ruter direkte til riktig person — ingen call-center, ingen ticket-køer.",
  },
  {
    q: "Kan jeg komme innom uten avtale?",
    a: "Coaching krever booking — vi vil at coachen skal være forberedt og ha din historikk klar. Generelle spørsmål kan tas ute på range eller i klubbhuset.",
  },
  {
    q: "Hvor er nærmeste parkering?",
    a: "Det er stor parkering rett ved klubbhuset på Gamle Fredrikstad GK. Følg skilt fra rundkjøringen ved E6/Sarpsborg.",
  },
  {
    q: "Tilbyr dere bedriftsavtaler?",
    a: "Ja. Vi har faste avtaler med flere bedrifter i Østfold — alt fra firma-event til lederpersonlig coaching. Send forespørsel via skjemaet og velg \"Bedrift / event\", så ringer vi deg.",
  },
  {
    q: "Driver dere med presse-intervjuer?",
    a: "Ja, både Anders og Markus stiller gjerne. Send oss tema og vinkling via skjemaet — vi svarer innen 24t med tider som passer.",
  },
];

export function ContactFaq() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="px-10 pb-[110px] pt-[90px]">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <div
              className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "var(--akgolf-primary, #005840)",
              }}
            >
              FAQ
            </div>
            <h2
              className="m-0 mb-4 text-[clamp(36px,4vw,50px)] font-extrabold leading-[1.05] tracking-[-0.03em]"
              style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                color: "var(--akgolf-ink, #0A1F18)",
              }}
            >
              Vanlige{" "}
              <em
                className="font-medium not-italic"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontStyle: "italic",
                  color: "var(--akgolf-primary, #005840)",
                }}
              >
                spørsmål.
              </em>
            </h2>
            <p
              className="m-0 text-[15px] leading-[1.6]"
              style={{ color: "var(--akgolf-text, #324D45)" }}
            >
              Du finner mer på de andre sidene — eller bare skriv til oss. Vi
              liker spørsmål.
            </p>
          </div>

          <div className="flex flex-col">
            {FAQS.map((item, i) => {
              const isOpen = i === openIndex;
              return (
                <div
                  key={item.q}
                  className="border-t py-[22px] last:border-b"
                  style={{ borderColor: "var(--akgolf-line-light, #E4EAE6)" }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-6 text-left"
                  >
                    <span
                      className="text-[17px] font-bold tracking-[-0.01em]"
                      style={{ color: "var(--akgolf-ink, #0A1F18)" }}
                    >
                      {item.q}
                    </span>
                    <span
                      className="grid h-[30px] w-[30px] flex-shrink-0 place-items-center rounded-full transition-transform"
                      style={{
                        background: "var(--akgolf-surface, #F4F6F4)",
                        color: "var(--akgolf-primary, #005840)",
                        transform: isOpen ? "rotate(45deg)" : "none",
                      }}
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.4} />
                    </span>
                  </button>
                  {isOpen ? (
                    <div
                      className="max-w-[65ch] pt-3 text-[14px] leading-[1.65]"
                      style={{ color: "var(--akgolf-text, #324D45)" }}
                    >
                      {item.a}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
