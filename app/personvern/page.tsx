"use client";

import Link from "next/link";
import { WebNav } from "@/components/website-v2/web-nav";
import { WebFooter } from "@/components/website-v2/web-footer";

export default function PersonvernPage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-on-surface focus:text-surface focus:rounded-lg"
      >
        Hopp til hovedinnhold
      </a>
      <WebNav />

      <main className="pt-[52px]" id="main-content">
        <section className="w-section-lg">
          <div className="w-container max-w-3xl">
            <h1 className="w-heading-lg mb-4">Personvernerklæring</h1>
            <p className="text-on-surface-variant text-sm mb-12">
              Sist oppdatert: 1. mars 2026
            </p>

            <div className="prose space-y-8 text-on-surface-variant text-sm leading-relaxed">
              <div>
                <h2 className="w-heading-sm text-on-surface mb-3">1. Behandlingsansvarlig</h2>
                <p>
                  AK Golf Group er behandlingsansvarlig for personopplysninger som samles inn via dette
                  nettstedet og i forbindelse med vår coaching-virksomhet (AK Golf Academy og Junior Academy).
                </p>
                <p className="mt-2">
                  Kontakt oss på{" "}
                  <a href="mailto:post@akgolf.no" className="text-on-surface hover:underline">
                    post@akgolf.no
                  </a>{" "}
                  ved spørsmål om personvern.
                </p>
              </div>

              <div>
                <h2 className="w-heading-sm text-on-surface mb-3">2. Lovgrunnlag</h2>
                <p>
                  Behandling av personopplysninger skjer i henhold til personopplysningsloven og EUs
                  personvernforordning (GDPR), som gjelder i Norge via EØS-avtalen.
                </p>
              </div>

              <div>
                <h2 className="w-heading-sm text-on-surface mb-3">3. Hvilke opplysninger vi samler inn</h2>

                <h3 className="text-on-surface-variant font-medium text-sm mt-4 mb-2">Via nettstedet</h3>
                <p>
                  Når du bruker kontaktskjemaet vårt, samler vi inn: navn, e-postadresse,
                  telefonnummer, handicap, valgt program og eventuell melding du inkluderer.
                  Vi samler ikke inn opplysninger utover det du selv oppgir.
                </p>

                <h3 className="text-on-surface-variant font-medium text-sm mt-4 mb-2">Som elev/junior i våre programmer</h3>
                <p>
                  For elever i Academy og Junior Academy samler vi også inn:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Fødselsdato (for aldersgruppeplassering)</li>
                  <li>Treningsdata (IUP-kategori, testresultater, økt-notater)</li>
                  <li>Videoopptak av sving (for teknisk analyse)</li>
                  <li>Relevant helseinformasjon (for tilpasset trening)</li>
                  <li>Nødkontaktinformasjon</li>
                  <li>For juniorer: foresattes kontaktinformasjon</li>
                </ul>
              </div>

              <div>
                <h2 className="w-heading-sm text-on-surface mb-3">4. Formål og rettslig grunnlag</h2>
                <table className="w-full text-sm mt-2">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="text-left py-2 text-on-surface-variant font-medium">Behandling</th>
                      <th className="text-left py-2 text-on-surface-variant font-medium">Grunnlag</th>
                    </tr>
                  </thead>
                  <tbody className="text-on-surface-variant">
                    <tr className="border-b border-outline-variant">
                      <td className="py-2">Kontaktinfo og fakturering</td>
                      <td className="py-2">Oppfyllelse av avtale (art. 6(1)(b))</td>
                    </tr>
                    <tr className="border-b border-outline-variant">
                      <td className="py-2">Treningsdata og IUP</td>
                      <td className="py-2">Oppfyllelse av avtale (art. 6(1)(b))</td>
                    </tr>
                    <tr className="border-b border-outline-variant">
                      <td className="py-2">Helseinformasjon</td>
                      <td className="py-2">Uttrykkelig samtykke (art. 9(2)(a))</td>
                    </tr>
                    <tr className="border-b border-outline-variant">
                      <td className="py-2">Videoopptak for coaching</td>
                      <td className="py-2">Berettiget interesse + samtykke</td>
                    </tr>
                    <tr className="border-b border-outline-variant">
                      <td className="py-2">Bilder/video til markedsføring</td>
                      <td className="py-2">Uttrykkelig samtykke (art. 6(1)(a))</td>
                    </tr>
                    <tr>
                      <td className="py-2">Barn under 16 år</td>
                      <td className="py-2">Foreldresamtykke (art. 8)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h2 className="w-heading-sm text-on-surface mb-3">5. Lagring og sletting</h2>
                <table className="w-full text-sm mt-2">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="text-left py-2 text-on-surface-variant font-medium">Datatype</th>
                      <th className="text-left py-2 text-on-surface-variant font-medium">Lagringsperiode</th>
                    </tr>
                  </thead>
                  <tbody className="text-on-surface-variant">
                    <tr className="border-b border-outline-variant">
                      <td className="py-2">Kontaktinfo og fakturering</td>
                      <td className="py-2">5 år etter avsluttet kundeforhold (regnskapsloven)</td>
                    </tr>
                    <tr className="border-b border-outline-variant">
                      <td className="py-2">Treningsdata og IUP</td>
                      <td className="py-2">2 år etter avsluttet kundeforhold</td>
                    </tr>
                    <tr className="border-b border-outline-variant">
                      <td className="py-2">Videoopptak</td>
                      <td className="py-2">1 år etter opptak</td>
                    </tr>
                    <tr className="border-b border-outline-variant">
                      <td className="py-2">Markedsføringsbilder</td>
                      <td className="py-2">Inntil samtykke trekkes tilbake</td>
                    </tr>
                    <tr>
                      <td className="py-2">Helseinformasjon</td>
                      <td className="py-2">Slettes ved avsluttet kundeforhold</td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-3">
                  Ved avsluttet kundeforhold kan du be om kopi av egne data før sletting.
                  Sletting bekreftes skriftlig.
                </p>
              </div>

              <div>
                <h2 className="w-heading-sm text-on-surface mb-3">6. Deling av data</h2>
                <p>
                  Vi deler ikke dine personopplysninger med tredjeparter uten ditt samtykke,
                  med unntak av:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>
                    <strong className="text-on-surface-variant">GFGK (Gamle Fredrikstad Golfklubb)</strong> — navn og
                    kontaktinfo deles for fasilitetsbooking og koordinering av trening
                  </li>
                  <li>
                    <strong className="text-on-surface-variant">Formspree</strong> — skjemadata sendes via Formspree
                    for behandling av henvendelser fra nettstedet
                  </li>
                </ul>
                <p className="mt-2">
                  Dine data deles aldri med andre elever, sponsorer, arbeidsgivere
                  eller forsikringsselskaper.
                </p>
              </div>

              <div>
                <h2 className="w-heading-sm text-on-surface mb-3">7. Datasikkerhet</h2>
                <p>
                  Vi beskytter dine data med tilgangskontroll, sterke passord, tofaktorautentisering
                  og kryptering. Kun autorisert personell (trenere med ansvar for din coaching) har
                  tilgang til dine treningsdata.
                </p>
              </div>

              <div>
                <h2 className="w-heading-sm text-on-surface mb-3">8. Dine rettigheter</h2>
                <p>I henhold til GDPR har du følgende rettigheter:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong className="text-on-surface-variant">Innsyn</strong> (art. 15) — se alle data vi har lagret om deg</li>
                  <li><strong className="text-on-surface-variant">Retting</strong> (art. 16) — korrigere feilaktige opplysninger</li>
                  <li><strong className="text-on-surface-variant">Sletting</strong> (art. 17) — be om at data slettes</li>
                  <li><strong className="text-on-surface-variant">Begrensning</strong> (art. 18) — begrense behandlingen</li>
                  <li><strong className="text-on-surface-variant">Dataportabilitet</strong> (art. 20) — få data utlevert i maskinlesbart format</li>
                  <li><strong className="text-on-surface-variant">Innsigelse</strong> (art. 21) — protestere mot behandling</li>
                </ul>
                <p className="mt-3">
                  Henvendelser rettes til{" "}
                  <a href="mailto:post@akgolf.no" className="text-on-surface hover:underline">
                    post@akgolf.no
                  </a>
                  . Vi svarer innen 30 dager.
                </p>
              </div>

              <div>
                <h2 className="w-heading-sm text-on-surface mb-3">9. Samtykke</h2>
                <p>
                  Ved oppstart som elev signerer du et samtykkeskjema som dekker lagring av
                  treningsdata, videoopptak, helseinformasjon og eventuell markedsføring.
                  For juniorer under 16 år kreves foresattes samtykke.
                </p>
                <p className="mt-2">
                  Samtykke kan trekkes tilbake når som helst ved å kontakte oss skriftlig
                  (e-post er tilstrekkelig). Tilbaketrekking påvirker ikke lovligheten av
                  behandling som allerede har skjedd.
                </p>
              </div>

              <div>
                <h2 className="w-heading-sm text-on-surface mb-3">10. Informasjonskapsler</h2>
                <p>
                  Dette nettstedet bruker kun nødvendige informasjonskapsler for grunnleggende
                  funksjonalitet (cookie-samtykke og sesjonsdata). Vi bruker ikke sporingskapsler
                  eller tredjeparts analyseverktøy.
                </p>
              </div>

              <div>
                <h2 className="w-heading-sm text-on-surface mb-3">11. Klage</h2>
                <p>
                  Dersom du mener at AK Golf Group ikke behandler personopplysninger korrekt,
                  kan du klage til{" "}
                  <a
                    href="https://www.datatilsynet.no"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-on-surface hover:underline"
                  >
                    Datatilsynet
                  </a>
                  .
                </p>
              </div>

              <div>
                <h2 className="w-heading-sm text-on-surface mb-3">12. Endringer</h2>
                <p>
                  Denne personvernerklæringen kan oppdateres. Vesentlige endringer vil bli
                  kommunisert via nettstedet. Vi anbefaler at du gjennomgår denne siden jevnlig.
                </p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-outline-variant">
              <Link href="/" className="text-sm text-on-surface hover:underline">
                &larr; Tilbake til forsiden
              </Link>
            </div>
          </div>
        </section>
      </main>

      <WebFooter />
    </>
  );
}
