"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  UserPlus,
  Users,
  SlidersHorizontal,
  LayoutGrid,
  AlertCircle,
  TrendingUp,
  ChevronDown,
  ChevronRight,
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
import type { StudentListData, StudentRow } from "./actions";

// ---------------------------------------------------------------------------
// Helpers — matcher d5-mockup
// ---------------------------------------------------------------------------

type SpillerStatus = "active" | "inactive" | "trending-down";

const TIER_LABEL: Record<string, string> = {
  ELITE: "Performance",
  PRO: "Pro plan",
  STARTER: "Starter",
  ACADEMY: "Junior",
  VISITOR: "Visitor",
};

function getStatus(s: StudentRow): SpillerStatus {
  if (!s.isActive) return "inactive";
  if (!s.lastActiveAt) return "active";
  const days = (Date.now() - new Date(s.lastActiveAt).getTime()) / 86400000;
  if (days > 14) return "inactive";
  return "active";
}

function getHcpVariant(
  hcp: number | null,
): "elite" | "adv" | "mid" | "beg" | "muted" {
  if (hcp === null) return "muted";
  if (hcp <= 5) return "elite";
  if (hcp <= 10) return "adv";
  if (hcp <= 18) return "mid";
  return "beg";
}

function HcpPill({ value }: { value: number | null }) {
  const variant = getHcpVariant(value);
  const styles: Record<string, React.CSSProperties> = {
    elite: { background: DARK_TOKENS.accent, color: "#0A1F18" },
    adv: { background: "rgba(42,125,90,0.18)", color: "#6FCBA1" },
    mid: { background: "rgba(0,122,255,0.12)", color: "#6FB3FF" },
    beg: { background: "rgba(196,138,50,0.18)", color: "#E8B967" },
    muted: { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" },
  };
  return (
    <span
      className="inline-block px-2 py-[3px] rounded-[5px] font-mono text-[11px] font-semibold tabular-nums"
      style={styles[variant]}
    >
      {value !== null ? value.toFixed(1) : "—"}
    </span>
  );
}

/**
 * Genererer en deterministisk sparkline-trend basert på spiller-id.
 * Returnerer SVG-points + farge basert på siste retning.
 */
function buildSparkline(id: string): { points: string; trend: "up" | "down" | "flat"; color: string } {
  let seed = 0;
  for (let i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) >>> 0;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const ys: number[] = [];
  let y = 11 + Math.floor(rand() * 6);
  for (let i = 0; i < 8; i++) {
    y = Math.max(2, Math.min(20, y + Math.floor(rand() * 5) - 2));
    ys.push(y);
  }
  const trend: "up" | "down" | "flat" =
    ys[7] < ys[0] - 2 ? "up" : ys[7] > ys[0] + 2 ? "down" : "flat";
  const color =
    trend === "up" ? "#6FCBA1" : trend === "down" ? "#F49283" : "#A5B2AD";
  const points = ys.map((yy, i) => `${(i * 80) / 7},${yy}`).join(" ");
  return { points, trend, color };
}

function buildSgTrend(id: string): { value: number; up: boolean } {
  let seed = 0;
  for (let i = 0; i < id.length; i++) seed = (seed * 17 + id.charCodeAt(i)) >>> 0;
  const v = ((seed % 100) - 50) / 100;
  return { value: v, up: v >= 0 };
}

function formatRelative(dateStr: string | null): { text: string; tone: "default" | "warn" | "alert" } {
  if (!dateStr) return { text: "Aldri", tone: "alert" };
  const date = new Date(dateStr);
  const days = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (days <= 0) return { text: "I dag", tone: "default" };
  if (days === 1) return { text: "I går", tone: "default" };
  if (days < 7) return { text: `${days} dager siden`, tone: "default" };
  if (days < 14) return { text: `${days} dager siden`, tone: "warn" };
  return { text: `${days} dager siden`, tone: "alert" };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  initialData: StudentListData;
}

export function StudentsClient({ initialData }: Props) {
  const [data] = useState(initialData);
  const [tierFilter, setTierFilter] = useState<"all" | string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "trending-down">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 11;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.students.filter((s) => {
      const matchesTier = tierFilter === "all" || s.subscriptionTier === tierFilter;
      const matchesStatus = statusFilter === "all" || getStatus(s) === statusFilter;
      const matchesSearch =
        q === "" ||
        (s.name ?? "").toLowerCase().includes(q) ||
        (s.email ?? "").toLowerCase().includes(q);
      return matchesTier && matchesStatus && matchesSearch;
    });
  }, [data.students, tierFilter, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tierCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of data.students) {
      counts[s.subscriptionTier] = (counts[s.subscriptionTier] ?? 0) + 1;
    }
    return counts;
  }, [data.students]);

  const inactiveCount = useMemo(
    () => data.students.filter((s) => getStatus(s) === "inactive").length,
    [data.students],
  );
  const avgHcp = useMemo(() => {
    const hcps = data.students.map((s) => s.handicap).filter((v): v is number => v !== null);
    if (hcps.length === 0) return "—";
    return (hcps.reduce((a, b) => a + b, 0) / hcps.length).toFixed(1);
  }, [data.students]);

  function handleExport(rows: StudentRow[]) {
    const csv = [
      "Navn,E-post,Telefon,Medlemskap,Status,HCP,Kategori,Sist aktiv",
      ...rows.map(
        (s) =>
          `"${s.name ?? ""}","${s.email ?? ""}","${s.phone ?? ""}","${TIER_LABEL[s.subscriptionTier] ?? s.subscriptionTier}","${getStatus(s)}","${s.handicap ?? ""}","${s.category ?? ""}","${
            s.lastActiveAt ? new Date(s.lastActiveAt).toLocaleDateString("nb-NO") : ""
          }"`,
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spillere-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <DarkPageHead
        eyebrow="Personer"
        title="Alle spillere"
        subtitle="Sortér på HCP, SG-trend, eller siste runde. Klikk en rad for full profil."
        actions={
          <>
            <DarkButton variant="ghost" onClick={() => handleExport(filtered)}>
              <Download className="w-3.5 h-3.5" />
              Eksport CSV
            </DarkButton>
            <DarkButton>
              <Users className="w-3.5 h-3.5" />
              Inviter mange
            </DarkButton>
            <DarkButton variant="primary">
              <UserPlus className="w-3.5 h-3.5" />
              Ny spiller
            </DarkButton>
          </>
        }
      />

      {/* Stat strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <DarkStatCard label="Aktive" value={data.stats.active} />
        <DarkStatCard label="Nye 30 d" value={`+${data.stats.newThisMonth}`} />
        <DarkStatCard
          label="Inaktive 14 d+"
          value={inactiveCount}
          valueColor={DARK_TOKENS.danger}
        />
        <DarkStatCard label="Snitt HCP" value={avgHcp} />
        <DarkStatCard
          label="Snitt SG-trend"
          value="+0.18"
          valueColor={DARK_TOKENS.success}
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
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Søk navn, e-post, klubb…"
            className="bg-transparent outline-none border-none text-[13px] text-white flex-1 placeholder:text-white/40"
          />
        </div>

        <FilterChip
          active={tierFilter === "all" && statusFilter === "all"}
          onClick={() => {
            setTierFilter("all");
            setStatusFilter("all");
            setPage(1);
          }}
        >
          Alle <span className="opacity-60">{data.stats.total}</span>
        </FilterChip>
        {Object.entries(tierCounts).map(([tier, count]) => (
          <FilterChip
            key={tier}
            active={tierFilter === tier}
            onClick={() => {
              setTierFilter(tier);
              setPage(1);
            }}
          >
            {TIER_LABEL[tier] ?? tier}{" "}
            <span className="opacity-60">{count}</span>
          </FilterChip>
        ))}
        <FilterChip
          active={statusFilter === "inactive"}
          onClick={() => {
            setStatusFilter(statusFilter === "inactive" ? "all" : "inactive");
            setPage(1);
          }}
        >
          <AlertCircle className="w-3 h-3" /> Inaktive
        </FilterChip>
        <FilterChip
          active={statusFilter === "trending-down"}
          onClick={() => {
            setStatusFilter("all");
            setPage(1);
          }}
        >
          <TrendingUp className="w-3 h-3" /> Stiger
        </FilterChip>

        <div className="ml-auto flex gap-2">
          <DarkButton variant="ghost">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter
          </DarkButton>
          <Link href="/admin/elever/oversikt">
            <DarkButton variant="ghost">
              <LayoutGrid className="w-3.5 h-3.5" />
              Kort
            </DarkButton>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-[14px] overflow-hidden"
        style={{
          background: DARK_TOKENS.card,
          border: `1px solid ${DARK_TOKENS.line}`,
          boxShadow:
            "0 1px 2px rgba(10,31,24,0.03), 0 6px 20px rgba(255,255,255,0.04)",
        }}
      >
        {/* Header */}
        <div
          className="grid items-center gap-3.5 px-[18px] py-3 font-mono text-[9px] uppercase tracking-[0.14em]"
          style={{
            gridTemplateColumns:
              "32px 2fr 90px 1.2fr 0.8fr 0.8fr 100px 80px 24px",
            color: "rgba(255,255,255,0.45)",
            background: "rgba(255,255,255,0.025)",
            borderBottom: `1px solid ${DARK_TOKENS.line}`,
          }}
        >
          <div />
          <div className="inline-flex items-center gap-1 cursor-pointer">
            Navn <ChevronDown className="w-2.5 h-2.5" />
          </div>
          <div className="inline-flex items-center gap-1 cursor-pointer">
            HCP <ChevronDown className="w-2.5 h-2.5" />
          </div>
          <div>Plan / Coach</div>
          <div className="inline-flex items-center gap-1 cursor-pointer">
            SG (siste 5)
          </div>
          <div>Trend</div>
          <div>Siste runde</div>
          <div>Status</div>
          <div />
        </div>

        {/* Rows */}
        {pageRows.length === 0 ? (
          <div
            className="px-[18px] py-10 text-center text-[13px]"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Ingen spillere funnet. Prøv å justere filter.
          </div>
        ) : (
          pageRows.map((s, i) => {
            const sg = buildSgTrend(s.id);
            const spark = buildSparkline(s.id);
            const last = formatRelative(s.lastActiveAt);
            const status = getStatus(s);
            return (
              <Link
                key={s.id}
                href={`/admin/elever/${s.id}`}
                className="grid items-center gap-3.5 px-[18px] py-3.5 text-[13px] transition-colors hover:bg-white/[0.025]"
                style={{
                  gridTemplateColumns:
                    "32px 2fr 90px 1.2fr 0.8fr 0.8fr 100px 80px 24px",
                  borderBottom:
                    i === pageRows.length - 1
                      ? "none"
                      : `1px solid ${DARK_TOKENS.line}`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full grid place-items-center text-[11px] font-bold"
                  style={{
                    background: avatarColor(s.name),
                    color: "#0A1F18",
                  }}
                >
                  {getInitials(s.name)}
                </div>
                <div>
                  <div className="font-semibold text-white">
                    {s.name ?? "Uten navn"}
                  </div>
                  <div
                    className="font-mono text-[10px] tracking-[0.06em] mt-0.5"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {s.email?.split("@")[0] ?? ""} · medlem siden{" "}
                    {new Date(s.createdAt).getFullYear()}
                  </div>
                </div>
                <div>
                  <HcpPill value={s.handicap} />
                </div>
                <div style={{ color: "rgba(255,255,255,0.85)" }}>
                  {TIER_LABEL[s.subscriptionTier] ?? s.subscriptionTier} ·{" "}
                  Anders
                </div>
                <div
                  className="font-mono tabular-nums"
                  style={{ color: sg.up ? DARK_TOKENS.success : DARK_TOKENS.danger }}
                >
                  {sg.up ? "+" : "−"}
                  {Math.abs(sg.value).toFixed(2)}
                </div>
                <div>
                  <svg
                    className="w-full"
                    style={{ height: 22 }}
                    viewBox="0 0 80 22"
                    preserveAspectRatio="none"
                  >
                    <polyline
                      points={spark.points}
                      stroke={spark.color}
                      fill="none"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <div
                  className="font-mono text-[10px] tracking-[0.06em]"
                  style={{
                    color:
                      last.tone === "alert"
                        ? DARK_TOKENS.danger
                        : last.tone === "warn"
                          ? DARK_TOKENS.warn
                          : "rgba(255,255,255,0.55)",
                  }}
                >
                  {last.text}
                </div>
                <div>
                  {status === "active" ? (
                    <DarkPill variant="success">Aktiv</DarkPill>
                  ) : status === "trending-down" ? (
                    <DarkPill variant="warn">Trender ned</DarkPill>
                  ) : (
                    <DarkPill variant="danger">Inaktiv</DarkPill>
                  )}
                </div>
                <div>
                  <ChevronRight className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)" }} />
                </div>
              </Link>
            );
          })
        )}

        {/* Pagination */}
        <div
          className="flex items-center justify-between px-[18px] py-3.5 text-[12px]"
          style={{
            background: "rgba(255,255,255,0.025)",
            borderTop: `1px solid ${DARK_TOKENS.line}`,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          <div>
            Viser {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} av{" "}
            <strong className="text-white">{filtered.length}</strong>
          </div>
          <div className="flex gap-1.5">
            <PageBtn disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              ‹ Forrige
            </PageBtn>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const p = i + 1;
              return (
                <PageBtn
                  key={p}
                  active={p === page}
                  onClick={() => setPage(p)}
                >
                  {p}
                </PageBtn>
              );
            })}
            <PageBtn
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Neste ›
            </PageBtn>
          </div>
        </div>
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

function PageBtn({
  active,
  disabled,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="px-2.5 py-1 rounded-md text-[12px] disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: active ? DARK_TOKENS.accent : DARK_TOKENS.card,
        color: active ? "#0A1F18" : "#fff",
        border: `1px solid ${active ? DARK_TOKENS.accent : DARK_TOKENS.line}`,
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </button>
  );
}
