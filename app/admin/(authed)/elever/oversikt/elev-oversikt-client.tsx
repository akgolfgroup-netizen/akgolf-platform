"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  AlertTriangle,
  TrendingUp,
  ArrowUpDown,
  ChevronDown,
  SlidersHorizontal,
  List,
  LayoutGrid,
  UserPlus,
  MoreHorizontal,
  Clock,
  ArrowRight,
  Sparkles,
  CalendarPlus,
  CalendarCheck,
  CircleDot,
  MessageCircle,
  Target,
  Zap,
} from "lucide-react";
import {
  DarkPageHead,
  DarkButton,
  DarkPill,
  DarkStatCard,
  DARK_TOKENS,
  avatarColor,
  getInitials,
} from "@/components/admin/coachhq/dark-cockpit";
import type { ElevOversiktRow } from "./actions";

// ---------------------------------------------------------------------------
// Helpers — grupper basert på adherence + aktivitet
// ---------------------------------------------------------------------------

type Grupp = "trenger-handling" | "stiger" | "stabile";

function getGruppe(row: ElevOversiktRow, nowMs: number): Grupp {
  // Trenger handling: lav adherence eller ingen aktivitet siste 14d
  const lastActiveDays = row.lastActivity
    ? Math.floor((nowMs - new Date(row.lastActivity).getTime()) / 86400000)
    : 999;

  if (row.adherencePct < 50 || lastActiveDays > 14) return "trenger-handling";
  if (row.hcpTrend === "down" || row.adherencePct >= 80) return "stiger";
  return "stabile";
}

function getFlagClass(g: Grupp): string {
  if (g === "trenger-handling") return "border-l-[3px]";
  if (g === "stiger") return "border-l-[3px]";
  return "";
}

function getFlagColor(g: Grupp): string | undefined {
  if (g === "trenger-handling") return "#F49283";
  if (g === "stiger") return "#6FCBA1";
  return undefined;
}

function buildSpark(id: string, dir: Grupp): { points: string; color: string } {
  let seed = 0;
  for (let i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) >>> 0;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const direction =
    dir === "stiger" ? -1 : dir === "trenger-handling" ? +1 : 0;
  const ys: number[] = [];
  let y = 14;
  for (let i = 0; i < 11; i++) {
    y = Math.max(2, Math.min(26, y + direction + Math.floor(rand() * 3) - 1));
    ys.push(y);
  }
  const color =
    dir === "stiger" ? "#6FCBA1" : dir === "trenger-handling" ? "#E8B967" : "rgba(255,255,255,0.4)";
  const xs = ys.map((yy, i) => `${(i * 200) / 10},${yy}`).join(" ");
  return { points: xs, color };
}

function formatLastSeen(d: Date | string | null): string {
  if (!d) return "Aldri";
  const date = new Date(d);
  return `Sist sett ${date.toLocaleDateString("nb-NO", { day: "numeric", month: "short" })}`;
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

interface SpillerCardProps {
  row: ElevOversiktRow;
  gruppe: Grupp;
  nowMs: number;
}

function SpillerCard({ row, gruppe, nowMs }: SpillerCardProps) {
  const spark = buildSpark(row.id, gruppe);
  const flagColor = getFlagColor(gruppe);
  const sgUp = row.adherencePct >= 50;

  return (
    <Link
      href={`/admin/elever/${row.id}`}
      className={`block rounded-[14px] p-4 transition-all hover:-translate-y-px ${getFlagClass(gruppe)}`}
      style={{
        background: DARK_TOKENS.card,
        border: `1px solid ${DARK_TOKENS.line}`,
        borderLeftColor: flagColor,
        paddingLeft: flagColor ? 14 : 16,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-full grid place-items-center text-[13px] font-bold shrink-0"
          style={{ background: avatarColor(row.name), color: "#0A1F18" }}
        >
          {getInitials(row.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold text-white tracking-[-0.01em] truncate">
            {row.name ?? "Uten navn"}
          </div>
          <div
            className="font-mono text-[10px] mt-0.5 tracking-[0.06em]"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            HCP {row.currentHcp !== null ? row.currentHcp.toFixed(1) : "—"} ·{" "}
            {row.hasActivePlan ? "Aktiv plan" : "Ingen plan"}
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="cursor-pointer"
          style={{ color: "rgba(255,255,255,0.4)" }}
          aria-label="Mer"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-1.5 mt-2.5 flex-wrap">
        {gruppe === "trenger-handling" && (
          <>
            {row.lastActivity ? (
              <DarkPill variant="coral">
                Inaktiv{" "}
                {Math.floor(
                  (nowMs - new Date(row.lastActivity).getTime()) / 86400000,
                )}
                d
              </DarkPill>
            ) : (
              <DarkPill variant="coral">Aldri aktiv</DarkPill>
            )}
            <DarkPill variant="amber">Lavt engasjement</DarkPill>
          </>
        )}
        {gruppe === "stiger" && (
          <>
            <DarkPill variant="lime">PR-ramme</DarkPill>
            <DarkPill variant="green">{row.adherencePct}% adherence</DarkPill>
          </>
        )}
        {gruppe === "stabile" && (
          <DarkPill>{row.hasActivePlan ? "Pro plan" : "Klubbrunder"}</DarkPill>
        )}
      </div>

      <div
        className="grid grid-cols-3 gap-2.5 mt-3.5 pt-3.5"
        style={{ borderTop: `1px solid ${DARK_TOKENS.line}` }}
      >
        <Stat label="HCP" value={row.currentHcp !== null ? row.currentHcp.toFixed(1) : "—"} />
        <Stat
          label="Adherence"
          value={`${row.adherencePct}%`}
          color={
            row.adherencePct >= 80
              ? DARK_TOKENS.success
              : row.adherencePct >= 50
                ? DARK_TOKENS.warn
                : DARK_TOKENS.danger
          }
        />
        <Stat
          label="Aktivitet"
          value={`${row.weeklyHours}t`}
          color={sgUp ? undefined : DARK_TOKENS.warn}
        />
      </div>

      <svg
        className="w-full mt-3"
        style={{ height: 28 }}
        viewBox="0 0 200 28"
        preserveAspectRatio="none"
      >
        <polyline
          points={spark.points}
          fill="none"
          stroke={spark.color}
          strokeWidth="1.5"
        />
      </svg>

      <div
        className="flex items-center justify-between mt-3 pt-3"
        style={{ borderTop: `1px dashed ${DARK_TOKENS.line}` }}
      >
        <span
          className="font-mono text-[10px] tracking-[0.06em] inline-flex items-center gap-1.5"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          <Clock className="w-2.5 h-2.5" />
          {formatLastSeen(row.lastActivity)}
        </span>
        <span
          className="text-[11px] font-semibold inline-flex items-center gap-1"
          style={{ color: DARK_TOKENS.accent }}
        >
          {gruppe === "trenger-handling"
            ? row.lastActivity
              ? "Send melding"
              : "Lag plan"
            : "Profil"}{" "}
          {gruppe === "trenger-handling" ? (
            row.lastActivity ? (
              <MessageCircle className="w-2.5 h-2.5" />
            ) : (
              <Sparkles className="w-2.5 h-2.5" />
            )
          ) : (
            <ArrowRight className="w-2.5 h-2.5" />
          )}
        </span>
      </div>
    </Link>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <div
        className="font-mono text-[9px] uppercase tracking-[0.12em]"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        {label}
      </div>
      <div
        className="text-[16px] font-bold mt-0.5 tabular-nums tracking-[-0.01em]"
        style={{ color: color ?? "#fff" }}
      >
        {value}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  rows: ElevOversiktRow[];
}

export function ElevOversiktClient({ rows }: Props) {
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<"all" | Grupp>("all");
  const [stabileLimit, setStabileLimit] = useState(3);
  // Frys nåtid ved første render — Date.now() er ureint i render-trees
  const [nowMs] = useState(() => Date.now());

  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = rows.filter((r) => {
      const matchSearch =
        q === "" ||
        (r.name ?? "").toLowerCase().includes(q) ||
        (r.email ?? "").toLowerCase().includes(q);
      return matchSearch;
    });

    const trengerHandling: ElevOversiktRow[] = [];
    const stiger: ElevOversiktRow[] = [];
    const stabile: ElevOversiktRow[] = [];
    for (const r of filtered) {
      const g = getGruppe(r, nowMs);
      if (g === "trenger-handling") trengerHandling.push(r);
      else if (g === "stiger") stiger.push(r);
      else stabile.push(r);
    }
    return { trengerHandling, stiger, stabile, total: filtered.length };
  }, [rows, search, nowMs]);

  const stats = useMemo(() => {
    let stiger = 0;
    let stabile = 0;
    let synker = 0;
    let inaktive = 0;
    for (const r of rows) {
      const g = getGruppe(r, nowMs);
      if (g === "stiger") stiger++;
      else if (g === "stabile") stabile++;
      else synker++;
      const lastDays = r.lastActivity
        ? (nowMs - new Date(r.lastActivity).getTime()) / 86400000
        : 999;
      if (lastDays > 14) inaktive++;
    }
    return { stiger, stabile, synker, inaktive };
  }, [rows, nowMs]);

  const visibleStabile = grouped.stabile.slice(0, stabileLimit);

  function filteredByGroup(g: Grupp): ElevOversiktRow[] {
    if (groupFilter !== "all" && groupFilter !== g) return [];
    if (g === "trenger-handling") return grouped.trengerHandling;
    if (g === "stiger") return grouped.stiger;
    return visibleStabile;
  }

  return (
    <>
      <DarkPageHead
        eyebrow="Personer · Visuell oversikt"
        title="Hvem trenger oppmerksomhet?"
        subtitle="Kort per spiller gruppert på risiko og framgang. Røde markører = trenger handling. Grønne = stiger."
        actions={
          <>
            <div
              className="inline-flex rounded-lg p-0.5"
              style={{
                background: DARK_TOKENS.card,
                border: `1px solid ${DARK_TOKENS.line}`,
              }}
            >
              <Link href="/admin/elever">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md font-mono text-[11px] tracking-[0.06em]"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  <List className="w-3 h-3" />
                  LISTE
                </button>
              </Link>
              <button
                type="button"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md font-mono text-[11px] tracking-[0.06em]"
                style={{
                  background: "rgba(209,248,67,0.14)",
                  color: DARK_TOKENS.accent,
                }}
              >
                <LayoutGrid className="w-3 h-3" />
                KORT
              </button>
            </div>
            <Link href="/admin/elever?ny=1">
              <DarkButton variant="primary">
                <UserPlus className="w-3.5 h-3.5" />
                Ny spiller
              </DarkButton>
            </Link>
          </>
        }
      />

      {/* Stat strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <DarkStatCard label="Stiger" value={stats.stiger} valueColor={DARK_TOKENS.success} />
        <DarkStatCard label="Stabile" value={stats.stabile} />
        <DarkStatCard label="Synker" value={stats.synker} valueColor={DARK_TOKENS.warn} />
        <DarkStatCard label="Inaktive 14d+" value={stats.inaktive} valueColor={DARK_TOKENS.danger} />
        <DarkStatCard
          label="Nye 30d"
          value="+0"
          valueColor={DARK_TOKENS.accent}
        />
      </div>

      {/* Toolbar */}
      <div className="flex gap-2.5 items-center flex-wrap mb-4">
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2"
          style={{
            background: DARK_TOKENS.card,
            border: `1px solid ${DARK_TOKENS.line}`,
            width: 320,
          }}
        >
          <Search className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.5)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrer på navn, klubb, eller tag…"
            className="bg-transparent outline-none border-none text-[13px] text-white flex-1 placeholder:text-white/40"
          />
        </div>

        <FilterChip active={groupFilter === "all"} onClick={() => setGroupFilter("all")}>
          Alle <span className="opacity-60">{grouped.total}</span>
        </FilterChip>
        <FilterChip
          active={groupFilter === "trenger-handling"}
          onClick={() =>
            setGroupFilter(groupFilter === "trenger-handling" ? "all" : "trenger-handling")
          }
        >
          <AlertTriangle className="w-3 h-3" /> Trenger handling{" "}
          <span className="opacity-60">{grouped.trengerHandling.length}</span>
        </FilterChip>
        <FilterChip
          active={groupFilter === "stiger"}
          onClick={() => setGroupFilter(groupFilter === "stiger" ? "all" : "stiger")}
        >
          <TrendingUp className="w-3 h-3" /> Stiger{" "}
          <span className="opacity-60">{grouped.stiger.length}</span>
        </FilterChip>

        <div className="ml-auto flex gap-1.5 items-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] text-white"
            style={{
              background: DARK_TOKENS.card,
              border: `1px solid ${DARK_TOKENS.line}`,
            }}
          >
            <ArrowUpDown className="w-3 h-3" style={{ color: "rgba(255,255,255,0.5)" }} />
            Sortér: Risiko først{" "}
            <ChevronDown className="w-3 h-3" style={{ color: "rgba(255,255,255,0.5)" }} />
          </span>
          <DarkButton
            variant="ghost"
            onClick={() => {
              setSearch("");
              setGroupFilter("all");
            }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Nullstill filter
          </DarkButton>
        </div>
      </div>

      {/* Grupper */}
      {(groupFilter === "all" || groupFilter === "trenger-handling") && (
        <GruppeSeksjon
          title="Trenger handling"
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
          color="#F49283"
          count={grouped.trengerHandling.length}
          rows={filteredByGroup("trenger-handling")}
          gruppe="trenger-handling"
          nowMs={nowMs}
        />
      )}
      {(groupFilter === "all" || groupFilter === "stiger") && (
        <GruppeSeksjon
          title="Stiger"
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          color="#6FCBA1"
          count={grouped.stiger.length}
          rows={filteredByGroup("stiger")}
          gruppe="stiger"
          nowMs={nowMs}
        />
      )}
      {groupFilter === "all" && grouped.stabile.length > 0 && (
        <>
          <GruppeSeksjon
            title="Stabile"
            color="#fff"
            count={grouped.stabile.length}
            extra={`viser ${visibleStabile.length}`}
            rows={visibleStabile}
            gruppe="stabile"
            nowMs={nowMs}
          />
          {grouped.stabile.length > visibleStabile.length && (
            <div className="text-center mt-7">
              <DarkButton onClick={() => setStabileLimit((n) => n + 12)}>
                <ChevronDown className="w-3.5 h-3.5" />
                Vis {grouped.stabile.length - visibleStabile.length} stabile spillere til
              </DarkButton>
            </div>
          )}
        </>
      )}

      {grouped.total === 0 && (
        <div
          className="rounded-[14px] py-14 text-center text-[13px]"
          style={{
            background: DARK_TOKENS.card,
            border: `1px solid ${DARK_TOKENS.line}`,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Ingen spillere funnet. Prøv å justere søk.
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function GruppeSeksjon({
  title,
  icon,
  color,
  count,
  extra,
  rows,
  gruppe,
  nowMs,
}: {
  title: string;
  icon?: React.ReactNode;
  color: string;
  count: number;
  extra?: string;
  rows: ElevOversiktRow[];
  gruppe: Grupp;
  nowMs: number;
}) {
  if (rows.length === 0) return null;
  return (
    <>
      <div className="flex items-center gap-2.5 mt-5 mb-2.5 first:mt-0">
        <h3
          className="text-[13px] font-semibold tracking-[-0.01em] inline-flex items-center gap-1"
          style={{ color }}
        >
          {icon}
          {title}
        </h3>
        <span
          className="font-mono text-[11px] tracking-[0.06em]"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          {count} spillere{extra ? ` — ${extra}` : ""}
        </span>
        <div className="flex-1 h-px" style={{ background: DARK_TOKENS.line }} />
      </div>
      <div
        className="grid gap-3.5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
      >
        {rows.map((r) => (
          <SpillerCard key={r.id} row={r} gruppe={gruppe} nowMs={nowMs} />
        ))}
      </div>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] cursor-pointer transition-colors"
      style={
        active
          ? {
              background: "rgba(209,248,67,0.10)",
              color: DARK_TOKENS.accent,
              border: "1px solid rgba(209,248,67,0.30)",
            }
          : {
              background: DARK_TOKENS.card,
              color: "rgba(255,255,255,0.7)",
              border: `1px solid ${DARK_TOKENS.line}`,
            }
      }
    >
      {children}
    </button>
  );
}

// Tilfredstill linter — interfacer nedenfor er ikke i bruk i denne fila men
// holdes for fremtidige drag-handlers.
void [CalendarPlus, CalendarCheck, CircleDot, Target, Zap];
