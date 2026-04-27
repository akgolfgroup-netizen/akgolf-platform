import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, ExternalLink } from "lucide-react";
import type { PlayerProfileData } from "../actions";

function fmt(n: number | null, d = 1): string {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("nb-NO", { minimumFractionDigits: d, maximumFractionDigits: d });
}

function fmtToPar(n: number | null): string {
  if (n === null) return "—";
  if (n === 0) return "E";
  return n > 0 ? `+${n}` : `${n}`;
}

function ConfidenceBadge({ score }: { score: number }) {
  const variant =
    score >= 0.7
      ? "bg-success-light text-success-text"
      : score >= 0.3
        ? "bg-warning-light text-warning-text"
        : "bg-error-light text-error-text";
  const label = score >= 0.7 ? "Høy" : score >= 0.3 ? "Middels" : "Lav";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variant}`}>
      {label} ({Math.round(score * 100)}%)
    </span>
  );
}

export function PlayerProfile({ profile }: { profile: PlayerProfileData }) {
  const currentYear = new Date().getFullYear();
  const stats18 = profile.yearlyStats.filter((s) => s.holesSegment === 18);
  const stats9 = profile.yearlyStats.filter((s) => s.holesSegment === 9);
  const latest18 = stats18.find((s) => s.year === currentYear) ?? stats18[0];

  return (
    <div className="space-y-6">
      <Link
        href="/portal/talent"
        className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Tilbake til Talent
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-line bg-card p-6 shadow-card">
        <div className="flex items-start gap-6">
          {profile.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.photoUrl}
              alt=""
              className="h-24 w-24 rounded-2xl object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-2xl bg-surface-soft flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-ink-subtle" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-ink">
              {profile.firstName} {profile.lastName}
            </h1>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
              {profile.birthYear && <span>f. {profile.birthYear}</span>}
              {profile.gender && (
                <span>{profile.gender === "MALE" ? "Mann" : "Kvinne"}</span>
              )}
              {profile.club && <span>{profile.club}</span>}
              {profile.region && <span>Region {profile.region}</span>}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-muted">
              {profile.ngfId && <span>NGF: {profile.ngfId}</span>}
              {profile.wagrRank && (
                <span className="font-mono">WAGR: #{profile.wagrRank}</span>
              )}
              {profile.collegeId && (
                <span>
                  College: {profile.collegeId}
                </span>
              )}
              {profile.coach && <span>Coach: {profile.coach}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Hovedstats - inneværende sesong */}
      {latest18 ? (
        <section>
          <h2 className="text-sm font-semibold text-ink-muted uppercase mb-3">
            {latest18.year} — 18 hull
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <KpiCard
              label="Snitt brutto"
              value={
                latest18.totalRounds >= 3
                  ? fmt(latest18.avgRound, 1)
                  : "—"
              }
              hint={
                latest18.totalRounds < 3
                  ? `Kun ${latest18.totalRounds} runder`
                  : `${latest18.totalRounds} runder`
              }
            />
            <KpiCard
              label="Beste runde"
              value={latest18.bestRound !== null ? String(latest18.bestRound) : "—"}
            />
            <KpiCard label="Top 3" value={String(latest18.top3Count)} />
            <KpiCard label="Top 10" value={String(latest18.top10Count)} />
            <KpiCard
              label="Konfidens"
              value={`${Math.round(latest18.dataConfidenceScore * 100)}%`}
              hint={
                latest18.dataConfidenceScore < 0.3
                  ? "Lav datakvalitet"
                  : latest18.dataConfidenceScore < 0.7
                    ? "OK"
                    : "Høy datakvalitet"
              }
            />
          </div>
        </section>
      ) : (
        <div className="rounded-xl bg-surface-soft p-4 text-sm text-ink-muted">
          Ingen 18-hulls-statistikk tilgjengelig
        </div>
      )}

      {/* Trend per ar */}
      {stats18.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-ink-muted uppercase mb-3">
            Trend per sesong
          </h2>
          <div className="rounded-2xl border border-line bg-card p-4 shadow-card">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-ink-muted">
                <tr>
                  <th className="px-2 py-2 text-left">År</th>
                  <th className="px-2 py-2 text-left">Hull</th>
                  <th className="px-2 py-2 text-right">Runder</th>
                  <th className="px-2 py-2 text-right">Snitt</th>
                  <th className="px-2 py-2 text-right">Beste</th>
                  <th className="px-2 py-2 text-right">T3</th>
                  <th className="px-2 py-2 text-right">T10</th>
                  <th className="px-2 py-2 text-right">Forbedring</th>
                  <th className="px-2 py-2 text-right">Konfidens</th>
                </tr>
              </thead>
              <tbody>
                {[...stats18, ...stats9]
                  .sort((a, b) => b.year - a.year || b.holesSegment - a.holesSegment)
                  .map((s) => (
                    <tr key={`${s.year}-${s.holesSegment}`} className="border-t border-line-soft">
                      <td className="px-2 py-2 font-mono">{s.year}</td>
                      <td className="px-2 py-2 text-ink-muted">{s.holesSegment} hull</td>
                      <td className="px-2 py-2 text-right font-mono">{s.totalRounds}</td>
                      <td className="px-2 py-2 text-right font-mono font-medium">
                        {s.totalRounds >= 3 ? fmt(s.avgRound, 1) : "—"}
                      </td>
                      <td className="px-2 py-2 text-right font-mono text-ink-muted">
                        {s.bestRound ?? "—"}
                      </td>
                      <td className="px-2 py-2 text-right font-mono">{s.top3Count}</td>
                      <td className="px-2 py-2 text-right font-mono">{s.top10Count}</td>
                      <td className="px-2 py-2 text-right font-mono">
                        {s.improvementPerYear !== null && s.improvementPerYear !== undefined
                          ? (s.improvementPerYear > 0 ? "+" : "") + fmt(s.improvementPerYear, 1)
                          : "—"}
                      </td>
                      <td className="px-2 py-2 text-right">
                        <ConfidenceBadge score={s.dataConfidenceScore} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Siste resultater */}
      <section>
        <h2 className="text-sm font-semibold text-ink-muted uppercase mb-3">
          Siste resultater ({profile.recentResults.length} av flere)
        </h2>
        <div className="rounded-2xl border border-line bg-card shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-soft text-xs uppercase text-ink-muted">
              <tr>
                <th className="px-4 py-2 text-left">Dato</th>
                <th className="px-4 py-2 text-left">Turnering</th>
                <th className="px-4 py-2 text-left">Klasse</th>
                <th className="px-4 py-2 text-right">Pos</th>
                <th className="px-4 py-2 text-right">Total</th>
                <th className="px-4 py-2 text-right">Til par</th>
                <th className="px-4 py-2 text-left">Kilde</th>
              </tr>
            </thead>
            <tbody>
              {profile.recentResults.map((r) => (
                <tr key={r.id} className="border-t border-line-soft">
                  <td className="px-4 py-2 font-mono text-ink-muted">
                    {r.tournamentDate.toLocaleDateString("nb-NO")}
                  </td>
                  <td className="px-4 py-2">{r.tournamentName}</td>
                  <td className="px-4 py-2 text-ink-muted">
                    {r.ageGroup} · {r.holes}h
                  </td>
                  <td className="px-4 py-2 text-right font-mono">{r.position ?? "—"}</td>
                  <td className="px-4 py-2 text-right font-mono">
                    {r.totalScore ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-right font-mono">
                    <span
                      className={
                        r.toPar !== null && r.toPar < 0 ? "text-success" : ""
                      }
                    >
                      {fmtToPar(r.toPar)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-ink-subtle">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-card p-4 shadow-card">
      <div className="text-xs text-ink-muted uppercase">{label}</div>
      <div className="mt-1 text-2xl font-mono font-semibold text-ink">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-ink-subtle">{hint}</div>}
    </div>
  );
}
