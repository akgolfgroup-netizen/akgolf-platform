import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  BarChart3,
  Target,
  BookOpen,
  Clock,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  TrendingUp,
  Video,
  Bell,
} from "lucide-react";

export const metadata = {
  title: "Treningsabonnement | AK Golf Academy",
  description:
    "Tren golf med system. Fast coaching, personlig treningsplan og spillerportal. Lanseres mai 2026.",
};

// ─── Data ───

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Book i appen",
    description:
      "Du booker 20-minutters coaching-sesjoner direkte i spillerportalen. Velg dag og tid som passer deg.",
  },
  {
    step: "02",
    title: "Tren med trener",
    description:
      "Hver sesjon er fokusert pa ett tema. TrackMan maler, video dokumenterer. Du far konkrete tall pa endringen.",
  },
  {
    step: "03",
    title: "Tren pa egenhand",
    description:
      "Mellom sesjonene har du en oppdatert treningsplan med ovelser, video og progresjon. Du vet alltid hva du skal jobbe med.",
  },
  {
    step: "04",
    title: "Folg utviklingen",
    description:
      "Spillerportalen viser handicap-utvikling, treningsstatistikk og Strokes Gained-analyse. Du ser fremgangen over tid.",
  },
];

const PORTAL_FEATURES = [
  {
    icon: Calendar,
    title: "Booking",
    description: "Book og administrer coaching-timer direkte. Se ledige tider og fa bekreftelse umiddelbart.",
  },
  {
    icon: BookOpen,
    title: "Treningsplan",
    description: "Personlig plan oppdatert av treneren etter hver sesjon. Ovelser med video, tid og progresjon.",
  },
  {
    icon: BarChart3,
    title: "Statistikk og analyse",
    description: "Handicap-utvikling, Strokes Gained-barer og benchmark mot spillere pa ditt niva.",
  },
  {
    icon: Target,
    title: "Strokes Gained",
    description: "Se hvor du taper og vinner slag. Tee, approach, kortspill og putting — malt og visualisert.",
  },
  {
    icon: Video,
    title: "Coaching-historikk",
    description: "Alle sesjoner logget med notater, video og TrackMan-data. Se tilbake pa hva dere jobbet med.",
  },
  {
    icon: TrendingUp,
    title: "Progresjon",
    description: "Folg utviklingen din over uker og maneder. Tydelige grafer og milestones nar du nar nye niva.",
  },
];

const PACKAGES = [
  {
    name: "Performance",
    coach: "Anders Kristiansen",
    price: "1 400",
    sessions: "2 x 20 min / mnd",
    highlighted: false,
  },
  {
    name: "Performance Pro",
    coach: "Anders Kristiansen",
    price: "2 500",
    sessions: "4 x 20 min / mnd",
    highlighted: true,
    badge: "Mest populaer",
  },
  {
    name: "Performance",
    coach: "Markus R. Pedersen",
    price: "800",
    sessions: "2 x 20 min / mnd",
    highlighted: false,
  },
  {
    name: "Performance Pro",
    coach: "Markus R. Pedersen",
    price: "1 400",
    sessions: "4 x 20 min / mnd",
    highlighted: false,
  },
];

const INCLUDED_IN_ALL = [
  "1-til-1 coaching med TrackMan",
  "Personlig treningsplan i spillerportalen",
  "Ovelsesbank med video",
  "Statistikk og progresjonssporing",
  "Ingen bindingstid",
  "Booking i appen",
];

const FAQ = [
  {
    q: "Hva er et treningsabonnement?",
    a: "Du betaler en fast manedspris og booker 20-minutters coaching-sesjoner i appen. Mellom sesjonene har du tilgang til spillerportalen med treningsplan, ovelser og progresjon. Tenk pa det som et treningsstudio-abonnement — men for golftrening med personlig trener.",
  },
  {
    q: "Hvorfor 20 minutter?",
    a: "Fordi det er nok tid til a jobbe fokusert med en ting og bekrefte at endringen sitter. Korte sesjoner gjor at du kan trene oftere med trener — og frekvens gir raskere utvikling enn lange timer med lang tid mellom.",
  },
  {
    q: "Hva er forskjellen pa Anders og Markus?",
    a: "Anders jobber med spillere som vil ha individuell teknisk utvikling og langsiktig oppfolging. Markus spesialiserer seg pa nye golfere, grunnprinsipper og gruppetreninger. Begge bruker samme system og spillerportal.",
  },
  {
    q: "Er det bindingstid?",
    a: "Nei. Abonnementet loper manedlig og kan sies opp nar som helst.",
  },
  {
    q: "Hva er spillerportalen?",
    a: "En treningsapp der du ser treningsplanen din, logger okter, folger progresjonen din og har tilgang til ovelsesbank med video. Treneren oppdaterer planen din etter hver coaching-sesjon.",
  },
  {
    q: "Hvor foregar treningen?",
    a: "Gamle Fredrikstad Golfklubb (GFGK). Vi bruker utendorsanlegget og TrackMan-simulator innendors, avhengig av sesong. Anders har ogsa timer pa Miklagard Golfklubb.",
  },
];

// ─── Page ───

export default function AbonnementPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative min-h-[70svh] flex items-end overflow-hidden">
        <Image
          src="/images/branding/ak-golf-academy-22.jpg"
          alt="Coaching pa rangen med TrackMan"
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/80" />
        <div className="relative z-10 w-full pb-16 md:pb-24">
          <div className="max-w-[1120px] mx-auto px-4 md:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-cta mb-4">
              Lanseres mai 2026
            </p>
            <h1 className="text-[clamp(2.5rem,7vw,4rem)] font-bold tracking-[-0.03em] leading-[1.05] text-white max-w-[640px] mb-6">
              Tren golf med system.
            </h1>
            <p className="text-base md:text-lg text-white/60 max-w-[520px] leading-relaxed mb-10">
              Et treningsabonnement der du moter trener 2 eller 4 ganger i maneden.
              Hver sesjon er 20 minutter — fokusert, malt og filmet.
              Mellom sesjonene vet du noyaktig hva du skal trene pa.
            </p>
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <Bell className="w-5 h-5 text-accent-cta" />
              <span className="text-sm text-white/80">
                Abonnement og spillerportal lanseres i starten av mai 2026
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8">
          <div className="max-w-[640px] mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted mb-4">
              Slik fungerer det
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-6">
              Coaching med oppfolging
            </h2>
            <p className="text-muted leading-relaxed">
              De fleste golfere trener tilfeldig. Med et treningsabonnement far du
              en fast trener, en personlig plan og et system som folger deg mellom
              sesjonene. Resultatet er raskere utvikling og mer malrettet trening.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border border-grey-200 bg-white p-6"
              >
                <span className="text-4xl font-bold tracking-tight text-grey-200">
                  {step.step}
                </span>
                <h3 className="text-base font-semibold text-primary mt-4 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Features */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8">
          <div className="max-w-[640px] mx-auto text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted mb-4">
              Spillerportalen
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-6">
              Alt du trenger mellom sesjonene
            </h2>
            <p className="text-muted leading-relaxed">
              Spillerportalen er treningsappen din. Her ser du treningsplanen,
              booker timer, folger progresjonen og har tilgang til alle ovelser
              med video. Treneren oppdaterer planen etter hver sesjon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PORTAL_FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-grey-200 bg-white p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Portal launch banner */}
          <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Smartphone className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-primary">
                Spillerportalen lanseres mai 2026
              </h3>
            </div>
            <p className="text-sm text-muted max-w-md mx-auto">
              Vi bygger portalen na. Alle med treningsabonnement far automatisk
              tilgang nar den er klar. I mellomtiden far du treningsplan og
              oppfolging direkte fra treneren.
            </p>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8">
          <div className="max-w-[640px] mx-auto text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted mb-4">
              Abonnement
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-6">
              Velg ditt treningsabonnement
            </h2>
            <p className="text-muted leading-relaxed">
              Ingen bindingstid. Abonnementet loper manedlig og kan sies opp nar
              som helst. Alle planer inkluderer spillerportal og treningsplan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
            {PACKAGES.map((pkg) => (
              <div
                key={`${pkg.name}-${pkg.coach}`}
                className={`rounded-2xl border p-6 relative ${
                  pkg.highlighted
                    ? "border-primary bg-white shadow-card"
                    : "border-grey-200 bg-white"
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-semibold bg-accent-cta text-accent-cta-text">
                    {pkg.badge}
                  </span>
                )}
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted mb-1">
                  {pkg.coach}
                </p>
                <h3 className="text-lg font-semibold text-primary mb-1">
                  {pkg.name}
                </h3>
                <p className="text-sm text-muted mb-4">{pkg.sessions}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold tracking-tight text-primary">
                    {pkg.price}
                  </span>
                  <span className="text-sm text-muted">kr/mnd</span>
                </div>
                <div className="rounded-xl bg-surface px-4 py-3 text-center">
                  <p className="text-sm font-medium text-muted">
                    Tilgjengelig fra mai 2026
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Included in all */}
          <div className="mt-12 max-w-[640px] mx-auto">
            <h3 className="text-sm font-semibold text-primary mb-4 text-center">
              Inkludert i alle abonnement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INCLUDED_IN_ALL.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <span className="text-sm text-text">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="max-w-[640px] mx-auto px-4 md:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-primary mb-10 text-center">
            Vanlige sporsmal
          </h2>
          <div className="space-y-6">
            {FAQ.map((item) => (
              <div key={item.q}>
                <h3 className="text-base font-semibold text-primary mb-2">
                  {item.q}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-[640px] mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary mb-4">
            Prov en enkeltsesjon forst?
          </h2>
          <p className="text-muted mb-8 leading-relaxed">
            Du trenger ikke et abonnement for a komme i gang. Book en
            enkeltsesjon og se om coaching med oss passer for deg.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-white rounded-[20px] text-[15px] font-bold hover:opacity-90 transition-opacity"
            >
              Book enkeltsesjon
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/academy"
              className="inline-flex items-center justify-center px-7 py-3.5 border border-grey-200 text-text rounded-[20px] text-[15px] font-medium hover:bg-surface transition-colors"
            >
              Tilbake til Academy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
