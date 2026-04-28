import Link from "next/link";
import { Download } from "lucide-react";
import { WebNav } from "./web-nav";
import { WebFooter } from "./web-footer";

const FONT_INTER = "var(--font-inter), Inter, sans-serif";
const FONT_FRAUNCES = "var(--font-fraunces), Georgia, serif";
const FONT_MONO = "var(--font-jetbrains-mono), monospace";

const SURFACE = "var(--akgolf-surface, #F4F6F4)";
const INK = "var(--akgolf-ink, #0A1F18)";
const TEXT = "var(--akgolf-text, #324D45)";
const MUTED = "var(--akgolf-muted, #5C6B62)";
const PRIMARY = "var(--akgolf-primary, #005840)";
const ACCENT = "var(--akgolf-accent, #D1F843)";
const LINE = "var(--akgolf-line-light, #E4EAE6)";

const TOC = [
  { id: "s1", label: "Hvem vi er" },
  { id: "s2", label: "Hva vi samler inn" },
  { id: "s3", label: "Hvorfor og hjemmel" },
  { id: "s4", label: "Hvor lenge vi lagrer" },
  { id: "s5", label: "Deling med tredjeparter" },
  { id: "s6", label: "Dine rettigheter" },
  { id: "s7", label: "Cookies" },
  { id: "s8", label: "Junior & foreldre" },
  { id: "s9", label: "Kontakt" },
];

function FrItalic({ children }: { children: React.ReactNode }) {
  return (
    <em
      className="not-italic font-medium"
      style={{
        fontFamily: FONT_FRAUNCES,
        fontStyle: "italic",
        color: PRIMARY,
      }}
    >
      {children}
    </em>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[28px] font-extrabold leading-[1.2] tracking-[-0.02em] mb-[18px]"
      style={{ color: INK, fontFamily: FONT_INTER }}
    >
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-[18px] font-bold mt-7 mb-2.5 tracking-[-0.01em]"
      style={{ color: INK, fontFamily: FONT_INTER }}
    >
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[15px] leading-[1.7] mb-3.5"
      style={{ color: TEXT }}
    >
      {children}
    </p>
  );
}

function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul
      className="list-disc pl-5 mb-4 space-y-2 text-[15px] leading-[1.65]"
      style={{ color: TEXT }}
    >
      {children}
    </ul>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return (
    <strong className="font-semibold" style={{ color: INK }}>
      {children}
    </strong>
  );
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="underline" style={{ color: PRIMARY }}>
      {children}
    </a>
  );
}

function Callout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-[22px] px-8 py-7 my-6"
      style={{ background: INK, color: "#fff" }}
    >
      <h4
        className="text-[16px] font-extrabold tracking-[-0.01em] mb-2"
        style={{ color: ACCENT }}
      >
        {title}
      </h4>
      <p
        className="text-[14px] leading-[1.65] m-0"
        style={{ color: "rgba(255,255,255,0.78)" }}
      >
        {children}
      </p>
    </div>
  );
}

function Table({
  head,
  rows,
}: {
  head: string[];
  rows: string[][];
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl my-4"
      style={{ border: `1.5px solid ${LINE}` }}
    >
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="px-3.5 py-3 text-left font-bold tracking-[0.14em] uppercase"
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 10,
                  color: MUTED,
                  background: "#fff",
                  borderBottom: `1.5px solid ${LINE}`,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-3.5 py-3 leading-[1.55]"
                  style={{
                    color: j === 0 ? INK : TEXT,
                    fontWeight: j === 0 ? 600 : 400,
                    background: "#fff",
                    borderTop: i === 0 ? "none" : `1px solid ${LINE}`,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SideCard({
  title,
  body,
  cta,
  ctaHref,
  ctaIcon,
  variant = "primary",
  marginTop = 0,
}: {
  title: string;
  body: string;
  cta: string;
  ctaHref: string;
  ctaIcon?: React.ReactNode;
  variant?: "primary" | "ghost";
  marginTop?: number;
}) {
  const isPrimary = variant === "primary";
  return (
    <div
      className="rounded-[20px] px-[26px] py-6"
      style={{
        background: "#fff",
        border: `1.5px solid ${LINE}`,
        marginTop,
      }}
    >
      <h4
        className="text-[14px] font-extrabold tracking-[-0.005em] mb-2"
        style={{ color: INK }}
      >
        {title}
      </h4>
      <p
        className="text-[13px] leading-[1.55] mb-3.5"
        style={{ color: TEXT }}
      >
        {body}
      </p>
      <a
        href={ctaHref}
        className="flex w-full items-center justify-center gap-2 rounded-full px-3.5 py-2.5 text-[13px] font-bold transition-all hover:-translate-y-px"
        style={{
          background: isPrimary ? ACCENT : "transparent",
          color: INK,
          border: isPrimary ? "none" : `1.5px solid ${LINE}`,
        }}
      >
        {cta}
        {ctaIcon}
      </a>
    </div>
  );
}

export function PersonvernPageClient() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: SURFACE,
        color: TEXT,
        fontFamily: FONT_INTER,
      }}
    >
      <WebNav />

      {/* HERO */}
      <section className="px-10 pb-8 pt-[170px]">
        <div className="mx-auto max-w-[1280px]">
          <div
            className="mb-3.5 inline-block text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ fontFamily: FONT_MONO, color: PRIMARY }}
          >
            Personvern &amp; vilkår
          </div>
          <h1
            className="mb-[18px] max-w-[18ch] text-[clamp(48px,5.6vw,76px)] font-extrabold leading-[0.98] tracking-[-0.035em]"
            style={{ color: INK, fontFamily: FONT_INTER }}
          >
            Vi behandler dataene{" "}
            <FrItalic>dine med omhu.</FrItalic>
          </h1>
          <p
            className="max-w-[56ch] text-[17px] leading-[1.6] m-0"
            style={{ color: TEXT }}
          >
            Klart språk, ingen jusspråk. Hvis noe er uklart — skriv til{" "}
            <a
              href="mailto:post@akgolf.no"
              className="underline"
              style={{ color: PRIMARY }}
            >
              post@akgolf.no
            </a>
            .
          </p>
          <div
            className="mt-6 flex flex-wrap gap-6 py-[18px] text-[11px] font-bold uppercase tracking-[0.12em]"
            style={{
              borderTop: `1px solid ${LINE}`,
              borderBottom: `1px solid ${LINE}`,
              fontFamily: FONT_MONO,
              color: MUTED,
            }}
          >
            <span>
              <strong className="mr-2" style={{ color: INK }}>
                Sist oppdatert
              </strong>
              1. mars 2026
            </span>
            <span>
              <strong className="mr-2" style={{ color: INK }}>
                Versjon
              </strong>
              3.2
            </span>
            <span>
              <strong className="mr-2" style={{ color: INK }}>
                Behandlingsansvarlig
              </strong>
              AK Golf Group AS
            </span>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="px-10 pb-[100px] pt-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[240px_1fr_220px]">
            {/* TOC */}
            <aside className="lg:sticky lg:top-[100px] lg:self-start">
              <div
                className="mb-3.5 text-[10px] font-bold uppercase tracking-[0.16em]"
                style={{ fontFamily: FONT_MONO, color: PRIMARY }}
              >
                Innhold
              </div>
              <ol
                className="list-none p-0 m-0"
                style={{ borderBottom: `1px solid ${LINE}` }}
              >
                {TOC.map((item, i) => (
                  <li
                    key={item.id}
                    className="flex gap-2.5 py-2"
                    style={{ borderTop: `1px solid ${LINE}` }}
                  >
                    <span
                      className="flex-shrink-0 text-[11px]"
                      style={{ fontFamily: FONT_MONO, color: MUTED }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <a
                      href={`#${item.id}`}
                      className="text-[13px] transition-colors hover:underline"
                      style={{ color: TEXT }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            {/* CONTENT */}
            <div className="max-w-[65ch]">
              <section id="s1" className="pb-10">
                <H2>
                  1. Hvem <FrItalic>vi er.</FrItalic>
                </H2>
                <P>
                  <Strong>AK Golf Group AS</Strong> er behandlingsansvarlig for
                  personopplysningene som behandles i forbindelse med våre
                  coaching-tjenester, medlemskap og nettsider — herunder AK Golf
                  Academy og Junior Academy.
                </P>
                <P>
                  Vi følger personvernforordningen (GDPR) og norsk
                  personopplysningslov, som gjelder i Norge via EØS-avtalen.
                  Datatilsynet er tilsynsmyndighet.
                </P>
                <Callout title="Vårt løfte">
                  Vi samler bare det vi trenger. Vi selger aldri data. Vi
                  sletter når formålet er oppnådd. Du kan be om innsyn, retting
                  eller sletting når som helst.
                </Callout>
              </section>

              <section id="s2" className="pb-10">
                <H2>
                  2. Hva vi <FrItalic>samler inn.</FrItalic>
                </H2>
                <H3>Via nettstedet</H3>
                <P>
                  Når du bruker kontaktskjemaet vårt, samler vi inn navn,
                  e-postadresse, telefonnummer, handicap, valgt program og
                  eventuell melding du inkluderer. Vi samler ikke inn
                  opplysninger utover det du selv oppgir.
                </P>

                <H3>Som elev/junior i våre programmer</H3>
                <P>For elever i Academy og Junior Academy samler vi også inn:</P>
                <UL>
                  <li>Fødselsdato (for aldersgruppeplassering)</li>
                  <li>Treningsdata (IUP-kategori, testresultater, økt-notater)</li>
                  <li>Videoopptak av sving (for teknisk analyse)</li>
                  <li>Relevant helseinformasjon (for tilpasset trening)</li>
                  <li>Nødkontaktinformasjon</li>
                  <li>For juniorer: foresattes kontaktinformasjon</li>
                </UL>

                <H3>Faktureringsinformasjon</H3>
                <P>
                  Faktureringsinfo håndteres av Stripe. Vi lagrer aldri
                  kortnummer på våre servere.
                </P>
              </section>

              <section id="s3" className="pb-10">
                <H2>
                  3. Hvorfor og <FrItalic>på hvilken hjemmel.</FrItalic>
                </H2>
                <Table
                  head={["Behandling", "Grunnlag"]}
                  rows={[
                    ["Kontaktinfo og fakturering", "Oppfyllelse av avtale (art. 6.1.b)"],
                    ["Treningsdata og IUP", "Oppfyllelse av avtale (art. 6.1.b)"],
                    ["Helseinformasjon", "Uttrykkelig samtykke (art. 9.2.a)"],
                    ["Videoopptak for coaching", "Berettiget interesse + samtykke"],
                    ["Bilder/video til markedsføring", "Uttrykkelig samtykke (art. 6.1.a)"],
                    ["Barn under 16 år", "Foreldresamtykke (art. 8)"],
                    ["Regnskap og lovpålagt arkivering", "Rettslig forpliktelse (art. 6.1.c)"],
                  ]}
                />
              </section>

              <section id="s4" className="pb-10">
                <H2>
                  4. Hvor lenge <FrItalic>vi lagrer.</FrItalic>
                </H2>
                <UL>
                  <li>
                    <Strong>Kontaktinfo og fakturering</Strong> — 5 år etter
                    avsluttet kundeforhold (regnskapsloven)
                  </li>
                  <li>
                    <Strong>Treningsdata og IUP</Strong> — 2 år etter avsluttet
                    kundeforhold
                  </li>
                  <li>
                    <Strong>Videoopptak</Strong> — 1 år etter opptak
                  </li>
                  <li>
                    <Strong>Markedsføringsbilder</Strong> — inntil samtykke
                    trekkes tilbake
                  </li>
                  <li>
                    <Strong>Helseinformasjon</Strong> — slettes ved avsluttet
                    kundeforhold
                  </li>
                </UL>
                <P>
                  Ved avsluttet kundeforhold kan du be om kopi av egne data før
                  sletting. Sletting bekreftes skriftlig.
                </P>
              </section>

              <section id="s5" className="pb-10">
                <H2>
                  5. Deling med <FrItalic>tredjeparter.</FrItalic>
                </H2>
                <P>
                  Vi deler ikke dine personopplysninger med tredjeparter uten
                  ditt samtykke, med unntak av:
                </P>
                <UL>
                  <li>
                    <Strong>GFGK (Gamle Fredrikstad Golfklubb)</Strong> — navn
                    og kontaktinfo deles for fasilitetsbooking og koordinering
                    av trening
                  </li>
                  <li>
                    <Strong>Formspree</Strong> — skjemadata sendes via Formspree
                    for behandling av henvendelser fra nettstedet
                  </li>
                  <li>
                    <Strong>Stripe</Strong> — betalingsbehandling (Irland/EU)
                  </li>
                </UL>
                <P>
                  Vi selger <Strong>aldri</Strong> data til tredjeparter for
                  markedsføring. Dine data deles aldri med andre elever,
                  sponsorer, arbeidsgivere eller forsikringsselskaper.
                </P>
              </section>

              <section id="s6" className="pb-10">
                <H2>
                  6. Dine <FrItalic>rettigheter.</FrItalic>
                </H2>
                <P>I henhold til GDPR har du følgende rettigheter:</P>
                <UL>
                  <li>
                    <Strong>Innsyn</Strong> (art. 15) — se alle data vi har
                    lagret om deg
                  </li>
                  <li>
                    <Strong>Retting</Strong> (art. 16) — korrigere feilaktige
                    opplysninger
                  </li>
                  <li>
                    <Strong>Sletting</Strong> (art. 17) — be om at data slettes
                    (med unntak av lovpålagt regnskap)
                  </li>
                  <li>
                    <Strong>Begrensning</Strong> (art. 18) — begrense
                    behandlingen
                  </li>
                  <li>
                    <Strong>Dataportabilitet</Strong> (art. 20) — få data
                    utlevert i maskinlesbart format (JSON/CSV)
                  </li>
                  <li>
                    <Strong>Innsigelse</Strong> (art. 21) — protestere mot
                    behandling
                  </li>
                  <li>
                    <Strong>Klage</Strong> — du kan klage til{" "}
                    <A href="https://www.datatilsynet.no">Datatilsynet</A>
                  </li>
                </UL>
                <P>
                  Henvendelser rettes til{" "}
                  <A href="mailto:post@akgolf.no">post@akgolf.no</A>. Vi svarer
                  innen 30 dager.
                </P>
              </section>

              <section id="s7" className="pb-10">
                <H2>
                  7. <FrItalic>Cookies.</FrItalic>
                </H2>
                <P>
                  Dette nettstedet bruker så få informasjonskapsler som mulig.
                  Bare strengt nødvendige er på som standard — analyse og
                  markedsføring krever samtykke.
                </P>
                <Table
                  head={["Type", "Formål", "Varighet"]}
                  rows={[
                    ["session_id", "Innlogging og sesjon", "Sesjon"],
                    ["cookie_consent", "Husk samtykke-valg", "12 mnd"],
                    ["_ga", "Statistikk (krever samtykke)", "13 mnd"],
                  ]}
                />
              </section>

              <section id="s8" className="pb-10">
                <H2>
                  8. Junior &amp; <FrItalic>foreldresamtykke.</FrItalic>
                </H2>
                <P>
                  For spillere under 16 år krever vi skriftlig samtykke fra
                  foreldre/verge før vi behandler personopplysninger. Foresatte
                  har full innsyn i barnets opplysninger og treningsdata.
                </P>
                <P>
                  Vi deler aldri bilder eller video av juniorer offentlig uten
                  eksplisitt samtykke fra foreldre — selv ikke i
                  markedsmateriell. Samtykke kan trekkes tilbake når som helst
                  ved skriftlig henvendelse.
                </P>
              </section>

              <section id="s9" className="pb-2">
                <H2>
                  9. <FrItalic>Kontakt</FrItalic> oss om personvern.
                </H2>
                <P>
                  <Strong>E-post</Strong>:{" "}
                  <A href="mailto:post@akgolf.no">post@akgolf.no</A>
                  <br />
                  <Strong>Behandlingsansvarlig</Strong>: AK Golf Group AS
                </P>
                <P>
                  Vi behandler henvendelser uten unødig opphold, normalt innen
                  14 dager.
                </P>
                <P>
                  Denne personvernerklæringen kan oppdateres. Vesentlige
                  endringer vil bli kommunisert via nettstedet. Vi anbefaler at
                  du gjennomgår denne siden jevnlig.
                </P>
                <div className="mt-10 pt-6" style={{ borderTop: `1px solid ${LINE}` }}>
                  <Link
                    href="/"
                    className="text-[13px] font-medium underline"
                    style={{ color: PRIMARY }}
                  >
                    ← Tilbake til forsiden
                  </Link>
                </div>
              </section>
            </div>

            {/* SIDE */}
            <aside className="lg:sticky lg:top-[100px] lg:self-start">
              <SideCard
                title="Last ned dataene dine"
                body="Få en eksport av alt vi har om deg som JSON eller CSV — levert innen 30 dager."
                cta="Be om eksport"
                ctaHref="mailto:post@akgolf.no?subject=Be%20om%20dataeksport"
                ctaIcon={<Download className="h-3.5 w-3.5" strokeWidth={2.4} />}
                variant="primary"
              />
              <SideCard
                title="Slett kontoen"
                body="Du kan be om sletting når som helst. Regnskap beholdes som lovpålagt (5 år)."
                cta="Be om sletting"
                ctaHref="mailto:post@akgolf.no?subject=Be%20om%20sletting"
                variant="ghost"
                marginTop={14}
              />
            </aside>
          </div>
        </div>
      </section>

      <WebFooter />
    </div>
  );
}
