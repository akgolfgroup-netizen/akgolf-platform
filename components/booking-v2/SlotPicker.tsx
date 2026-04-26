"use client";

import { useState } from "react";

interface Slot {
  time: string;
  taken?: boolean;
}

const MORNING: Slot[] = [
  { time: "07:30" },
  { time: "08:00" },
  { time: "09:00", taken: true },
  { time: "10:30" },
];

const AFTERNOON: Slot[] = [
  { time: "12:30" },
  { time: "13:30", taken: true },
  { time: "14:30" },
  { time: "15:30" },
  { time: "16:30" },
];

const EVENING: Slot[] = [
  { time: "17:30" },
  { time: "18:30" },
  { time: "19:30", taken: true },
  { time: "20:00" },
];

interface SlotGroupProps {
  heading: string;
  slots: Slot[];
  selected: string | null;
  onPick: (time: string) => void;
}

function SlotGroup({ heading, slots, selected, onPick }: SlotGroupProps) {
  return (
    <div className="slot-section">
      <div className="head">{heading}</div>
      <div className="slot-grid">
        {slots.map((s) => (
          <button
            key={s.time}
            type="button"
            className={`slot${s.taken ? " taken" : ""}${selected === s.time ? " selected" : ""}`}
            disabled={s.taken}
            onClick={() => !s.taken && onPick(s.time)}
          >
            {s.time}
          </button>
        ))}
      </div>
    </div>
  );
}

interface SlotPickerProps {
  initialTime?: string;
  onChange?: (time: string) => void;
}

export function SlotPicker({ initialTime = "14:30", onChange }: SlotPickerProps) {
  const [selected, setSelected] = useState<string | null>(initialTime);
  const totalAvailable =
    [MORNING, AFTERNOON, EVENING].flat().filter((s) => !s.taken).length;

  function pick(t: string) {
    setSelected(t);
    onChange?.(t);
  }

  return (
    <div>
      <div className="slots-head">
        <div className="day">
          <em>Tirsdag</em> 28. apr
        </div>
        <div className="meta">{totalAvailable} ledige</div>
      </div>
      <SlotGroup heading="Morgen" slots={MORNING} selected={selected} onPick={pick} />
      <SlotGroup heading="Ettermiddag" slots={AFTERNOON} selected={selected} onPick={pick} />
      <SlotGroup heading="Kveld" slots={EVENING} selected={selected} onPick={pick} />
    </div>
  );
}
