/* ════════════════════════════════════════════════════════
   AK Golf — Booking V2 prototype
   8 screens + edge cases, single-file React app
   ════════════════════════════════════════════════════════ */

const { useState, useEffect, useMemo } = React;

/* ── Data ─────────────────────────────────────────────── */

const SERVICES = {
  subscription: [
    { id: "vip-30", name: "VIP-time", desc: "30 minutters individuell time med din faste instruktør. Ledig mellom dine faste timer.", duration: 30, price: 0, priceLabel: "Inkludert", meta: ["Kun medlemmer", "30 min", "1:1"] },
    { id: "vip-60", name: "VIP Long", desc: "60-minutters dybdetime med video, TrackMan og skriftlig oppfølging.", duration: 60, price: 0, priceLabel: "Inkludert", meta: ["Kun medlemmer", "60 min", "TrackMan"] },
    { id: "playing", name: "Spillerunde", desc: "Coaching på banen — 9 hull, strategi og beslutninger i ekte spillsituasjoner.", duration: 180, price: 0, priceLabel: "1 av 4 / sesong", meta: ["9 hull", "Bane", "Inkludert"] },
  ],
  flex: [
    { id: "flex-30", name: "Flex 30", desc: "Singel 30-minutters time med din valgte instruktør. Ingen binding.", duration: 30, price: 690, priceLabel: "kr", meta: ["30 min", "Single", "1:1"] },
    { id: "flex-60", name: "Flex 60", desc: "60 minutter — full svinganalyse, video, og praksisplan til neste uke.", duration: 60, price: 1290, priceLabel: "kr", meta: ["60 min", "TrackMan", "Praksisplan"] },
    { id: "flex-clinic", name: "Småklinikk", desc: "Smågruppe (maks 4) — kortspill, putting, bunker. To timer fokusert arbeid.", duration: 120, price: 890, priceLabel: "kr / pers", meta: ["120 min", "Maks 4", "Tema-fokus"] },
  ],
  course: [
    { id: "course-9", name: "9 hull med coach", desc: "On-course coaching, 9 hull. Strategi, klubbvalg og beslutninger.", duration: 180, price: 2490, priceLabel: "kr", meta: ["9 hull", "≈3 timer", "1:1"] },
    { id: "course-18", name: "18 hull med coach", desc: "Full runde med coach. Inkluderer scorecard-analyse i etterkant.", duration: 300, price: 4290, priceLabel: "kr", meta: ["18 hull", "≈5 timer", "Inkl. analyse"] },
  ],
  corporate: [
    { id: "corp-clinic", name: "Bedriftsklinikk", desc: "2 timer for inntil 12 deltakere. Range, kortspill og gøy konkurranse.", duration: 120, price: 18900, priceLabel: "kr / gruppe", meta: ["≤12 pers", "120 min", "Pakke"] },
    { id: "corp-day", name: "Heldagsturnering", desc: "Full turneringsdag med oppstartsklinikk, lunsj og premier.", duration: 480, price: 64000, priceLabel: "kr / gruppe", meta: ["≤24 pers", "Heldag", "Inkl. mat"] },
  ],
};

const FLOW_LABELS = {
  subscription: "Abonnement",
  flex: "Flex",
  course: "Bane",
  corporate: "Bedrift",
};

const COACHES = [
  {
    id: "anders",
    name: "Anders Kjær",
    role: "Hovedinstruktør · PGA Class A",
    photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=900&q=80&auto=format&fit=crop",
    badge: "Tilgjengelig denne uken",
    bio: "14 års erfaring med tour-spillere og klubbamatører. Spesialist på speed, force-plate og statistisk progresjon.",
    stats: [["14 år", "Erfaring"], ["+12 mph", "Snitt-økning"], ["280+", "Spillere i år"]],
  },
  {
    id: "ingrid",
    name: "Ingrid Holm",
    role: "Coach · TPI Level 3",
    photo: "https://images.unsplash.com/photo-1593766827228-8a8b4dbe9aff?w=900&q=80&auto=format&fit=crop",
    badge: "2 timer ledig fredag",
    bio: "Kortspill, mental tilnærming og juniorutvikling. Tidligere amatørmester. Coaching for alle handicapnivåer.",
    stats: [["9 år", "Erfaring"], ["−4.6", "Snitt-HCP-fall"], ["Junior", "Spesialist"]],
  },
];

/* April 2026 — week starts Monday. Available days hardcoded for the prototype. */
const CALENDAR = (() => {
  const days = [];
  // April 2026 starts on a Wednesday (day 3 if Monday = 1)
  // Monday-anchored grid: prepend 2 muted from March (30, 31)
  for (let i = 30; i <= 31; i++) days.push({ d: i, muted: true, month: "Mar" });
  for (let i = 1; i <= 30; i++) {
    const dow = (i + 2) % 7; // 0 = Mon
    const isWeekend = dow === 5 || dow === 6;
    const past = i < 14;
    days.push({
      d: i,
      muted: false,
      month: "Apr",
      disabled: past,
      available: !past && !isWeekend && (i % 3 !== 0 || i === 22),
      today: i === 14,
    });
  }
  // pad to complete weeks (next 4 days from May)
  for (let i = 1; i <= 3; i++) days.push({ d: i, muted: true, month: "May" });
  return days;
})();

const SLOTS = {
  morning: ["08:00", "08:45", "09:30", "10:15"],
  afternoon: ["13:00", "13:45", "14:30", "15:15"],
  evening: ["17:00", "17:45", "18:30"],
};
const SLOTS_TAKEN = new Set(["09:30", "13:45", "17:45"]);

/* ── Icons ────────────────────────────────────────────── */
const Ico = {
  arr: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  arrUp: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>,
  arrL: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  chevL: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  chevR: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  cal: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  user: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>,
};

/* ── Header ───────────────────────────────────────────── */
function FlowHead({ step, totalSteps, flowLabel }) {
  const progress = Math.round((step / totalSteps) * 100);
  return (
    <div className="flow-head">
      <a className="brand" href="#">
        <img src="assets/logos/ak-golf-logo-primary-on-light.svg" alt="AK"/>
        <span className="word">AK Golf Group</span>
      </a>
      <div className="flow-progress">
        <span>{flowLabel}</span>
        <span>·</span>
        <span>Steg {String(step).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}</span>
        <div className="bar" style={{"--progress": progress + "%"}}/>
      </div>
      <div className="flow-help">
        Trenger hjelp? <a href="#">+47 920 00 100</a>
      </div>
    </div>
  );
}

/* ── STEP 1 · Entry ───────────────────────────────────── */
function StepEntry({ flow, onPick }) {
  const flowOptions = [
    { id: "subscription", num: "01", t: "Bestill som medlem", s: "Logg inn — dine VIP-timer, baneavtaler og kvoter dukker opp her." },
    { id: "flex", num: "02", t: "Bestill enkelttime", s: "Flex-time uten binding. Velg instruktør, dag og lengde." },
    { id: "course", num: "03", t: "Bestill banespilling", s: "Coaching på banen — 9 eller 18 hull med din coach." },
    { id: "corporate", num: "04", t: "Bedrift & arrangement", s: "Klinikker, turneringer og teamdager. Snakk med oss for tilbud." },
  ];

  return (
    <>
      <div className="eyebrow">Bestill time</div>
      <h1 className="title">
        Velg <em>hvordan</em><br/>du vil spille.
      </h1>
      <p className="lede">
        Fire korte steg fra her til kalenderoppføring. Du betaler — eller bekrefter VIP-bruk — på siste trinn. Avbestilling fritt inntil 24 timer før.
      </p>

      <div className="entry-grid">
        <div className="entry-cards">
          {flowOptions.map(o => (
            <button key={o.id} className="entry-card" onClick={() => onPick(o.id)}>
              <span className="num">{o.num}</span>
              <div>
                <h3>{o.t}</h3>
                <p>{o.s}</p>
              </div>
              <span className="arr">{Ico.arr}</span>
            </button>
          ))}
        </div>

        <aside className="entry-aside">
          <div className="quote">
            Det handler ikke om å treffe ballen lenger.<br/>
            Det handler om å treffe den slik du vil — hver gang.
          </div>
          <div className="attrib">
            <span className="div"/>
            <div>
              <b>Anders Kjær</b><br/>
              <span style={{opacity: 0.65}}>Hovedinstruktør</span>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

/* ── STEP 2 · Service ─────────────────────────────────── */
function StepService({ flow, service, onPick, edge }) {
  const list = SERVICES[flow] || SERVICES.flex;
  const filters = ["Alle", "30 min", "60 min", "Bane", "Klinikk"];
  const [filter, setFilter] = useState("Alle");

  return (
    <>
      <div className="eyebrow">Steg 02 · Tjeneste</div>
      <h1 className="title">
        Hva vil du <em>jobbe med</em>?
      </h1>
      <p className="lede">
        Velg én tjeneste under. Du kan endre dette frem til betaling.
      </p>

      {edge === "quotaExceeded" && flow === "subscription" && (
        <div className="edge-banner warn">
          <span className="ic">!</span>
          <div>
            <b>Du har brukt 4 av 4 spillerunder denne sesongen.</b> Du kan fortsatt booke som Flex (egenpris) eller vente til neste sesongstart 1. mai.
          </div>
          <button className="x" aria-label="Lukk">✕</button>
        </div>
      )}

      <div className="svc-layout">
        <div>
          <div className="svc-filterbar">
            <span className="label">Filter</span>
            {filters.map(f => (
              <button
                key={f}
                className="chip"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >{f}</button>
            ))}
          </div>

          <div className="svc-list">
            {list.map((s, i) => (
              <button
                key={s.id}
                className="svc-row"
                aria-selected={service === s.id}
                onClick={() => onPick(s.id)}
              >
                <span className="num">0{i + 1}</span>
                <div>
                  <h3>{s.name}</h3>
                  <p>{s.desc}</p>
                  <div className="meta">
                    {s.meta.map(m => <span key={m}><span className="dot"/>{m}</span>)}
                  </div>
                </div>
                <div className="svc-price">
                  <div className="amt">
                    {s.price === 0 ? s.priceLabel : `${s.price.toLocaleString("nb-NO")} kr`}
                  </div>
                  {s.price !== 0 && <div className="unit">{s.priceLabel.replace("kr", "").trim() || "eks. mva"}</div>}
                </div>
                <span className="pick">{service === s.id && Ico.check}</span>
              </button>
            ))}
          </div>
        </div>

        <aside className="svc-rail">
          <h4>{FLOW_LABELS[flow]}-flyt</h4>
          <div className="sub">Hva du får</div>
          <dl>
            <div><dt>Varighet</dt><dd className="mono">30–180 min</dd></div>
            <div><dt>Lokasjon</dt><dd>AK Studio · Bærum</dd></div>
            <div><dt>Avbestilling</dt><dd>Fritt &lt; 24t før</dd></div>
            <div><dt>Inkludert</dt><dd>TrackMan · video</dd></div>
          </dl>
          <p className="note">
            Medlemmer kan veksle mellom Flex og VIP-priser. Velg medlemsstart i steg 01 for å se inkluderte timer.
          </p>
        </aside>
      </div>
    </>
  );
}

/* ── STEP 3 · Coach ───────────────────────────────────── */
function StepCoach({ coach, onPick }) {
  return (
    <>
      <div className="eyebrow">Steg 03 · Instruktør</div>
      <h1 className="title">
        Hvem vil du <em>jobbe med</em>?
      </h1>
      <p className="lede">
        Begge instruktører er kvalifisert for tjenesten du har valgt. Velg den du foretrekker — eller la oss matche basert på tilgjengelighet.
      </p>

      <div className="coach-grid">
        {COACHES.map(c => (
          <button
            key={c.id}
            className="coach-card"
            aria-selected={coach === c.id}
            onClick={() => onPick(c.id)}
          >
            <div className="coach-photo" style={{backgroundImage: `url(${c.photo})`}}>
              <span className="badge">{c.badge}</span>
            </div>
            <div className="coach-body">
              <div className="row1">
                <div>
                  <h3>{c.name}</h3>
                  <div className="role">{c.role}</div>
                </div>
              </div>
              <p>{c.bio}</p>
              <div className="coach-stats">
                {c.stats.map(([v, l]) => (
                  <div key={l}>
                    <div className="v">{v}</div>
                    <div className="l">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        className="coach-noprefer"
        aria-selected={coach === "any"}
        onClick={() => onPick("any")}
      >
        <div>
          <p className="t">Match meg automatisk</p>
          <p className="s">Vi finner den første tilgjengelige tiden uavhengig av instruktør.</p>
        </div>
        <span className="arr-circle">{Ico.arr}</span>
      </button>
    </>
  );
}

/* ── STEP 4 · Datetime ────────────────────────────────── */
function StepDatetime({ date, time, onDate, onTime, edge }) {
  const dows = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
  const slotConflict = edge === "slotTaken";

  return (
    <>
      <div className="eyebrow">Steg 04 · Dag &amp; tid</div>
      <h1 className="title">
        Når <em>passer det</em>?
      </h1>
      <p className="lede">
        Tilgjengelige dager er markert. Vi holder en valgt time i 10 minutter mens du fullfører bestillingen.
      </p>

      {slotConflict && (
        <div className="edge-banner danger">
          <span className="ic">!</span>
          <div>
            <b>Tiden ble nettopp booket av en annen.</b> Velg en ny tid under — vi har holdt resten av tidene dine ledig.
          </div>
          <button className="x" aria-label="Lukk">✕</button>
        </div>
      )}

      <div className="dt-layout">
        <div className="calendar">
          <div className="cal-head">
            <h4>April 2026</h4>
            <div className="cal-nav">
              <button>{Ico.chevL}</button>
              <button>{Ico.chevR}</button>
            </div>
          </div>
          <div className="cal-grid">
            {dows.map(d => <div key={d} className="dow">{d}</div>)}
            {CALENDAR.map((day, i) => {
              const cls = ["cal-day"];
              if (day.muted) cls.push("muted");
              if (day.disabled) cls.push("disabled");
              if (day.available) cls.push("available");
              if (day.today) cls.push("today");
              const key = `${day.month}-${day.d}`;
              const selected = date === key;
              return (
                <button
                  key={i}
                  className={cls.join(" ")}
                  aria-selected={selected}
                  onClick={() => day.available && onDate(key)}
                  disabled={!day.available}
                >
                  {day.d}
                </button>
              );
            })}
          </div>
          <div className="cal-legend">
            <span><span className="dot"/>Ledig</span>
            <span><span className="dot full"/>Fullbooket</span>
            <span>I dag · 14. april</span>
          </div>
        </div>

        <aside className="slots-pane">
          {!date ? (
            <div className="slots-empty">
              <span className="display">Velg en dag</span>
              Tilgjengelige tider vil vises her.
            </div>
          ) : (
            <>
              <h4>{date.replace("Apr-", "")}. april</h4>
              <div className="sub">Anders · 60 min</div>
              {Object.entries(SLOTS).map(([key, list]) => (
                <div key={key} className="slots-section">
                  <h5>{key === "morning" ? "Morgen" : key === "afternoon" ? "Ettermiddag" : "Kveld"}</h5>
                  <div className="slots-grid">
                    {list.map(t => (
                      <button
                        key={t}
                        className="slot"
                        aria-pressed={time === t}
                        disabled={SLOTS_TAKEN.has(t)}
                        onClick={() => onTime(t)}
                      >{t}</button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </aside>
      </div>
    </>
  );
}

/* ── STEP 5 · Details ─────────────────────────────────── */
function StepDetails({ summary, edge }) {
  const [tab, setTab] = useState("new");

  return (
    <>
      <div className="eyebrow">Steg 05 · Detaljer</div>
      <h1 className="title">
        Bare <em>litt info</em><br/>til slutt.
      </h1>

      <div className="details-layout">
        <div>
          <div className="auth-toggle">
            <button aria-pressed={tab === "new"} onClick={() => setTab("new")}>Ny kunde</button>
            <button aria-pressed={tab === "login"} onClick={() => setTab("login")}>Jeg har konto</button>
          </div>

          {tab === "new" ? (
            <div>
              <div className="field-row">
                <div className="field">
                  <label>Fornavn</label>
                  <input type="text" defaultValue="Anders" placeholder="Ola"/>
                </div>
                <div className="field">
                  <label>Etternavn</label>
                  <input type="text" defaultValue="" placeholder="Nordmann"/>
                </div>
              </div>
              <div className="field">
                <label>E-post</label>
                <input type="email" placeholder="navn@eksempel.no"/>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Telefon</label>
                  <input type="tel" placeholder="+47 ..."/>
                </div>
                <div className="field">
                  <label>Handicap (valgfritt)</label>
                  <input type="text" placeholder="f.eks. 14.2"/>
                </div>
              </div>
              <div className="field">
                <label>Notat til instruktør (valgfritt)</label>
                <textarea placeholder="F.eks. fokusområder, skader vi bør vite om, mål for timen…"/>
              </div>

              <div className="checkbox-row">
                <input type="checkbox" id="t1" defaultChecked/>
                <label htmlFor="t1">Jeg godtar <a href="#">vilkår</a> og <a href="#">avbestillingsregler</a>.</label>
              </div>
              <div className="checkbox-row">
                <input type="checkbox" id="t2"/>
                <label htmlFor="t2">Send meg månedlig nyhetsbrev (tips, tilbud, ledige timer).</label>
              </div>
            </div>
          ) : (
            <div>
              <div className="field">
                <label>E-post</label>
                <input type="email" placeholder="navn@eksempel.no"/>
              </div>
              <button className="btn btn-primary" style={{width: "100%"}}>
                Send magic link <span className="arr-circle">{Ico.arr}</span>
              </button>
              <p style={{fontSize: 13, color: "var(--muted)", marginTop: 16, textAlign: "center"}}>
                Vi sender en innloggingslenke til e-posten din. Ingen passord.
              </p>
            </div>
          )}
        </div>

        <aside className="summary-card">
          <div className="eyebrow">Din bestilling</div>
          <h4>{summary.serviceName}</h4>
          <dl>
            <div><dt>Instruktør</dt><dd>{summary.coachName}</dd></div>
            <div><dt>Dato</dt><dd className="mono">{summary.dateLabel}</dd></div>
            <div><dt>Tidspunkt</dt><dd className="mono">{summary.timeLabel}</dd></div>
            <div><dt>Varighet</dt><dd className="mono">{summary.duration} min</dd></div>
            <div><dt>Lokasjon</dt><dd>AK Studio</dd></div>
          </dl>
          <div className="total">
            <span className="l">Å betale</span>
            <span className="v">{summary.priceLabel}</span>
          </div>
          <p className="fineprint">
            Avbestilling fritt inntil 24 timer før starttid. Ved senere avbestilling belastes 50% av timeprisen.
          </p>
        </aside>
      </div>
    </>
  );
}

/* ── STEP 6 · Payment ─────────────────────────────────── */
function StepPayment({ summary, edge }) {
  const [method, setMethod] = useState("card");

  return (
    <>
      <div className="eyebrow">Steg 06 · Betaling</div>
      <h1 className="title">
        <em>Trygt</em> betalt,<br/>med Stripe.
      </h1>

      {edge === "paymentFailed" && (
        <div className="edge-banner danger">
          <span className="ic">!</span>
          <div>
            <b>Betalingen ble avbrutt.</b> Kortet ditt ble ikke belastet. Tiden er fortsatt holdt for deg i 8 minutter.
          </div>
          <button className="x" aria-label="Lukk">✕</button>
        </div>
      )}

      <div className="details-layout">
        <div>
          <div className="pay-methods">
            <button className="pay-method" aria-pressed={method === "card"} onClick={() => setMethod("card")}>
              <div className="left">
                <span className="ic">CARD</span>
                <div>
                  <div className="name">Kort</div>
                  <div className="sub">Visa, Mastercard, Amex</div>
                </div>
              </div>
              <span className="pay-radio"/>
            </button>
            <button className="pay-method" aria-pressed={method === "vipps"} onClick={() => setMethod("vipps")}>
              <div className="left">
                <span className="ic" style={{background: "#FF5B24", color: "#fff"}}>VIPPS</span>
                <div>
                  <div className="name">Vipps</div>
                  <div className="sub">Bekreft i appen</div>
                </div>
              </div>
              <span className="pay-radio"/>
            </button>
            <button className="pay-method" aria-pressed={method === "apple"} onClick={() => setMethod("apple")}>
              <div className="left">
                <span className="ic" style={{background: "#000", color: "#fff"}}>Pay</span>
                <div>
                  <div className="name">Apple Pay</div>
                  <div className="sub">Touch / Face ID</div>
                </div>
              </div>
              <span className="pay-radio"/>
            </button>
            <button className="pay-method" aria-pressed={method === "invoice"} onClick={() => setMethod("invoice")}>
              <div className="left">
                <span className="ic">FAKT</span>
                <div>
                  <div className="name">Faktura</div>
                  <div className="sub">EHF · 14 dager · bedrift</div>
                </div>
              </div>
              <span className="pay-radio"/>
            </button>
          </div>

          {method === "card" && (
            <div className="card-form">
              <div className="stripe-mark">Sikret av Stripe</div>
              <div className="field">
                <label>Kortnummer</label>
                <input type="text" placeholder="1234 1234 1234 1234"/>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Utløpsdato</label>
                  <input type="text" placeholder="MM / ÅÅ"/>
                </div>
                <div className="field">
                  <label>CVC</label>
                  <input type="text" placeholder="123"/>
                </div>
              </div>
              <div className="field" style={{marginBottom: 0}}>
                <label>Navn på kortet</label>
                <input type="text" placeholder="Ola Nordmann"/>
              </div>
            </div>
          )}
          {method === "vipps" && (
            <div className="card-form" style={{textAlign: "center", padding: 48}}>
              <div style={{fontFamily: "var(--display)", fontStyle: "italic", fontSize: 28, marginBottom: 12}}>
                Trykk «Bekreft» — vi åpner Vipps for deg.
              </div>
              <p style={{color: "var(--muted)", margin: 0}}>Tlf: +47 ••• •• 100</p>
            </div>
          )}
          {method === "apple" && (
            <div className="card-form" style={{textAlign: "center", padding: 48}}>
              <div style={{fontFamily: "var(--display)", fontStyle: "italic", fontSize: 28}}>
                Bruk Touch ID når du trykker «Bekreft».
              </div>
            </div>
          )}
          {method === "invoice" && (
            <div className="card-form">
              <div className="stripe-mark" style={{color: "var(--muted)"}}>Krever org.nr.</div>
              <div className="field">
                <label>Org.nummer</label>
                <input type="text" placeholder="999 999 999"/>
              </div>
              <div className="field">
                <label>Fakturaadresse / EHF</label>
                <input type="text" placeholder="Slik den står registrert"/>
              </div>
            </div>
          )}
        </div>

        <aside className="summary-card">
          <div className="eyebrow">Oppsummering</div>
          <h4>{summary.serviceName}</h4>
          <dl>
            <div><dt>Instruktør</dt><dd>{summary.coachName}</dd></div>
            <div><dt>Når</dt><dd className="mono">{summary.dateLabel} · {summary.timeLabel}</dd></div>
            <div><dt>Varighet</dt><dd className="mono">{summary.duration} min</dd></div>
            <div><dt>Subtotal</dt><dd className="mono">{summary.priceLabel}</dd></div>
            <div><dt>MVA (25%)</dt><dd className="mono">{summary.vatLabel}</dd></div>
          </dl>
          <div className="total">
            <span className="l">Totalt</span>
            <span className="v">{summary.priceLabel}</span>
          </div>
          <p className="fineprint">
            Du belastes nå. Bekreftelse og .ics-fil sendes på e-post.
          </p>
        </aside>
      </div>
    </>
  );
}

/* ── STEP 7 · Confirmation ────────────────────────────── */
function StepConfirm({ summary }) {
  return (
    <div className="confirm">
      <div className="seal">✓</div>
      <div className="ref">Bekreftelse · AK-2026-04-22-INX</div>
      <h1 className="title">
        Du er <em>booket</em>.
      </h1>
      <p className="lede">
        Vi har sendt en bekreftelse til e-posten din, sammen med en kalenderoppføring og forberedelser til timen.
      </p>

      <div className="confirm-card">
        <div>
          <div className="when">{summary.dateLabel} · {summary.timeLabel}</div>
          <div className="title-l">{summary.serviceName}</div>
          <div className="deets">
            <div><b>{summary.coachName}</b> · {summary.duration} min</div>
            <div>AK Studio · Vollsveien 13, Bærum</div>
            <div>Møt opp 10 min før — vi varmer opp sammen.</div>
          </div>
        </div>
        <div className="qrcode" aria-label="QR-kode for innsjekk"/>
      </div>

      <div className="confirm-actions">
        <button className="btn btn-primary">
          Last ned .ics <span className="arr-circle">{Ico.arr}</span>
        </button>
        <button className="btn btn-secondary">Legg til i Google</button>
        <button className="btn btn-secondary">Legg til i Apple</button>
      </div>

      <div className="confirm-rules">
        <h5>Det finstilte</h5>
        <ul>
          <li><b>Avbestilling</b><span>Fritt inntil 24t før. Etter det belastes 50%.</span></li>
          <li><b>Forsinkelse</b><span>Vi venter til 15 min over — deretter regnes timen som tatt.</span></li>
          <li><b>Endring</b><span>Du kan flytte timen én gang fritt, fra «Mine timer».</span></li>
          <li><b>Forberedelse</b><span>Ta med dine egne klubber. Baller og TrackMan er klart.</span></li>
        </ul>
      </div>
    </div>
  );
}

/* ── EDGE: Waitlist empty ─────────────────────────────── */
function EdgeWaitlist() {
  return (
    <>
      <div className="eyebrow">Ingen ledige timer</div>
      <div className="empty-state">
        <div className="ill">⌁</div>
        <h3>Alle tider er fulle.</h3>
        <p>Anders er fullbooket de neste 3 ukene. Sett deg på venteliste — du varsles først hvis noen avbestiller.</p>
        <div style={{display: "flex", gap: 12, justifyContent: "center"}}>
          <button className="btn btn-primary">Sett meg på venteliste <span className="arr-circle">{Ico.arr}</span></button>
          <button className="btn btn-secondary">Velg annen instruktør</button>
        </div>
      </div>
    </>
  );
}

/* ── App shell ────────────────────────────────────────── */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "step": 1,
  "flow": "flex",
  "edge": "none"
}/*EDITMODE-END*/;

const STEPS = [
  { n: 1, label: "Inngang" },
  { n: 2, label: "Tjeneste" },
  { n: 3, label: "Instruktør" },
  { n: 4, label: "Tid" },
  { n: 5, label: "Detaljer" },
  { n: 6, label: "Betaling" },
  { n: 7, label: "Bekreftet" },
  { n: 8, label: "Edge" },
];

function App() {
  const [step, setStep] = useState(TWEAK_DEFAULTS.step);
  const [flow, setFlow] = useState(TWEAK_DEFAULTS.flow);
  const [edge, setEdge] = useState(TWEAK_DEFAULTS.edge);

  const [service, setService] = useState("flex-60");
  const [coach, setCoach] = useState("anders");
  const [date, setDate] = useState("Apr-22");
  const [time, setTime] = useState("13:00");

  // Build summary
  const summary = useMemo(() => {
    const svc = (SERVICES[flow] || SERVICES.flex).find(s => s.id === service) || SERVICES.flex[1];
    const coachObj = COACHES.find(c => c.id === coach) || COACHES[0];
    const priceLabel = svc.price === 0 ? "Inkludert" : `${svc.price.toLocaleString("nb-NO")} kr`;
    const vat = svc.price === 0 ? 0 : Math.round(svc.price * 0.20);
    return {
      serviceName: svc.name,
      coachName: coach === "any" ? "Første ledige" : coachObj.name,
      dateLabel: date ? `${date.split("-")[1]}. april 2026` : "—",
      timeLabel: time || "—",
      duration: svc.duration,
      priceLabel,
      vatLabel: svc.price === 0 ? "—" : `${vat.toLocaleString("nb-NO")} kr`,
    };
  }, [flow, service, coach, date, time]);

  const totalSteps = 7;
  const flowLabel = FLOW_LABELS[flow] || "Flex";

  const goNext = () => setStep(s => Math.min(s + 1, 8));
  const goBack = () => setStep(s => Math.max(s - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1: return <StepEntry flow={flow} onPick={(f) => { setFlow(f); goNext(); }}/>;
      case 2: return <StepService flow={flow} service={service} onPick={(s) => { setService(s); }} edge={edge}/>;
      case 3: return <StepCoach coach={coach} onPick={(c) => { setCoach(c); }}/>;
      case 4: return <StepDatetime date={date} time={time} onDate={setDate} onTime={setTime} edge={edge}/>;
      case 5: return <StepDetails summary={summary} edge={edge}/>;
      case 6: return <StepPayment summary={summary} edge={edge}/>;
      case 7: return <StepConfirm summary={summary}/>;
      case 8: return <EdgeWaitlist/>;
      default: return null;
    }
  };

  return (
    <>
      {/* Prototype toolbar */}
      <div className="proto-bar">
        <div className="proto-bar-inner">
          <div className="group">
            <span className="proto-label">Flow</span>
            <div className="seg">
              {Object.entries(FLOW_LABELS).map(([k, l]) => (
                <button key={k} aria-pressed={flow === k} onClick={() => setFlow(k)}>{l}</button>
              ))}
            </div>
          </div>
          <div className="group">
            <span className="proto-label">Edge</span>
            <div className="seg">
              {[
                ["none", "Standard"],
                ["slotTaken", "Tid tatt"],
                ["paymentFailed", "Betaling avbrutt"],
                ["quotaExceeded", "Kvote brukt opp"],
              ].map(([k, l]) => (
                <button key={k} aria-pressed={edge === k} onClick={() => setEdge(k)}>{l}</button>
              ))}
            </div>
          </div>
          <div className="step-jump">
            <span className="proto-label">Steg</span>
            {STEPS.map((s, i) => (
              <React.Fragment key={s.n}>
                {i === 7 && <span className="sep"/>}
                <button
                  aria-pressed={step === s.n}
                  onClick={() => setStep(s.n)}
                  title={s.label}
                >{s.n === 8 ? "E" : s.n}</button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="flow" data-screen-label={`${String(step).padStart(2, "0")} ${STEPS[step - 1]?.label || ""}`}>
        <FlowHead step={Math.min(step, totalSteps)} totalSteps={totalSteps} flowLabel={flowLabel}/>

        {renderStep()}

        {step > 1 && step < 7 && (
          <div className="flow-actions">
            <button className="btn btn-ghost" onClick={goBack}>
              <span style={{transform: "rotate(0deg)", display: "inline-flex"}}>{Ico.arrL}</span> Tilbake
            </button>
            <span className="l">Du kan endre senere — ingenting bekreftet før betaling.</span>
            <button className="btn btn-primary" onClick={goNext}>
              {step === 6 ? "Bekreft & betal" : "Fortsett"}
              <span className="arr-circle">{Ico.arr}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
