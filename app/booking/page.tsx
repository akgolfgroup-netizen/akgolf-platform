import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, Clock, User } from "lucide-react";

export const metadata = {
  title: "Book coaching | AK Golf Academy",
  description: "Book en coaching-time med Anders Kristiansen eller Markus R. Pedersen.",
};

// ─── Data ───

interface Trainer {
  name: string;
  role: string;
  image: string | null;
  acuityUrl: string;
  services: string[];
}

interface Location {
  name: string;
  shortName: string;
  image: string;
  trainers: Trainer[];
}

const LOCATIONS: Location[] = [
  {
    name: "Gamle Fredrikstad Golfklubb",
    shortName: "GFGK",
    image: "/images/branding/ak-golf-academy-22.jpg",
    trainers: [
      {
        name: "Anders Kristiansen",
        role: "Head Coach",
        image: "/images/branding/ak-golf-academy-20.jpg",
        acuityUrl: "https://akgolfacademy.as.me/?calendarID=ANDERS-GFGK",
        services: ["Performance", "Performance Pro", "Flex 50", "Banecoaching"],
      },
      {
        name: "Markus R. Pedersen",
        role: "Coach",
        image: "/images/branding/ak-golf-academy-21.jpg",
        acuityUrl: "https://akgolfacademy.as.me/?calendarID=MARKUS-GFGK",
        services: ["Flex 20", "Flex 50", "Gruppe", "After Work"],
      },
    ],
  },
  {
    name: "Miklagard Golfklubb",
    shortName: "Miklagard",
    image: "/images/branding/ak-golf-academy-35.jpg",
    trainers: [
      {
        name: "Anders Kristiansen",
        role: "Head Coach",
        image: "/images/branding/ak-golf-academy-20.jpg",
        acuityUrl: "https://akgolfacademy.as.me/?calendarID=ANDERS-MIKLAGARD",
        services: ["Performance", "Performance Pro", "Flex 50"],
      },
    ],
  },
];

// ─── Page ───

export default function TempBookingPage() {
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

      {/* Locations */}
      <main className="max-w-[1120px] mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="space-y-16">
          {LOCATIONS.map((location) => (
            <section key={location.shortName}>
              {/* Location Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-primary">
                    {location.name}
                  </h2>
                  <p className="text-sm text-muted">
                    {location.trainers.length === 1
                      ? "1 trener tilgjengelig"
                      : `${location.trainers.length} trenere tilgjengelige`}
                  </p>
                </div>
              </div>

              {/* Trainer Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {location.trainers.map((trainer) => (
                  <a
                    key={`${location.shortName}-${trainer.name}`}
                    href={trainer.acuityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-grey-200 bg-white overflow-hidden transition-all duration-300 hover:-translate-y-px hover:shadow-card-hover"
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
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-16 h-16 text-grey-300" />
                        </div>
                      )}
                      {/* Role Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-primary backdrop-blur-sm">
                        {trainer.role}
                      </div>
                    </div>

                    {/* Trainer Info */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-primary mb-1">
                        {trainer.name}
                      </h3>
                      <p className="text-sm text-muted mb-4">
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
                        <span className="text-sm font-semibold text-primary group-hover:text-primary/80 transition-colors">
                          Velg tid
                        </span>
                        <div className="w-8 h-8 rounded-full bg-accent-cta flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                          <ArrowRight className="w-4 h-4 text-accent-cta-text" />
                        </div>
                      </div>
                    </div>
                  </a>
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
                Velg trener og lokasjon over. Du blir sendt til vart bookingsystem
                der du velger tjeneste, dato og tid. Bekreftelse sendes pa e-post.
              </p>
            </div>
          </div>
        </div>

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
