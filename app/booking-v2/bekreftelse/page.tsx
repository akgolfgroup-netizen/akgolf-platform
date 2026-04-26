import { Stepper } from "@/components/booking-v2/Stepper";
import { POLICY, SERVICES, TRAINERS } from "@/components/booking-v2/copy";

interface PageProps {
  searchParams: Promise<{
    service?: string;
    trainer?: string;
    date?: string;
    time?: string;
  }>;
}

const ICS_DATA =
  "data:text/calendar;charset=utf-8," +
  encodeURIComponent(
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//AK Golf//Booking V2//NO",
      "BEGIN:VEVENT",
      "SUMMARY:Performance 1:1 med Anders",
      "DTSTART:20260428T123000Z",
      "DTEND:20260428T125000Z",
      "LOCATION:AK Golf studio, Oslo",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n")
  );

export default async function BekreftelsePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const serviceId = params.service ?? "performance";
  const trainerId = params.trainer ?? "anders";

  const service = SERVICES.find((s) => s.id === serviceId);
  const trainer = TRAINERS.find((t) => t.id === trainerId);

  // VERIFY: ekte booking-id genereres av server action
  const bookingId = "AK-2026-04-1430";

  return (
    <>
      <Stepper current={7} />
      <section className="step-page active" data-step={7}>
        <div className="confirm-grid">
          <div>
            <div className="confirm-mark">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="eyebrow">
              <span className="num">{bookingId}</span>
              Bekreftet
            </p>
            <h1 className="t-section">
              Vi sees <em>tirsdag</em>.
            </h1>
            <p className="lede">
              Bekreftelse er sendt på e-post. Du får en påminnelse 24 t før økten, og en SMS én time
              før.
            </p>

            <div className="confirm-meta">
              <div className="cell dark">
                <div className="l">Når</div>
                <div className="v">
                  14:30
                  <small>Ti 28. apr · {service?.category === "abonnement" ? "20" : "50"} minutter</small>
                </div>
              </div>
              <div className="cell">
                <div className="l">Med</div>
                <div className="v">
                  {trainer?.name ?? "Begge"}
                  <small>{trainer?.role.split(" · ")[0] ?? ""}</small>
                </div>
              </div>
              <div className="cell">
                <div className="l">Hvor</div>
                <div className="v">
                  AK Golf studio<small>Oslo</small>
                </div>
              </div>
              <div className="cell">
                <div className="l">Betalt</div>
                <div className="v">
                  {service?.price ?? ""}
                  <small>Visa **** 4422 · kvittering på e-post</small>
                </div>
              </div>
            </div>

            <div className="add-cal">
              <a className="btn btn-primary" href={ICS_DATA} download="ak-golf-booking.ics">
                Last ned .ics
              </a>
              <a className="btn btn-secondary" href="#google">
                Legg til i Google
              </a>
              <a className="btn btn-secondary" href="#apple">
                Legg til i Apple
              </a>
            </div>

            <div className="what-next">
              <h3>Hva skjer nå</h3>
              <ol>
                <li>
                  <span className="n">01</span>
                  <div>
                    <b>I dag</b>
                    <p>
                      Bekreftelses-e-post med et kort spørreskjema (3 spørsmål) — så Anders kan
                      forberede seg.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="n">02</span>
                  <div>
                    <b>27. apr · 14:30</b>
                    <p>Påminnelse på e-post med veibeskrivelse, parkering og hva du skal ha med.</p>
                  </div>
                </li>
                <li>
                  <span className="n">03</span>
                  <div>
                    <b>28. apr · 13:30</b>
                    <p>SMS med direktelink til treneren om noe skulle dukke opp.</p>
                  </div>
                </li>
                <li>
                  <span className="n">04</span>
                  <div>
                    <b>Etter økten</b>
                    <p>
                      Du får TrackMan-rapporten og en skriftlig hjemmeplan i appen — innen 24 timer.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <aside className="policy-card">
            <h4>Avbestillingsregler</h4>
            {POLICY.rules.map((rule, i) => (
              <div key={i} className="rule">
                <span className="when">{rule.when}</span>
                <div>
                  <b className={rule.className}>{rule.title}</b>
                  {rule.text}
                </div>
              </div>
            ))}
            <div
              style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: "1px solid var(--line)",
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button type="button" className="btn btn-secondary" style={{ fontSize: 13 }}>
                Avbestill
              </button>
              <button type="button" className="btn btn-secondary" style={{ fontSize: 13 }}>
                Endre tid
              </button>
              <a href="/portal" className="btn btn-secondary" style={{ fontSize: 13 }}>
                Min side →
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
