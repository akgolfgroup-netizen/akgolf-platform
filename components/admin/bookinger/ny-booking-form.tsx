import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  Circle,
  CircleDot,
  Dumbbell,
  Flag,
  MapPin,
  Repeat,
  Sliders,
  Sparkles,
  Target,
  User,
  UserCheck,
  Users2,
  Zap,
} from "lucide-react";

const SESSION_TYPES = [
  { id: "coaching", label: "Coaching", price: "FRA 690 KR", icon: Dumbbell, active: true },
  { id: "trackman", label: "Trackman", price: "FRA 890 KR", icon: BarChart3 },
  { id: "gruppe", label: "Gruppe", price: "FRA 290 KR", icon: Users2 },
  { id: "bane", label: "På banen", price: "FRA 990 KR", icon: Flag },
];

const FOCUS_OPTS = [
  { id: "driver", label: "Driver", icon: Zap },
  { id: "iron", label: "Iron", icon: Target },
  { id: "short", label: "Short-game", icon: CircleDot, active: true },
  { id: "putt", label: "Putting", icon: Circle },
  { id: "bunker", label: "Bunker", icon: Activity },
  { id: "mental", label: "Mental", icon: Brain },
  { id: "annet", label: "Annet", icon: Sliders },
];

const COACHES = [
  { id: "anders", label: "Anders K.", sub: "primær", icon: User },
  { id: "maria", label: "Maria T.", icon: User },
  { id: "erik", label: "Erik S.", sub: "short-game", icon: UserCheck, active: true },
];

const LOCATIONS = [
  "Studio 1",
  "Studio 2",
  "Performance studio",
  "Range bay 1–6",
  "Putting green",
  "Bunker",
];

const DATES = [
  { dow: "Man", day: "28", free: "3 ledig" },
  { dow: "Tir", day: "29", free: "2 ledig" },
  { dow: "Ons", day: "30", free: "FULL", full: true },
  { dow: "Tor", day: "01", free: "5 ledig" },
  { dow: "Fre", day: "02", free: "7 ledig", active: true },
  { dow: "Lør", day: "03", free: "4 ledig" },
  { dow: "Søn", day: "04", free: "2 ledig" },
];

const SLOTS = [
  { t: "08:00", taken: true },
  { t: "09:00" },
  { t: "09:30" },
  { t: "10:00" },
  { t: "10:30", taken: true },
  { t: "11:00" },
  { t: "11:30", taken: true },
  { t: "12:00" },
  { t: "12:30" },
  { t: "13:00" },
  { t: "13:30", suggested: true },
  { t: "14:00", active: true },
  { t: "14:30" },
  { t: "15:00" },
  { t: "15:30", taken: true },
  { t: "16:00" },
  { t: "16:30" },
  { t: "17:00" },
];

const DURATIONS = ["15 min", "30 min", "45 min", "60 min", "90 min"];
const REPEATS = ["Engangs", "Hver uke", "Annen hver", "Hver måned", "Tilpass…"];

export function NyBookingForm() {
  return (
    <div
      className="rounded-[14px] border border-white/8 bg-white/[0.04] p-6"
      style={{ borderColor: "rgba(255,255,255,0.10)" }}
    >
      <h2 className="mb-1 font-inter-tight text-[16px] font-semibold tracking-tight text-white">
        Detaljer
      </h2>
      <div className="mb-5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
        trinn 1 — fyll ut
      </div>

      {/* AI suggestion */}
      <div className="mb-5 flex items-start gap-3 rounded-[10px] border p-3.5"
        style={{ background: "rgba(175,82,222,0.08)", borderColor: "rgba(175,82,222,0.25)" }}
      >
        <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={1.8} style={{ color: "#C896E8" }} />
        <div>
          <h4 className="m-0 mb-1 text-[12px] font-semibold text-white">AI-forslag</h4>
          <p className="m-0 text-[12px] leading-relaxed text-white/70">
            Sofie har ikke booket short-game denne uken og around-green er svakeste ledd. Foreslå{" "}
            <strong className="text-white">30 min bunker-økt fredag 14:00</strong> med Erik S.?
          </p>
          <span
            className="mt-1.5 inline-block rounded-full px-2 py-[3px] text-[11px] font-semibold"
            style={{ background: "rgba(209,248,67,0.14)", color: "#D1F843" }}
          >
            Bruk forslag
          </span>
        </div>
      </div>

      {/* Spiller (selected) */}
      <Field label="Spiller" hint="Søk eller velg" required>
        <div
          className="flex items-center gap-3 rounded-[10px] border px-3 py-2.5"
          style={{ background: "rgba(209,248,67,0.10)", borderColor: "rgba(209,248,67,0.30)" }}
        >
          <div className="grid h-9 w-9 place-items-center rounded-full bg-accent text-[13px] font-bold text-[#0A1F18]">
            SH
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-white">Sofie Holm</div>
            <div className="mt-px font-mono text-[10px] tracking-wider text-white/50">
              HCP 4.2 · PERFORMANCE PLAN · ASKER GK
            </div>
          </div>
          <button
            type="button"
            className="ml-auto cursor-pointer text-[11px] font-semibold"
            style={{ color: "#D1F843" }}
          >
            Bytt
          </button>
        </div>
      </Field>

      {/* Type segmented */}
      <Field label="Økt-type" hint="Påvirker pris og varighet" required>
        <div className="grid grid-cols-4 gap-1.5">
          {SESSION_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                className={
                  "rounded-[10px] border px-2.5 py-3 text-center transition " +
                  (t.active
                    ? "border-accent/30 bg-accent/10"
                    : "border-white/8 bg-white/[0.025] hover:bg-white/[0.05]")
                }
              >
                <Icon
                  className={"mx-auto mb-1.5 h-5 w-5 " + (t.active ? "text-accent" : "text-white/70")}
                  strokeWidth={1.8}
                />
                <div className={"text-[12px] font-medium " + (t.active ? "text-white" : "text-white/85")}>
                  {t.label}
                </div>
                <div className="mt-0.5 font-mono text-[10px] tracking-wider text-white/50">
                  {t.price}
                </div>
              </button>
            );
          })}
        </div>
      </Field>

      {/* Fokus radios */}
      <Field label="Fokus" required>
        <RadioRow>
          {FOCUS_OPTS.map((o) => {
            const Icon = o.icon;
            return (
              <RadioOpt key={o.id} active={o.active}>
                <Icon className="h-3 w-3" strokeWidth={1.8} /> {o.label}
              </RadioOpt>
            );
          })}
        </RadioRow>
      </Field>

      {/* Coach */}
      <Field label="Coach" hint="3 tilgjengelig i tidsrommet" required>
        <RadioRow>
          {COACHES.map((c) => {
            const Icon = c.icon;
            return (
              <RadioOpt key={c.id} active={c.active}>
                <Icon className="h-3 w-3" strokeWidth={1.8} /> {c.label}
                {c.sub && <span className="opacity-70"> · {c.sub}</span>}
              </RadioOpt>
            );
          })}
        </RadioRow>
      </Field>

      {/* Lokasjon */}
      <Field label="Lokasjon" required>
        <RadioRow>
          {LOCATIONS.map((loc) => (
            <RadioOpt key={loc} active={loc === "Bunker"}>
              <MapPin className="h-3 w-3" strokeWidth={1.8} /> {loc}
            </RadioOpt>
          ))}
        </RadioRow>
      </Field>

      {/* Dato */}
      <Field label="Dato" hint="Uke 18 · 28 apr–4 mai" required>
        <div className="grid grid-cols-7 gap-1.5">
          {DATES.map((d) => (
            <button
              key={d.day}
              type="button"
              className={
                "rounded-md border px-1.5 py-2.5 text-center transition " +
                (d.active
                  ? "border-accent/30 bg-accent/10"
                  : "border-white/8 bg-white/[0.025] hover:bg-white/[0.05]")
              }
            >
              <div
                className={
                  "font-mono text-[9px] uppercase tracking-[0.12em] " +
                  (d.active ? "text-accent" : "text-white/50")
                }
              >
                {d.dow}
              </div>
              <div className="mt-0.5 text-[18px] font-bold tracking-tight tabular-nums text-white">
                {d.day}
              </div>
              <div
                className={
                  "mt-px font-mono text-[10px] " +
                  (d.full ? "text-[#F49283]" : "text-white/50")
                }
              >
                {d.free}
              </div>
            </button>
          ))}
        </div>
      </Field>

      {/* Slots */}
      <Field label="Tidspunkt" hint="Erik S. · Fre 2. mai" required>
        <div className="grid grid-cols-6 gap-1.5">
          {SLOTS.map((s) => (
            <button
              key={s.t}
              type="button"
              disabled={s.taken}
              className={
                "rounded-[7px] border px-1.5 py-2 text-center font-mono text-[12px] font-medium transition " +
                (s.active
                  ? "border-accent bg-accent text-[#0A1F18] font-bold"
                  : s.taken
                    ? "cursor-not-allowed border-white/8 bg-white/[0.015] text-white/25 line-through"
                    : s.suggested
                      ? "border-dashed border-accent/50 bg-white/[0.025] text-white"
                      : "border-white/8 bg-white/[0.025] text-white hover:bg-white/[0.05]")
              }
            >
              {s.t}
            </button>
          ))}
        </div>
      </Field>

      {/* Varighet */}
      <Field label="Varighet" required>
        <RadioRow>
          {DURATIONS.map((d) => (
            <RadioOpt key={d} active={d === "30 min"}>
              {d}
            </RadioOpt>
          ))}
        </RadioRow>
      </Field>

      {/* Konflikt */}
      <Field>
        <div
          className="flex items-start gap-2.5 rounded-md border-l-[3px] p-3.5"
          style={{
            background: "rgba(196,138,50,0.10)",
            border: "1px solid rgba(196,138,50,0.30)",
            borderLeftColor: "#E8B967",
            borderLeftWidth: 3,
          }}
        >
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color: "#E8B967" }} strokeWidth={1.8} />
          <div>
            <h4 className="m-0 mb-0.5 text-[12px] font-semibold text-white">
              Hint: Erik S. har Putting-økt 13:30–14:00
            </h4>
            <p className="m-0 text-[11px] leading-relaxed text-white/70">
              Kun 0 min bytte mellom økter. OK hvis lokasjonene er nær — bunker er 50 m fra putting green.
            </p>
          </div>
        </div>
      </Field>

      {/* Notat */}
      <Field label="Notat til spiller" hint="Sendes som SMS · valgfritt">
        <textarea
          rows={3}
          defaultValue="Møt opp med wedge og bunker-jern. 5–10 min oppvarming først."
          className="w-full rounded-md border border-white/8 bg-white/[0.025] p-3 text-[13px] text-white outline-none transition focus:border-accent/40 focus:bg-accent/[0.04]"
        />
      </Field>

      {/* Gjenta */}
      <Field label="Gjenta?">
        <RadioRow>
          {REPEATS.map((r) => (
            <RadioOpt key={r} active={r === "Engangs"}>
              {r}
            </RadioOpt>
          ))}
        </RadioRow>
      </Field>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-[18px]">
      {label && (
        <div className="mb-2 flex items-center justify-between text-[12px] font-medium text-white/70">
          <span>
            {label}
            {required && <span className="ml-1" style={{ color: "#D1F843" }}>*</span>}
          </span>
          {hint && (
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/40">
              {hint}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function RadioRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function RadioOpt({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      type="button"
      className={
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] transition " +
        (active
          ? "border-accent/30 bg-accent/10 font-semibold text-accent"
          : "border-white/8 bg-white/[0.025] text-white/85 hover:bg-white/[0.05]")
      }
    >
      {children}
    </button>
  );
}

export { Field };
