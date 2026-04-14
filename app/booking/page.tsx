"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowLeft, Clock } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// ─── Data ───

interface ServiceType {
  id: string;
  name: string;
  description?: string | null;
  duration: number;
  price: number;
  category?: string | null;
}

interface Instructor {
  id: string;
  title?: string | null;
  bio?: string | null;
  specialization?: string | null;
  User: { name: string; image?: string | null };
}

interface Trainer {
  id: string;
  name: string;
  role: string;
  image: string | null;
  acuityEmbedUrl: string;
  services: string[];
  instructorId: string;
}

interface Location {
  name: string;
  shortName: string;
  trainers: Trainer[];
}

// Hardcoded location mapping + Acuity URLs until backend has full facility data
const LOCATION_CONFIG: Record<string, { name: string; shortName: string; acuityEmbedUrl: string }> = {
  instr_anders: {
    name: "Gamle Fredrikstad Golfklubb",
    shortName: "GFGK",
    acuityEmbedUrl: "https://app.acuityscheduling.com/schedule.php?owner=28391543&calendarID=11780416&ref=embedded_csp",
  },
  instr_markus: {
    name: "Gamle Fredrikstad Golfklubb",
    shortName: "GFGK",
    acuityEmbedUrl: "https://app.acuityscheduling.com/schedule.php?owner=28391543&calendarID=13938964&ref=embedded_csp",
  },
};

// Matcher på fornavn for å håndtere varianter i databasen
function getTrainerImage(name: string): string | null {
  const lower = name.toLowerCase();
  if (lower.includes("anders")) return "/images/branding/ak-golf-academy-20.jpg";
  return null; // Markus bruker initialer
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
}

// Overstyr visningsnavn
function getDisplayName(name: string): string {
  if (name.toLowerCase().includes("markus")) return "Markus R. Pedersen";
  return name;
}

// ─── Page ───

export default function BookingPage() {
  const [selectedTrainer, setSelectedTrainer] = useState<{
    trainer: Trainer;
    locationName: string;
  } | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const [instructorsRes, servicesRes] = await Promise.all([
          fetch("/api/portal/public/instructors"),
          fetch("/api/portal/public/service-types"),
        ]);

        const instructors: Instructor[] = instructorsRes.ok ? await instructorsRes.json() : [];
        const serviceTypes: ServiceType[] = servicesRes.ok ? await servicesRes.json() : [];

        // Build trainer objects from backend data
        const trainerMap = new Map<string, Trainer>();

        for (const inst of instructors) {
          const name = inst.User?.name ?? "Coach";
          const config = LOCATION_CONFIG[inst.id];
          if (!config) continue; // Skip instructors without location config

          trainerMap.set(inst.id, {
            id: inst.id,
            name: getDisplayName(name),
            role: inst.title ?? "Coach",
            image: getTrainerImage(name),
            acuityEmbedUrl: config.acuityEmbedUrl,
            services: [],
            instructorId: inst.id,
          });
        }

        // Map services to trainers based on service-types API (which includes instructors)
        for (const st of serviceTypes) {
          const instructorLinks = (st as unknown as { Instructor?: { id: string }[] }).Instructor ?? [];
          for (const link of instructorLinks) {
            const trainer = trainerMap.get(link.id);
            if (trainer) {
              trainer.services.push(st.name);
            }
          }
        }

        // Group by location
        const locationMap = new Map<string, Location>();
        for (const trainer of trainerMap.values()) {
          const config = LOCATION_CONFIG[trainer.instructorId];
          if (!locationMap.has(config.shortName)) {
            locationMap.set(config.shortName, {
              name: config.name,
              shortName: config.shortName,
              trainers: [],
            });
          }
          locationMap.get(config.shortName)!.trainers.push(trainer);
        }

        setLocations(Array.from(locationMap.values()));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (selectedTrainer && embedRef.current) {
      embedRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedTrainer]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-primary text-white">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8 py-12 md:py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent-cta mb-4">
            AK Golf Academy
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Book coaching
          </h1>
          <p className="text-white/70 max-w-md mx-auto">
            Velg lokasjon og trener for a booke din neste coaching-time.
          </p>
        </div>
      </header>

      <main className="max-w-[1120px] mx-auto px-4 md:px-8 py-12 md:py-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-sm text-muted">Laster trenere...</span>
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted">Ingen trenere tilgjengelig for online booking akkurat nå.</p>
            <p className="text-sm text-muted mt-2">
              Ta kontakt pa{" "}
              <a href="mailto:anders@akgolf.no" className="text-primary font-medium">
                anders@akgolf.no
              </a>
            </p>
          </div>
        ) : selectedTrainer ? (
          <div ref={embedRef}>
            {/* Back button */}
            <button
              onClick={() => setSelectedTrainer(null)}
              className="flex items-center gap-2 mb-8 text-sm font-medium text-muted hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Tilbake til treneroversikt
            </button>

            {/* Selected trainer header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-grey-100 shrink-0">
                {selectedTrainer.trainer.image ? (
                  <Image
                    src={selectedTrainer.trainer.image}
                    alt={selectedTrainer.trainer.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary">
                    <span className="text-lg font-bold text-white">
                      {getInitials(selectedTrainer.trainer.name)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-primary">
                  {selectedTrainer.trainer.name}
                </h2>
                <p className="text-sm text-muted">
                  {selectedTrainer.trainer.role} — {selectedTrainer.locationName}
                </p>
              </div>
            </div>

            {/* Acuity Embed */}
            {selectedTrainer.trainer.acuityEmbedUrl ? (
              <div className="rounded-2xl border border-grey-200 bg-white overflow-hidden">
                <iframe
                  src={selectedTrainer.trainer.acuityEmbedUrl}
                  title={`Book time med ${selectedTrainer.trainer.name}`}
                  width="100%"
                  height="800"
                  frameBorder="0"
                  allow="payment"
                  className="w-full min-h-[800px]"
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-grey-200 bg-white p-12 text-center">
                <Clock className="w-10 h-10 text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Kommer snart
                </h3>
                <p className="text-sm text-muted max-w-sm mx-auto">
                  Online booking for {selectedTrainer.trainer.name} pa{" "}
                  {selectedTrainer.locationName} er under oppsett.
                  Ta kontakt pa{" "}
                  <a
                    href="mailto:anders@akgolf.no"
                    className="text-primary font-medium"
                  >
                    anders@akgolf.no
                  </a>{" "}
                  for a booke.
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Location cards */}
            <div className="space-y-16">
              {locations.map((location) => (
                <section key={location.shortName}>
                  {/* Location Header */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-black">
                        {location.name}
                      </h2>
                      <p className="text-sm text-grey-400">
                        {location.trainers.length === 1
                          ? "1 trener tilgjengelig"
                          : `${location.trainers.length} trenere tilgjengelige`}
                      </p>
                    </div>
                  </div>

                  {/* Trainer Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {location.trainers.map((trainer) => (
                      <button
                        key={trainer.id}
                        onClick={() =>
                          setSelectedTrainer({
                            trainer,
                            locationName: location.name,
                          })
                        }
                        className="group rounded-2xl border border-grey-200 bg-white overflow-hidden transition-all duration-300 hover:-translate-y-px hover:shadow-card-hover text-left"
                      >
                        {/* Trainer Image */}
                        <div className="relative h-48 md:h-56 overflow-hidden bg-grey-100">
                          {trainer.image ? (
                            <Image
                              src={trainer.image}
                              alt={trainer.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary">
                              <span className="text-3xl font-bold text-white">
                                {getInitials(trainer.name)}
                              </span>
                            </div>
                          )}
                          {/* Role Badge */}
                          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-primary backdrop-blur-sm">
                            {trainer.role}
                          </div>
                        </div>

                        {/* Trainer Info */}
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-black mb-1">
                            {trainer.name}
                          </h3>
                          <p className="text-sm text-grey-400 mb-4">
                            {location.name}
                          </p>

                          {/* Services */}
                          <div className="flex flex-wrap gap-2 mb-6">
                            {trainer.services.map((service) => (
                              <span
                                key={service}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface text-text"
                              >
                                {service}
                              </span>
                            ))}
                          </div>

                          {/* CTA */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-black group-hover:text-black/70 transition-colors">
                              Velg tid
                            </span>
                            <div className="w-8 h-8 rounded-full bg-accent-cta flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-accent-cta-text"
                              >
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Info Section */}
            <div className="mt-16 rounded-2xl bg-white border border-grey-200 p-8 md:p-10">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-primary mb-2">
                    Slik booker du
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Velg trener og lokasjon over. Du far opp tilgjengelige tider
                    og kan booke direkte. Bekreftelse sendes pa e-post.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Back to Academy */}
        <div className="mt-10 text-center">
          <Link
            href="/academy"
            className="text-sm text-muted hover:text-primary transition-colors"
          >
            Tilbake til Academy
          </Link>
        </div>
      </main>
    </div>
  );
}
