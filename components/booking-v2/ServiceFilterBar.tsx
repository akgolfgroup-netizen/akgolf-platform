"use client";

import { useState } from "react";
import { SERVICES, type BookingService } from "./copy";
import { ServiceRow } from "./ServiceRow";

type Filter = "alle" | "abonnement" | "flex" | "bane" | "kurs";
type TrainerFilter = "alle" | "anders" | "markus";

const CATEGORY_FILTERS: { id: Filter; label: string }[] = [
  { id: "alle", label: "Alle" },
  { id: "abonnement", label: "Abonnement" },
  { id: "flex", label: "Flex" },
  { id: "bane", label: "På bane" },
  { id: "kurs", label: "Kurs" },
];

function matches(s: BookingService, cat: Filter, tr: TrainerFilter): boolean {
  if (cat !== "alle" && s.category !== cat) return false;
  if (tr !== "alle" && s.trainer !== tr && s.trainer !== "begge") return false;
  return true;
}

function countFor(cat: Filter): number {
  if (cat === "alle") return SERVICES.length;
  return SERVICES.filter((s) => s.category === cat).length;
}

export function ServiceFilterBar() {
  const [cat, setCat] = useState<Filter>("alle");
  const [tr, setTr] = useState<TrainerFilter>("alle");
  const visible = SERVICES.filter((s) => matches(s, cat, tr));

  return (
    <>
      <div className="filter-bar">
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f.id}
            className="chip"
            aria-pressed={cat === f.id}
            onClick={() => setCat(f.id)}
            type="button"
          >
            {f.label} <span className="count">{countFor(f.id)}</span>
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <button
          className="chip"
          aria-pressed={tr === "anders"}
          onClick={() => setTr(tr === "anders" ? "alle" : "anders")}
          type="button"
        >
          Anders
        </button>
        <button
          className="chip"
          aria-pressed={tr === "markus"}
          onClick={() => setTr(tr === "markus" ? "alle" : "markus")}
          type="button"
        >
          Markus
        </button>
      </div>

      <div className="service-list">
        {visible.map((s, i) => (
          <ServiceRow key={s.id} service={s} index={i} />
        ))}
      </div>
    </>
  );
}
