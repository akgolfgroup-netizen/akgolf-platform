"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { WebNav } from "@/components/website-v2/web-nav";
import { WebFooter } from "@/components/website-v2/web-footer";
import { BookingHero } from "@/components/website-v2/booking/booking-hero";
import { CoachCard } from "@/components/website-v2/booking/coach-card";
import { TrustStrip } from "@/components/website-v2/booking/trust-strip";

interface InstructorAPI {
  id: string;
  title?: string | null;
  bio?: string | null;
  User: { name: string; image?: string | null };
}

interface Trainer {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string | null;
  acuityEmbedUrl: string;
  tags: string[];
  photoVariant: "default" | "lime";
}

const TRAINER_DEFAULTS: Record<string, Omit<Trainer, "id" | "name" | "role">> = {
  instr_anders: {
    description:
      "Coach for voksne. Sesjonene foregår med TrackMan og videoanalyse på Gamle Fredrikstad Golfklubb.",
    image: "/images/team/anders-kristiansen.jpg",
    acuityEmbedUrl:
      "https://app.acuityscheduling.com/schedule.php?owner=28391543&calendarID=11780416&ref=embedded_csp",
    tags: ["Voksne", "TrackMan", "Banecoaching"],
    photoVariant: "default",
  },
  instr_markus: {
    description:
      "Coach for juniorer og nybegynnere. Sesjonene foregår på Gamle Fredrikstad Golfklubb.",
    image: null,
    acuityEmbedUrl:
      "https://app.acuityscheduling.com/schedule.php?owner=28391543&calendarID=13938964&ref=embedded_csp",
    tags: ["Junior", "Nybegynnere"],
    photoVariant: "lime",
  },
};

function getDisplayName(name: string): string {
  if (name.toLowerCase().includes("markus")) return "Markus R. Pedersen";
  return name;
}

export default function BookingPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);
  const [showIframe, setShowIframe] = useState(false);
  const iframeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/portal/public/instructors");
        const instructors: InstructorAPI[] = res.ok ? await res.json() : [];
        const built: Trainer[] = [];
        for (const inst of instructors) {
          const defaults = TRAINER_DEFAULTS[inst.id];
          if (!defaults) continue;
          built.push({
            id: inst.id,
            name: getDisplayName(inst.User?.name ?? "Coach"),
            role: inst.title ?? "Coach",
            ...defaults,
          });
        }
        setTrainers(built);
        if (built.length > 0) setSelectedTrainerId(built[0].id);
      } catch {
        // Behold tom liste — fallback-UI viser kontaktinfo
      }
    }
    load();
  }, []);

  // Fallback hvis API er nede: vis statiske coach-kort så siden ikke er tom.
  const displayTrainers = useMemo<Trainer[]>(() => {
    if (trainers.length > 0) return trainers;
    return Object.entries(TRAINER_DEFAULTS).map(([id, defaults]) => ({
      id,
      name: id.includes("anders") ? "Anders Kristiansen" : "Markus R. Pedersen",
      role: id.includes("anders") ? "Hovedcoach Academy" : "Hovedcoach Junior",
      ...defaults,
    }));
  }, [trainers]);

  const selectedTrainer =
    displayTrainers.find((t) => t.id === selectedTrainerId) ??
    displayTrainers[0] ??
    null;

  const handleOpenBooking = () => {
    setShowIframe(true);
    requestAnimationFrame(() => {
      iframeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="min-h-screen bg-[var(--akgolf-surface,#F4F6F4)]">
      <WebNav />

      <BookingHero step={selectedTrainer ? (showIframe ? 2 : 1) : 1} />

      {/* Coach-valg */}
      <section className="pb-[60px] pt-6">
        <div className="mx-auto max-w-[1200px] px-10">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {displayTrainers.map((t) => (
              <CoachCard
                key={t.id}
                name={t.name}
                role={t.role}
                image={t.image}
                description={t.description}
                tags={t.tags}
                selected={t.id === selectedTrainer?.id}
                onSelect={() => {
                  setSelectedTrainerId(t.id);
                  setShowIframe(false);
                }}
                photoVariant={t.photoVariant}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Acuity iframe (vises etter at coach er valgt) */}
      {showIframe && selectedTrainer ? (
        <section ref={iframeRef} className="pb-[100px]">
          <div className="mx-auto max-w-[1200px] px-10">
            <div className="mb-6 flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[var(--akgolf-surface,#F4F6F4)]">
                {selectedTrainer.image ? (
                  <Image
                    src={selectedTrainer.image}
                    alt={selectedTrainer.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[var(--akgolf-primary,#005840)] text-lg font-bold text-white">
                    {selectedTrainer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h3
                  className="m-0 text-xl font-extrabold tracking-[-0.02em] text-[var(--akgolf-ink,#0A1F18)]"
                  style={{
                    fontFamily: "var(--font-inter-tight), Inter, sans-serif",
                  }}
                >
                  {selectedTrainer.name}
                </h3>
                <p className="m-0 text-sm text-[var(--akgolf-text,#324D45)]">
                  {selectedTrainer.role} — Gamle Fredrikstad Golfklubb
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[var(--akgolf-line-light,#E0E8E5)] bg-white">
              <iframe
                src={selectedTrainer.acuityEmbedUrl}
                title={`Book time med ${selectedTrainer.name}`}
                width="100%"
                height="800"
                allow="payment"
                className="w-full min-h-[800px]"
              />
            </div>
          </div>
        </section>
      ) : null}

      <TrustStrip />

      {/* Sticky CTA */}
      {selectedTrainer && !showIframe ? (
        <div className="fixed bottom-4 left-1/2 z-[60] flex max-w-[calc(100%-32px)] -translate-x-1/2 items-center gap-[18px] rounded-full bg-[var(--akgolf-ink,#0A1F18)] px-[22px] py-[14px] text-white shadow-[0_18px_40px_rgba(10,31,24,0.30)]">
          <div className="text-[13px]">
            <strong className="mr-1 text-[var(--akgolf-accent,#D1F843)]">
              {selectedTrainer.name}
            </strong>
            · velg tid og tjeneste i kalenderen
          </div>
          <button
            type="button"
            onClick={handleOpenBooking}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--akgolf-accent,#D1F843)] px-[18px] py-[10px] text-[13px] font-bold text-[var(--akgolf-ink,#0A1F18)] transition-all hover:-translate-y-px"
          >
            Åpne kalender
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
          </button>
        </div>
      ) : null}

      <div className="bg-white pb-10 text-center">
        <Link
          href="/academy"
          className="text-sm text-[var(--akgolf-text,#324D45)] hover:text-[var(--akgolf-ink,#0A1F18)]"
        >
          ← Tilbake til Academy
        </Link>
      </div>

      <WebFooter />
    </div>
  );
}
