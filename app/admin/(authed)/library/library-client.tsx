"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Search,
  Check,
  X,
  Clock,
  Archive,
  Filter,
} from "lucide-react";
import {
  ITEM_TYPE_LABELS,
  STATUS_LABELS,
} from "@/lib/portal/library/types";
import type {
  LibraryItem,
  LibraryItemStatus,
  LibraryItemType,
} from "@prisma/client";
import { TRENINGSOMRADER } from "@/lib/portal/training/ak-taxonomy";
import { GeneratorPanel } from "./generator-panel";

interface Props {
  items: LibraryItem[];
  counts: Record<LibraryItemStatus, number>;
  filter: {
    status: LibraryItemStatus;
    type?: LibraryItemType;
    area?: string;
    search?: string;
  };
  canApprove: boolean;
  canGenerate: boolean;
}

const STATUS_TABS: Array<{ value: LibraryItemStatus; icon: React.ElementType }> = [
  { value: "DRAFT", icon: Clock },
  { value: "APPROVED", icon: Check },
  { value: "REJECTED", icon: X },
  { value: "ARCHIVED", icon: Archive },
];

export function LibraryClient({
  items,
  counts,
  filter,
  canApprove,
  canGenerate,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showGenerator, setShowGenerator] = useState(false);
  const [search, setSearch] = useState(filter.search ?? "");

  const navigate = (params: Record<string, string | undefined>) => {
    const url = new URLSearchParams();
    if (params.status) url.set("status", params.status);
    if (params.type) url.set("type", params.type);
    if (params.area) url.set("area", params.area);
    if (params.q) url.set("q", params.q);
    startTransition(() => {
      router.push(`/admin/library?${url.toString()}`);
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Brand V2 page header — d26 mockup */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-primary">
            / TRENING · LIBRARY
          </div>
          <h1 className="mt-2 font-inter-tight text-[28px] font-bold leading-tight tracking-tight text-ink">
            Innholdsbibliotek.
          </h1>
          <p className="mt-1.5 max-w-2xl text-[13px] text-ink-muted">
            Generer, gjennomgå og godkjenn øvelser, drills, tester og
            aktiviteter.
          </p>
        </div>
        {canGenerate ? (
          <button
            onClick={() => setShowGenerator(s => !s)}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-primary-hover)]"
          >
            <Sparkles className="h-4 w-4" />
            {showGenerator ? "Skjul generator" : "Lag nye"}
          </button>
        ) : null}
      </header>

      {showGenerator && canGenerate ? (
        <GeneratorPanel
          onDone={() => {
            setShowGenerator(false);
            router.refresh();
          }}
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-line)] pb-3">
        {STATUS_TABS.map(tab => {
          const Icon = tab.icon;
          const active = filter.status === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() =>
                navigate({
                  status: tab.value,
                  type: filter.type,
                  area: filter.area,
                  q: filter.search,
                })
              }
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-soft)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {STATUS_LABELS[tab.value]}
              <span
                className={`ml-1 rounded-md px-1.5 py-0.5 text-xs ${
                  active
                    ? "bg-white/20 text-white"
                    : "bg-[var(--color-surface-soft)] text-[var(--color-ink-subtle)]"
                }`}
              >
                {counts[tab.value]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-subtle)]" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                navigate({
                  status: filter.status,
                  type: filter.type,
                  area: filter.area,
                  q: search,
                });
              }
            }}
            placeholder="Søk i tittel, sammendrag, tagger…"
            className="w-full rounded-lg border border-[var(--color-line)] bg-white py-2 pl-10 pr-3 text-sm focus:border-[var(--color-primary)] focus:outline-none"
          />
        </div>
        <select
          value={filter.type ?? ""}
          onChange={e =>
            navigate({
              status: filter.status,
              type: e.target.value || undefined,
              area: filter.area,
              q: filter.search,
            })
          }
          className="rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 text-sm"
        >
          <option value="">Alle typer</option>
          {(Object.keys(ITEM_TYPE_LABELS) as LibraryItemType[]).map(t => (
            <option key={t} value={t}>
              {ITEM_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <select
          value={filter.area ?? ""}
          onChange={e =>
            navigate({
              status: filter.status,
              type: filter.type,
              area: e.target.value || undefined,
              q: filter.search,
            })
          }
          className="rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 text-sm"
        >
          <option value="">Alle områder</option>
          {TRENINGSOMRADER.map(a => (
            <option key={a.code} value={a.code}>
              {a.label}
            </option>
          ))}
        </select>
        <Filter className="h-4 w-4 text-[var(--color-ink-subtle)]" />
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-line)] bg-[var(--color-surface-soft)] p-12 text-center">
          <p className="text-sm text-[var(--color-ink-muted)]">
            Ingen elementer matcher filteret.{" "}
            {canGenerate
              ? "Lag noen nye for å fylle biblioteket."
              : "Kontakt en administrator for å generere innhold."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map(item => (
            <Link
              key={item.id}
              href={`/admin/library/${item.id}`}
              className="group block rounded-xl border border-[var(--color-line)] bg-white p-4 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-md bg-[var(--color-primary-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                  {ITEM_TYPE_LABELS[item.type]}
                </span>
                <span className="font-mono text-xs text-[var(--color-ink-subtle)]">
                  {item.area}
                </span>
              </div>
              <h3 className="mt-2 font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-primary)]">
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--color-ink-muted)]">
                {item.summary}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-[var(--color-ink-subtle)]">
                <span>Steg {item.difficulty}/5</span>
                <span>·</span>
                <span>
                  {item.minDurationMinutes}–{item.maxDurationMinutes} min
                </span>
                {item.playerLevels.length > 0 ? (
                  <>
                    <span>·</span>
                    <span>{item.playerLevels.join(", ")}</span>
                  </>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}

      {isPending ? (
        <div className="text-xs text-[var(--color-ink-subtle)]">Laster…</div>
      ) : null}
      {!canApprove && filter.status === "DRAFT" ? (
        <p className="text-xs text-[var(--color-ink-subtle)]">
          Du kan se og foreslå endringer, men en med godkjenningsrettigheter må
          publisere før innhold blir tilgjengelig i treningsplanleggeren.
        </p>
      ) : null}
    </div>
  );
}
