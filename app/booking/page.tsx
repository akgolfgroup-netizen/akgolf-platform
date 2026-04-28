"use client";

import {
  ArrowRight,
  CalendarClock,
  Flag,
  MessageCircle,
  Package,
  Target,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { WebNav } from "@/components/website-v2/web-nav";
import { WebFooter } from "@/components/website-v2/web-footer";
import { BookingHero } from "@/components/website-v2/booking/booking-hero";
import { CoachCard } from "@/components/website-v2/booking/coach-card";
import {
  ServiceTile,
  type ServiceTileData,
} from "@/components/website-v2/booking/service-tile";
import { TrustStrip } from "@/components/website-v2/booking/trust-strip";

interface InstructorAPI {
  id: string;
  title?: string | null;
  bio?: string | null;
  User: { name: string; image?: string | null };
}

interface ServiceTypeAPI {
  id: string;
  name: string;
  description?: string | null;
  duration: number;
  price: number;
  category?: string | null;
}

interface Trainer {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string | null;
  acuityEmbedUrl: string;
  tags: string[];
  nextAvailable?: string;
  photoVariant: "default" | "lime";
}

const TRAINER_DEFAULTS: Record<string, Omit<Trainer, "id" | "name" | "role">> = {
  instr_anders: {
    description:
      "For voksne 18+ — sving, kortspill, mental coaching og månedlig SG-måling. Jobber 1:1 med 18 spillere.",
    image: "/images/team/anders-kristiansen.jpg",
    acuityEmbedUrl:
      "https://app.acuityscheduling.com/schedule.php?owner=28391543&calendarID=11780416&ref=embedded_csp",
    tags: ["Voksne", "1:1 lessons", "Trackman", "Banecoaching"],
    nextAvailable: "i morgen 14:00",
    photoVariant: "default",
  },
  instr_markus: {
    description:
      "For juniorer 6–17 år — Sprout, Grow og Compete-spor. Foreldredialog, sommerleir og talentutvikling.",
    image: null,
    acuityEmbedUrl:
      "https://app.acuityscheduling.com/schedule.php?owner=28391543&calendarID=13938964&ref=embedded_csp",
    tags: ["Junior 6–17", "Foreldreapp", "Sommerleir", "Talentspor"],
    nextAvailable: "onsdag 16:30",
    photoVariant: "lime",
  },
};

function getDisplayName(name: string): string {
  if (name.toLowerCase().includes("markus")) return "Markus R. Pedersen";
  return name;
}

const FILTERS = ["Alle", "Lessons", "Banecoaching", "Pakker"] as const;
type Filter = (typeof FILTERS)[number];

// Service-tile-presentasjon. Server-data slås opp ved klikk for ID.
const SERVICE_PRESETS: Record<string, Omit<ServiceTileData, "id">> = {
  standard: {
    title: "Standard lesson",
    description:
      "1:1 coaching på range eller Trackman-bay. Inkluderer videoanalyse og digitalt notat etter timen.",
    duration: "50 min · 1:1",
    price: "890 kr",
    priceUnit: "Per time",
    bullets: [
      "Trackman-data + video",
      "Digital coach-notat etter",
      "Gratis flytting inntil 12 timer før",
    ],
    Icon: Target,
    ribbon: "Mest populær",
    featured: true,
  },
  deep: {
    title: "Dyp-økt + analyse",
    description:
      "Lengre 1:1 med dybdetilbakemelding. Trackman-økt, video, og en handlingsplan for de neste 4 ukene.",
    duration: "90 min",
    price: "1 490 kr",
    priceUnit: "Per økt",
    bullets: [
      "90 min med 2 fokus-områder",
      "4-ukers oppfølgings-plan",
      "Skriftlig analyse i appen",
    ],
    Icon: CalendarClock,
  },
  oncourse: {
    title: "On-course coaching",
    description:
      "9 hull med coach. Course management, club selection og strategi i ekte spillsituasjoner.",
    duration: "3 t · 9 hull",
    price: "2 490 kr",
    priceUnit: "Per runde",
    bullets: [
      "9 hull · ekte spillsituasjoner",
      "Pre-shot rutine + valg",
      "Greenfee inkludert",
    ],
    Icon: Flag,
  },
  duo: {
    title: "Par-økt",
    description:
      "Bring en venn eller partner — to spillere, samme bay, en coach. Ideell for nybegynner-par.",
    duration: "75 min · 2-pack",
    price: "590 kr",
    priceUnit: "Per spiller",
    bullets: [
      "2 spillere · samme bay",
      "Individuell tilbakemelding",
      "Pris pr. spiller",
    ],
    Icon: Users,
  },
  pack: {
    title: "5-timers pakke",
    description:
      "Fem timer å bruke fritt over 6 måneder. 10 % rabatt vs enkelttimer, og kan deles med ektefelle.",
    duration: "5-pakke",
    price: "3 990 kr",
    priceUnit: "Pakke · 5 timer",
    bullets: [
      "5 timer · 6 mnd gyldighet",
      "Kan deles med en annen",
      "Spar 450 kr",
    ],
    Icon: Package,
    ctaLabel: "Kjøp pakke",
  },
  intro: {
    title: "Intro-møte",
    description:
      "Aldri trent med oss før? Et gratis 30-min-møte for å snakke om mål, nivå og om Academy passer deg.",
    duration: "30 min · gratis",
    price: "Gratis",
    priceUnit: "30 min · uforpliktende",
    bullets: ["30 min · gratis", "Ingen forpliktelser", "Avklar mål og forventninger"],
    Icon: MessageCircle,
    ctaLabel: "Book intro",
    freePrice: true,
  },
};

const SERVICE_LIST: { key: keyof typeof SERVICE_PRESETS; filter: Filter }[] = [
  { key: "standard", filter: "Lessons" },
  { key: "deep", filter: "Lessons" },
  { key: "oncourse", filter: "Banecoaching" },
  { key: "duo", filter: "Lessons" },
  { key: "pack", filter: "Pakker" },
  { key: "intro", filter: "Lessons" },
];

export default function BookingPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("Alle");
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

  const visibleServices = SERVICE_LIST.filter(
    (s) => filter === "Alle" || s.filter === filter,
  );

  const handleServiceSelect = () => {
    setShowIframe(true);
    requestAnimationFrame(() => {
      iframeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="min-h-screen bg-[var(--akgolf-surface,#F4F6F4)]">
      <WebNav />

      <BookingHero step={selectedTrainer ? (showIframe ? 3 : 2) : 1} />

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
                nextAvailable={t.nextAvailable}
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

      {/* Tjenester */}
      {selectedTrainer ? (
        <section className="pb-[100px] pt-[10px]">
          <div className="mx-auto max-w-[1200px] px-10">
            <div className="mb-9 flex items-end justify-between gap-10">
              <div>
                <div
                  className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--akgolf-primary,#005840)]"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  Tjenester · {selectedTrainer.name.split(" ")[0]}
                </div>
                <h2
                  className="m-0 text-[36px] font-extrabold tracking-[-0.025em] text-[var(--akgolf-ink,#0A1F18)]"
                  style={{
                    fontFamily: "var(--font-inter-tight), Inter, sans-serif",
                  }}
                >
                  Velg{" "}
                  <em
                    className="font-medium not-italic text-[var(--akgolf-primary,#005840)]"
                    style={{
                      fontFamily: "Fraunces, serif",
                      fontStyle: "italic",
                    }}
                  >
                    hva du vil booke.
                  </em>
                </h2>
              </div>
              <div className="hidden rounded-full border border-[var(--akgolf-line-light,#E0E8E5)] bg-white p-1 sm:inline-flex">
                {FILTERS.map((f) => {
                  const active = f === filter;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.10em] transition-colors ${
                        active
                          ? "bg-[var(--akgolf-ink,#0A1F18)] text-white"
                          : "text-[var(--akgolf-muted,#A5B2AD)] hover:text-[var(--akgolf-ink,#0A1F18)]"
                      }`}
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                      }}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleServices.map(({ key }) => (
                <ServiceTile
                  key={key}
                  data={{ id: key, ...SERVICE_PRESETS[key] }}
                  onSelect={handleServiceSelect}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Acuity iframe (vises etter service-klikk) */}
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
            <div>
              <strong className="mr-1 text-[var(--akgolf-accent,#D1F843)]">
                {selectedTrainer.name}
              </strong>
              · velg en tjeneste over
            </div>
            <div
              className="text-[10px] tracking-[0.10em] text-white/55"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              {selectedTrainer.nextAvailable
                ? `Neste ledige: ${selectedTrainer.nextAvailable}`
                : "Velg time når du har valgt tjeneste"}
            </div>
          </div>
          <button
            type="button"
            onClick={handleServiceSelect}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--akgolf-accent,#D1F843)] px-[18px] py-[10px] text-[13px] font-bold text-[var(--akgolf-ink,#0A1F18)] transition-all hover:-translate-y-px"
          >
            Velg tid
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
          </button>
        </div>
      ) : null}

      <div className="bg-white pb-10 text-center">
        <Link
          href="/academy?v=2"
          className="text-sm text-[var(--akgolf-text,#324D45)] hover:text-[var(--akgolf-ink,#0A1F18)]"
        >
          ← Tilbake til Academy
        </Link>
      </div>

      <WebFooter />
    </div>
  );
}
