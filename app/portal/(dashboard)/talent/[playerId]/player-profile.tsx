import Link from "next/link";
import {
  ArrowLeft,
  TrendingDown,
  TrendingUp,
  MapPin,
  GraduationCap,
  Award,
  Trophy,
} from "lucide-react";
import type { PlayerProfileData } from "../actions";

function fmt(n: number | null, d = 1): string {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("nb-NO", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

function fmtToPar(n: number | null): string {
  if (n === null) return "—";
  if (n === 0) return "E";
  return n > 0 ? `+${n}` : `${n}`;
}

const AGE_LABEL: Record<string, string> = {
  G19: "Gutter 16-19",
  G15: "Gutter 13-15",
  G12: "Gutter -12",
  J19: "Jenter 16-19",
  J15: "Jenter 13-15",
  J12: "Jenter -12",
  HERR: "Herrer 20+",
  DAME: "Damer 20+",
};

const REGION_LABEL: Record<string, string> = {
  OST: "Øst",
  VEST: "Vest",
  MIDT: "Midt",
  NORD: "Nord",
  SOR: "Sør",
};

const SOURCE_LABEL: Record<string, string> = {
  OLYO: "OLYO",
  SRIXON: "Srixon",
  OSTLANDSTOUR: "Østland",
  NORGESCUP: "Norgescup",
  WAGR: "WAGR",
  COLLEGE_NCAA: "NCAA",
  DATAGOLF: "DataGolf",
};

function ConfidenceMini({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const tone =
    score >= 0.7 ? "bg-[#005840]" : score >= 0.3 ? "bg-[#C48A32]" : "bg-[#B84233]";
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="h-1 w-10 rounded-full bg-[#EDF1EE] overflow-hidden">
        <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-mono text-[#8A958E] tabular-nums">{pct}%</span>
    </div>
  );
}

export function PlayerProfile({ profile }: { profile: PlayerProfileData }) {
  const currentYear = new Date().getFullYear();
  const stats18 = profile.yearlyStats.filter((s) => s.holesSegment === 18);
  const stats9 = profile.yearlyStats.filter((s) => s.holesSegment === 9);
  const latest18 = stats18.find((s) => s.year === currentYear) ?? stats18[0];
  const all = [...stats18, ...stats9].sort(
    (a, b) => b.year - a.year || b.holesSegment - a.holesSegment,
  );

  const age = profile.birthYear ? currentYear - profile.birthYear : null;

  return (
    <div className="space-y-8">
      {/* BREADCRUMB */}
      <Link
        href="/portal/talent"
        className="inline-flex items-center gap-1.5 text-sm text-[#5C6B62] hover:text-[#0A1F18] transition"
      >
        <ArrowLeft className="h-4 w-4" /> Talenter
      </Link>

      {/* HERO */}
      <div className="rounded-3xl bg-white border border-[#E4EAE6] shadow-[0_1px_2px_rgba(15,31,24,0.04),0_4px_12px_rgba(15,31,24,0.04)] overflow-hidden">
        {/* Accent strip */}
        <div className="h-1 bg-gradient-to-r from-[#005840] via-[#005840] to-[#D1F843]" />

        <div className="p-8">
          <div className="flex items-start gap-6">
            {profile.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.photoUrl}
                alt=""
                className="h-28 w-28 rounded-2xl object-cover ring-4 ring-white shadow-md"
              />
            ) : (
              <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-[#E8F0EC] to-[#F4F6F4] flex items-center justify-center text-[#005840] text-2xl font-medium font-display ring-4 ring-white shadow-md">
                {profile.firstName[0]}
                {profile.lastName[0]}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h1 className="font-display text-3xl font-semibold text-[#0A1F18] tracking-tight">
                {profile.firstName} {profile.lastName}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#5C6B62]">
                {age !== null && (
                  <span className="font-mono">{age} år</span>
                )}
                {profile.birthYear && (
                  <span className="text-[#8A958E] font-mono">f. {profile.birthYear}</span>
                )}
                {profile.gender && (
                  <>
                    <span className="text-[#E4EAE6]">•</span>
                    <span>{profile.gender === "MALE" ? "Mann" : "Kvinne"}</span>
                  </>
                )}
                {profile.club && (
                  <>
                    <span className="text-[#E4EAE6]">•</span>
                    <span>{profile.club}</span>
                  </>
                )}
                {profile.region && (
                  <>
                    <span className="text-[#E4EAE6]">•</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {REGION_LABEL[profile.region] ?? profile.region}
                    </span>
                  </>
                )}
              </div>

              {/* Identifiers row */}
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.ngfId && (
                  <IdBadge label="NGF" value={profile.ngfId} />
                )}
                {profile.wagrRank && (
                  <IdBadge
                    label="WAGR"
                    value={`#${profile.wagrRank.toLocaleString("nb-NO")}`}
                    tone="accent"
                  />
                )}
                {profile.collegeId && (
                  <IdBadge
                    label="College"
                    value={profile.collegeId}
                    icon={<GraduationCap className="h-3 w-3" />}
                  />
                )}
                {profile.coach && (
                  <IdBadge label="Coach" value={profile.coach} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CURRENT-SEASON KPIs */}
      {latest18 ? (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-[#0A1F18]">
                Sesong {latest18.year}
              </h2>
              <p className="text-xs text-[#8A958E] font-mono">
                18 hull · {latest18.totalRounds} runder · {latest18.totalResults} turneringer
              </p>
            </div>
            <ConfidenceMini score={latest18.dataConfidenceScore} />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <BigKpi
              label="Snitt brutto"
              value={
                latest18.totalRounds >= 3 ? fmt(latest18.avgRound, 1) : "—"
              }
              hint={
                latest18.totalRounds < 3
                  ? `Trenger ≥ 3 runder`
                  : "snitt over alle runder"
              }
              accent
            />
            <BigKpi
              label="Beste runde"
              value={
                latest18.bestRound !== null ? String(latest18.bestRound) : "—"
              }
              hint={latest18.bestRound !== null ? "lavest score" : undefined}
            />
            <BigKpi
              label="Top 3"
              value={String(latest18.top3Count)}
              hint="podiums"
              icon={<Trophy className="h-4 w-4" />}
            />
            <BigKpi
              label="Top 10"
              value={String(latest18.top10Count)}
              hint="cuts made"
              icon={<Award className="h-4 w-4" />}
            />
            <BigKpi
              label="Forbedring"
              value={
                latest18.improvementPerYear !== null
                  ? (latest18.improvementPerYear > 0 ? "+" : "") +
                    fmt(latest18.improvementPerYear, 1)
                  : "—"
              }
              hint="slag/år"
              tone={
                latest18.improvementPerYear !== null && latest18.improvementPerYear < 0
                  ? "good"
                  : "neutral"
              }
              icon={
                latest18.improvementPerYear !== null && latest18.improvementPerYear < 0 ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )
              }
            />
          </div>
        </section>
      ) : (
        <div className="rounded-2xl bg-[#F4F6F4] border border-[#EDF1EE] p-6 text-center">
          <p className="text-sm text-[#5C6B62]">
            Ingen 18-hulls statistikk tilgjengelig for denne spilleren ennå
          </p>
        </div>
      )}

      {/* HISTORICAL TREND */}
      {all.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold text-[#0A1F18] mb-4">
            Historisk utvikling
          </h2>
          <div className="rounded-2xl bg-white border border-[#E4EAE6] shadow-[0_1px_2px_rgba(15,31,24,0.04)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-[#8A958E] bg-[#F4F6F4]/50">
                  <th className="px-5 py-3 text-left font-medium">Sesong</th>
                  <th className="px-4 py-3 text-left font-medium">Format</th>
                  <th className="px-4 py-3 text-right font-medium">Runder</th>
                  <th className="px-4 py-3 text-right font-medium">Snitt</th>
                  <th className="px-4 py-3 text-right font-medium">Beste</th>
                  <th className="px-4 py-3 text-right font-medium">T3</th>
                  <th className="px-4 py-3 text-right font-medium">T10</th>
                  <th className="px-4 py-3 text-right font-medium">Forbedring</th>
                  <th className="px-4 py-3 text-left font-medium">Konfidens</th>
                </tr>
              </thead>
              <tbody>
                {all.map((s) => (
                  <tr
                    key={`${s.year}-${s.holesSegment}`}
                    className="border-t border-[#EDF1EE] hover:bg-[#F4F6F4]/40 transition"
                  >
                    <td className="px-5 py-3.5 font-mono font-medium text-[#0A1F18]">
                      {s.year}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#F4F6F4] text-[#5C6B62] border border-[#EDF1EE]">
                        {s.holesSegment} hull
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono tabular-nums text-[#0A1F18]">
                      {s.totalRounds}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono tabular-nums font-semibold text-[#0A1F18]">
                      {s.totalRounds >= 3 ? fmt(s.avgRound, 1) : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono tabular-nums text-[#5C6B62]">
                      {s.bestRound ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono tabular-nums text-[#0A1F18]">
                      {s.top3Count}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono tabular-nums text-[#5C6B62]">
                      {s.top10Count}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono tabular-nums">
                      {s.improvementPerYear !== null && s.improvementPerYear !== undefined ? (
                        <span
                          className={
                            s.improvementPerYear < 0
                              ? "text-[#005840] font-medium"
                              : s.improvementPerYear > 0
                                ? "text-[#B84233]"
                                : "text-[#8A958E]"
                          }
                        >
                          {s.improvementPerYear > 0 ? "+" : ""}
                          {fmt(s.improvementPerYear, 1)}
                        </span>
                      ) : (
                        <span className="text-[#8A958E]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <ConfidenceMini score={s.dataConfidenceScore} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* RECENT RESULTS */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-[#0A1F18]">
            Siste resultater
          </h2>
          <p className="text-xs text-[#8A958E] font-mono">
            {profile.recentResults.length} av {profile.yearlyStats.reduce((s, y) => s + y.totalResults, 0)}
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#E4EAE6] shadow-[0_1px_2px_rgba(15,31,24,0.04)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-[#8A958E] bg-[#F4F6F4]/50">
                <th className="px-5 py-3 text-left font-medium">Dato</th>
                <th className="px-4 py-3 text-left font-medium">Turnering</th>
                <th className="px-4 py-3 text-left font-medium">Klasse</th>
                <th className="px-4 py-3 text-right font-medium">Pos</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
                <th className="px-4 py-3 text-right font-medium">Til par</th>
                <th className="px-4 py-3 text-left font-medium">Kilde</th>
              </tr>
            </thead>
            <tbody>
              {profile.recentResults.map((r) => (
                <tr key={r.id} className="border-t border-[#EDF1EE] hover:bg-[#F4F6F4]/40 transition">
                  <td className="px-5 py-3 font-mono text-[#5C6B62] tabular-nums">
                    {r.tournamentDate.toLocaleDateString("nb-NO", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-[#0A1F18]">
                    <div className="line-clamp-1 max-w-md">{r.tournamentName}</div>
                  </td>
                  <td className="px-4 py-3 text-[#5C6B62]">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#E8F0EC] text-[#005840]">
                      {r.ageGroup}
                    </span>
                    <span className="ml-2 text-[10px] font-mono text-[#8A958E]">
                      {r.holes}h
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-[#0A1F18]">
                    {r.position !== null ? (
                      <>
                        {r.position <= 3 && <Trophy className="inline h-3 w-3 text-[#C48A32] mr-0.5" />}
                        {r.position}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-[#0A1F18]">
                    {r.totalScore ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">
                    <span
                      className={
                        r.toPar !== null && r.toPar < 0
                          ? "text-[#005840] font-medium"
                          : r.toPar !== null && r.toPar > 0
                            ? "text-[#5C6B62]"
                            : "text-[#0A1F18]"
                      }
                    >
                      {fmtToPar(r.toPar)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[10px] font-mono text-[#8A958E]">
                    {SOURCE_LABEL[r.source] ?? r.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function BigKpi({
  label,
  value,
  hint,
  icon,
  tone = "neutral",
  accent = false,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
  tone?: "neutral" | "good";
  accent?: boolean;
}) {
  const valueColor = tone === "good" ? "text-[#005840]" : "text-[#0A1F18]";
  const ring = accent
    ? "ring-1 ring-[#D1F843] shadow-[0_0_0_1px_rgba(209,248,67,0.5),0_8px_24px_rgba(209,248,67,0.18)]"
    : "";
  return (
    <div
      className={`rounded-2xl bg-white border border-[#E4EAE6] p-5 shadow-[0_1px_2px_rgba(15,31,24,0.04)] hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(15,31,24,0.06),0_14px_32px_rgba(15,31,24,0.08)] transition-all ${ring}`}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#8A958E]">
        {icon}
        <span>{label}</span>
      </div>
      <div className={`mt-3 font-display text-3xl font-semibold tabular-nums ${valueColor}`}>
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-[#8A958E] font-mono">{hint}</div>}
    </div>
  );
}

function IdBadge({
  label,
  value,
  tone = "neutral",
  icon,
}: {
  label: string;
  value: string;
  tone?: "neutral" | "accent";
  icon?: React.ReactNode;
}) {
  const cls =
    tone === "accent"
      ? "bg-[#0F1F18] text-white border-[#0F1F18]"
      : "bg-white text-[#0A1F18] border-[#E4EAE6]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs ${cls}`}
    >
      {icon}
      <span className="font-mono uppercase text-[10px] tracking-wider opacity-60">
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </span>
  );
}
