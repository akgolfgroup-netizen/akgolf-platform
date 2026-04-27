"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface Slot {
  time: string;
  iso?: string;
}

interface SlotGroupProps {
  heading: string;
  slots: Slot[];
  selected: string | null;
  onPick: (time: string) => void;
}

function SlotGroup({ heading, slots, selected, onPick }: SlotGroupProps) {
  if (slots.length === 0) return null;
  return (
    <div className="slot-section">
      <div className="head">{heading}</div>
      <div className="slot-grid">
        {slots.map((s) => (
          <button
            key={s.time}
            type="button"
            className={`slot${selected === s.time ? " selected" : ""}`}
            onClick={() => onPick(s.time)}
          >
            {s.time}
          </button>
        ))}
      </div>
    </div>
  );
}

const PLACEHOLDER_SLOTS: { iso: string; time: string }[] = [
  { iso: "T08:00", time: "08:00" },
  { iso: "T08:20", time: "08:20" },
  { iso: "T08:40", time: "08:40" },
  { iso: "T09:00", time: "09:00" },
  { iso: "T13:00", time: "13:00" },
  { iso: "T13:20", time: "13:20" },
  { iso: "T14:00", time: "14:00" },
  { iso: "T14:20", time: "14:20" },
  { iso: "T17:00", time: "17:00" },
  { iso: "T17:20", time: "17:20" },
];

interface SlotPickerProps {
  /** ISO-strings fra getAvailableSlots(). Hvis tom — viser placeholder. */
  slots?: string[];
  /** Valgt tid (HH:mm) fra URL. */
  selectedTime?: string;
  /** Beskrivelse av valgt dag, f.eks. "Tirsdag 28. apr". */
  dayLabel?: string;
}

function groupByPeriod(slots: { iso: string; time: string }[]) {
  const morning: { iso: string; time: string }[] = [];
  const afternoon: { iso: string; time: string }[] = [];
  const evening: { iso: string; time: string }[] = [];
  for (const s of slots) {
    const hour = parseInt(s.time.split(":")[0], 10);
    if (hour < 12) morning.push(s);
    else if (hour < 17) afternoon.push(s);
    else evening.push(s);
  }
  return { morning, afternoon, evening };
}

export function SlotPicker({
  slots,
  selectedTime,
  dayLabel = "Velg dag",
}: SlotPickerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Konverter ISO-strings til { iso, time }.
  // Hvis slots === undefined → vi har ikke ekte data ennå (booking-kontekst mangler) → vis placeholder.
  // Hvis slots === [] → ekte data, men ingen tilgjengelige → vis tom-state (ikke placeholder).
  const normalized: { iso: string; time: string }[] =
    slots === undefined
      ? PLACEHOLDER_SLOTS
      : slots.map((iso) => {
          const d = new Date(iso);
          const hh = String(d.getUTCHours()).padStart(2, "0");
          const mm = String(d.getUTCMinutes()).padStart(2, "0");
          return { iso, time: `${hh}:${mm}` };
        });

  const { morning, afternoon, evening } = groupByPeriod(normalized);
  const total = normalized.length;
  const selected = selectedTime ?? null;

  function pick(t: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("time", t);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  if (total === 0) {
    const [first, ...rest] = dayLabel.split(" ");
    return (
      <div>
        <div className="slots-head">
          <div className="day">
            <em>{first}</em> {rest.join(" ")}
          </div>
          <div className="meta">Ingen ledige</div>
        </div>
        <div className="slots-empty">
          <h4>Alle tider er borte denne dagen.</h4>
          <p>Få varsel når noen avbestiller — eller velg en annen dag.</p>
        </div>
      </div>
    );
  }

  const [first, ...rest] = dayLabel.split(" ");
  return (
    <div>
      <div className="slots-head">
        <div className="day">
          <em>{first}</em> {rest.join(" ")}
        </div>
        <div className="meta">{total} ledige</div>
      </div>
      <SlotGroup heading="Morgen" slots={morning} selected={selected} onPick={pick} />
      <SlotGroup heading="Ettermiddag" slots={afternoon} selected={selected} onPick={pick} />
      <SlotGroup heading="Kveld" slots={evening} selected={selected} onPick={pick} />
    </div>
  );
}
