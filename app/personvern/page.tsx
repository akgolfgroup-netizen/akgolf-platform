import type { Metadata } from "next";
import { LandingShell } from "@/components/website-v2/LandingShell";

export const metadata: Metadata = {
  title: "Personvern",
  description: "Personvernerklæring for AK Golf Group AS. Vi behandler dataene dine med omhu — klart språk, ingen jusspråk.",
};

export default function PersonvernPage() {
  return (
    <LandingShell>
      <section className="px-4 pb-20 pt-28 md:px-8 md:pb-28 md:pt-36">
        <div className="mx-auto max-w-[720px]">
          <div
            className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "var(--color-primary)", fontFamily: "var(--font-jetbrains-mono)" }}
          >
            <span className="h-px w-5" style={{ background: "var(--color-ink)" }} />
            Juridisk
          </div>
          <h1
            className="mb-8 text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.05] tracking-[-0.025em]"
            style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
          >
            Personvern
          </h1>

          <div className="flex flex-col gap-8">
            <LegalSection title="Hvem er vi?">
              <p style={{ color: "var(--color-ink-muted)" }}>
                AK Golf Group AS (org.nr. 925 884 102) er behandlingsansvarlig for personopplysninger samlet inn via våre nettsider og tjenester. Kontakt oss på post@akgolf.no ved spørsmål om personvern.
              </p>
            </LegalSection>

            <LegalSection title="Hvilke data samler vi inn?">
              <ul className="list-disc space-y-2 pl-5" style={{ color: "var(--color-ink-muted)" }}>
                <li>Navn, e-post og telefonnummer ved booking eller kontakt</li>
                <li>Handicap og golfrelaterte data du selv legger inn i PlayersHQ</li>
                <li>Betalingsinformasjon (håndteres av Stripe — vi lagrer ikke kortdetaljer)</li>
                <li>Nettleserdata og informasjonskapsler for å forbedre brukeropplevelsen</li>
              </ul>
            </LegalSection>

            <LegalSection title="Hva bruker vi dataene til?">
              <ul className="list-disc space-y-2 pl-5" style={{ color: "var(--color-ink-muted)" }}>
                <li>Å levere coaching-tjenester og administrere bookinger</li>
                <li>Å gi deg tilgang til PlayersHQ og personlig treningsplan</li>
                <li>Å sende påminnelser og viktig informasjon om dine bookinger</li>
                <li>Å forbedre våre tjenester basert på brukermønstre</li>
              </ul>
            </LegalSection>

            <LegalSection title="Dine rettigheter">
              <p style={{ color: "var(--color-ink-muted)" }}>
                Du har rett til å be om innsyn i, retting av, eller sletting av dine personopplysninger. Du kan også be om begrenset behandling eller dataportabilitet. Kontakt oss på post@akgolf.no for å utøve dine rettigheter.
              </p>
            </LegalSection>

            <LegalSection title="Informasjonskapsler">
              <p style={{ color: "var(--color-ink-muted)" }}>
                Vi bruker informasjonskapsler for å huske innlogging, lagre preferanser og analysere trafikk. Du kan når som helst endre samtykke via nettleserinnstillingene.
              </p>
            </LegalSection>

            <LegalSection title="Endringer i personvernerklæringen">
              <p style={{ color: "var(--color-ink-muted)" }}>
                Vi kan oppdatere denne erklæringen ved behov. Siste oppdatering: 29. april 2026.
              </p>
            </LegalSection>
          </div>
        </div>
      </section>
    </LandingShell>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}>
        {title}
      </h2>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
