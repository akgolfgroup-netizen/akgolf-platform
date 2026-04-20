"use client";

import { useState, useMemo } from "react";
import { screens, sprintNames, groupNames, statusConfig, type Screen } from "./data";

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.todo;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config.className}`}>
      {config.label}
    </span>
  );
}

function AuthBadge({ auth }: { auth: string }) {
  const configs: Record<string, string> = {
    none: "bg-surface-container text-on-surface-variant",
    portal: "bg-primary-container/20 text-primary-container",
    admin: "bg-inverse-surface/20 text-inverse-surface",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${configs[auth] || configs.none}`}>
      {auth === "none" ? "Public" : auth}
    </span>
  );
}

function ScreenCard({ screen }: { screen: Screen }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`http://localhost:3000${screen.route}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-4 transition-all hover:border-outline-variant/40 hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-on-surface truncate">{screen.label}</h3>
          <p className="mt-0.5 font-mono text-[10px] text-on-surface-variant/60 truncate">{screen.route}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <StatusBadge status={screen.status} />
          <AuthBadge auth={screen.auth} />
        </div>
      </div>

      {screen.heritageRef && (
        <p className="mt-2 text-[10px] text-on-surface-variant/50">
          Ref: <span className="font-mono">{screen.heritageRef}</span>
        </p>
      )}

      <div className="mt-3 flex gap-2">
        <a
          href={screen.route}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg bg-primary-container px-3 py-1.5 text-[11px] font-bold text-surface hover:opacity-90 transition-opacity"
        >
          Open
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-lg border border-outline-variant/30 px-3 py-1.5 text-[11px] font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          {copied ? "Copied!" : "Copy URL"}
        </button>
      </div>
    </div>
  );
}

function SprintSection({
  sprint,
  label,
  screens,
  defaultOpen = false,
}: {
  sprint: string;
  label: string;
  screens: Screen[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const doneCount = screens.filter((s) => s.status === "done").length;

  // Group by sub-group if any
  const groups = useMemo(() => {
    const hasGroups = screens.some((s) => s.group);
    if (!hasGroups) return { "": screens };
    const grouped: Record<string, Screen[]> = {};
    for (const s of screens) {
      const g = s.group || "";
      if (!grouped[g]) grouped[g] = [];
      grouped[g].push(s);
    }
    return grouped;
  }, [screens]);

  return (
    <section id={`sprint-${sprint}`} className="scroll-mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-2xl border border-outline-variant/20 bg-surface-container p-4 text-left transition-colors hover:bg-surface-container-high"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-container text-xs font-bold text-surface">
          {sprint}
        </span>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-on-surface">{label}</h2>
          <p className="text-[11px] text-on-surface-variant/60">
            {screens.length} screens · {doneCount} done
          </p>
        </div>
        <svg
          className={`h-4 w-4 text-on-surface-variant transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-3 space-y-4">
          {Object.entries(groups).map(([groupKey, groupScreens]) => (
            <div key={groupKey}>
              {groupKey && (
                <h3 className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">
                  {groupNames[groupKey] || groupKey}
                </h3>
              )}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {groupScreens.map((screen) => (
                  <ScreenCard key={screen.route} screen={screen} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function DesignReviewPage() {
  const [filter, setFilter] = useState<"all" | "portal" | "admin" | "none">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "done" | "tokens" | "todo">("all");

  const sprintGroups = useMemo(() => {
    const groups: Record<string, Screen[]> = {};
    for (const s of screens) {
      if (filter !== "all" && s.auth !== filter) continue;
      if (statusFilter !== "all" && s.status !== statusFilter) continue;
      if (!groups[s.sprint]) groups[s.sprint] = [];
      groups[s.sprint].push(s);
    }
    return groups;
  }, [filter, statusFilter]);

  const totalScreens = Object.values(sprintGroups).flat().length;
  const doneCount = Object.values(sprintGroups)
    .flat()
    .filter((s) => s.status === "done").length;

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 lg:px-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
            ◆ Heritage Grid
          </span>
          <span className="h-px flex-1 bg-outline-variant/20" />
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-on-surface">
          Design Review
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
          Review all {totalScreens} screens for Heritage Grid compliance. Open each screen
          in Chrome and compare against the Stitch reference.
        </p>

        {/* Progress */}
        <div className="mt-4 flex items-center gap-4">
          <div className="h-2 flex-1 max-w-xs overflow-hidden rounded-full bg-surface-container">
            <div
              className="h-full rounded-full bg-primary-container transition-all"
              style={{ width: `${totalScreens > 0 ? (doneCount / totalScreens) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs font-mono text-on-surface-variant">
            {doneCount}/{totalScreens} done
          </span>
        </div>
      </header>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">Auth:</span>
        {(["all", "none", "portal", "admin"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
              filter === f
                ? "bg-on-surface text-surface"
                : "bg-surface-container text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {f === "all" ? "All" : f === "none" ? "Public" : f}
          </button>
        ))}

        <span className="ml-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">Status:</span>
        {(["all", "done", "tokens", "todo"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
              statusFilter === s
                ? "bg-on-surface text-surface"
                : "bg-surface-container text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      {/* Instructions for auth routes */}
      {(filter === "all" || filter === "portal" || filter === "admin") && (
        <div className="mb-6 rounded-xl border border-secondary-fixed/30 bg-secondary-fixed/10 p-4">
          <p className="text-xs font-semibold text-on-surface">
            🔐 Auth routes require login
          </p>
          <p className="mt-1 text-[11px] text-on-surface-variant">
            Portal: <a href="/portal/login" className="underline text-primary-container" target="_blank">/portal/login</a> ·
            Admin: <a href="/admin/login" className="underline text-primary-container" target="_blank">/admin/login</a>
          </p>
        </div>
      )}

      {/* Sprint sections */}
      <div className="space-y-4">
        {Object.entries(sprintGroups)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([sprint, sprintScreens]) => (
            <SprintSection
              key={sprint}
              sprint={sprint}
              label={sprintNames[sprint] || `Sprint ${sprint}`}
              screens={sprintScreens}
              defaultOpen={sprint === "A"}
            />
          ))}
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-outline-variant/20 pt-6">
        <p className="text-[11px] text-on-surface-variant/50">
          Heritage Grid v3.1 · 206 Stitch references · {screens.length} total screens
        </p>
      </footer>
    </div>
  );
}
