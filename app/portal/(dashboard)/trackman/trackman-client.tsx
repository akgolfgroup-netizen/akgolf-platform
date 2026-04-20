"use client";

import { Icon } from "@/components/ui/icon";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileSpreadsheet, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import type { TrackManOverview, TrackManAnalyticsSummary } from "./actions";
import { ShotDispersionChart } from "@/components/portal/trackman/shot-dispersion-chart";
import { TrackManAnalyticsCard } from "@/components/portal/trackman/trackman-analytics-card";
import { MonoLabel, NightSurface } from "@/components/portal/patterns";

// ── Design tokens as hex (for Recharts) ──────────────────
const COLORS = {
  outlineVariant: "#D5DFDB",
  onSurfaceVariant: "#7A8C85",
  onSurface: "#0A1F18",
  primary: "#154212",
};

// ── Typer ────────────────────────────────────────────────

interface UploadState {
  isOpen: boolean;
  mode: "csv" | "image" | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

interface ApiSession {
  sessionId: string;
  date: string;
  context: string;
  pressureLevel: number;
  totalShots: number;
  clubs: { club: string; count: number }[];
  avgBallSpeed: number | null;
}

interface ApiShot {
  id: string;
  shotNumber: number;
  club: string;
  ballSpeed: number | null;
  carryDistance: number | null;
  totalDistance: number | null;
  spinRate: number | null;
  launchAngle: number | null;
  offlineDistance: number | null;
}

// ── Komponent ────────────────────────────────────────────

export function TrackManClient({ data }: { data: TrackManOverview }) {
  const [upload, setUpload] = useState<UploadState>({
    isOpen: false,
    mode: null,
    loading: false,
    error: null,
    success: null,
  });
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ApiSession[]>([]);
  const [sessionShots, setSessionShots] = useState<Record<string, ApiShot[]>>({});
  const [sessionAnalytics, setSessionAnalytics] = useState<Record<string, TrackManAnalyticsSummary>>({});
  const [loadingSessions, setLoadingSessions] = useState(true);

  const csvInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/portal/trackman/sessions");
        if (res.ok) {
          const json = await res.json();
          setSessions(json.items ?? []);
        }
      } finally {
        setLoadingSessions(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!expandedSessionId) return;
    const sessionId = expandedSessionId;

    async function loadShots() {
      if (!sessionShots[sessionId]) {
        const res = await fetch(`/api/portal/trackman/sessions/${sessionId}/shots`);
        if (res.ok) {
          const json = await res.json();
          setSessionShots((prev) => ({ ...prev, [sessionId]: json.shots ?? [] }));
        }
      }
    }

    async function loadAnalytics() {
      if (!sessionAnalytics[sessionId]) {
        const res = await fetch(`/api/portal/trackman/sessions/${sessionId}/analytics`);
        if (res.ok) {
          const json = await res.json();
          if (json.analytics) {
            setSessionAnalytics((prev) => ({ ...prev, [sessionId]: json.analytics }));
          }
        }
      }
    }

    loadShots();
    loadAnalytics();
  }, [expandedSessionId, sessionShots, sessionAnalytics]);

  const resetUpload = useCallback(() => {
    setUpload({
      isOpen: false,
      mode: null,
      loading: false,
      error: null,
      success: null,
    });
  }, []);

  // ── CSV-upload ──
  const handleCSVUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUpload((prev) => ({
        ...prev,
        loading: true,
        error: null,
        success: null,
      }));

      try {
        const csvContent = await file.text();

        const res = await fetch("/api/portal/trackman/upload-csv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ csvContent }),
        });

        const result = await res.json();

        if (!res.ok) {
          setUpload((prev) => ({
            ...prev,
            loading: false,
            error: result.error || "Opplasting feilet",
          }));
          return;
        }

        setUpload((prev) => ({
          ...prev,
          loading: false,
          success: result.message,
        }));

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch {
        setUpload((prev) => ({
          ...prev,
          loading: false,
          error: "Nettverksfeil — prøv igjen",
        }));
      }

      if (csvInputRef.current) csvInputRef.current.value = "";
    },
    []
  );

  // ── Bilde-upload ──
  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setUpload((prev) => ({
          ...prev,
          error: "Filen må være et bilde (PNG, JPG, etc.)",
        }));
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setUpload((prev) => ({
          ...prev,
          error: "Bildet er for stort (maks 10 MB)",
        }));
        return;
      }

      setUpload((prev) => ({
        ...prev,
        loading: true,
        error: null,
        success: null,
      }));

      try {
        const base64 = await fileToBase64(file);

        const res = await fetch("/api/portal/trackman/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 }),
        });

        const result = await res.json();

        if (!res.ok) {
          setUpload((prev) => ({
            ...prev,
            loading: false,
            error: result.error || "OCR-analyse feilet",
          }));
          return;
        }

        setUpload((prev) => ({
          ...prev,
          loading: false,
          success: result.message,
        }));

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch {
        setUpload((prev) => ({
          ...prev,
          loading: false,
          error: "Nettverksfeil — prøv igjen",
        }));
      }

      if (imageInputRef.current) imageInputRef.current.value = "";
    },
    []
  );

  const hasData = data.totalSessions > 0 || sessions.length > 0;

  // Build chart data from real sessions if available
  const driverSessions = sessions
    .filter((s) => s.clubs.some((c) => c.club.toLowerCase().includes("driver")))
    .slice(0, 10)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const ballSpeedTrend = driverSessions.map((s) => {
    const date = new Date(s.date).toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
    return { date, speed: s.avgBallSpeed ?? 0 };
  });

  // Carry by club: use server data when available, otherwise compute from API sessions
  const carryByClub = data.clubStats.length > 0
    ? data.clubStats.map((c) => ({ club: c.club, carry: c.avgCarry }))
    : Array.from(
        sessions.reduce((acc, s) => {
          for (const c of s.clubs) {
            const existing = acc.get(c.club);
            if (existing) {
              existing.count += c.count;
            } else {
              acc.set(c.club, { club: c.club, carry: 0, count: c.count });
            }
          }
          return acc;
        }, new Map<string, { club: string; carry: number; count: number }>())
      ).map(([, v]) => ({ club: v.club, carry: v.count }));

  const displaySessions = sessions.length > 0
    ? sessions.map((s) => ({
        id: s.sessionId,
        sessionDate: s.date,
        club: s.clubs.map((c) => c.club).join(", ") || "Ukjent",
        shotCount: s.totalShots,
        avgBallSpeed: null as number | null,
        avgCarry: 0,
      }))
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <MonoLabel size="xs" uppercase className="mb-2 block text-on-surface-variant">
            TrackMan Lab
          </MonoLabel>
          <h1 className="text-2xl font-bold text-on-surface">TrackMan Data</h1>
          <p className="text-on-surface-variant mt-1">
            Spredning, teknikk-profil og klubb-analyse
          </p>
        </div>
        <button
          onClick={() =>
            setUpload({
              isOpen: true,
              mode: null,
              loading: false,
              error: null,
              success: null,
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-on-surface text-surface text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Upload className="w-4 h-4" />
          Last opp data
        </button>
      </div>

      {/* Upload Modal */}
      {upload.isOpen && (
        <UploadModal
          upload={upload}
          setUpload={setUpload}
          resetUpload={resetUpload}
          csvInputRef={csvInputRef}
          imageInputRef={imageInputRef}
        />
      )}

      {/* Hero — NightSurface med nøkkeltall */}
      <NightSurface variant="ambient" className="rounded-2xl p-8">
        <div className="mb-6 flex items-center gap-2">
          <span className="h-px w-6 bg-surface-container-lowest/40" />
          <MonoLabel size="xs" uppercase className="text-surface/60">
            Sesjonsoversikt · siste 30 dager
          </MonoLabel>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <NightStatCell
            label="Sesjoner"
            value={hasData ? (data.totalSessions || sessions.length).toLocaleString("nb-NO") : "0"}
            icon={<Icon name="monitoring" className="h-4 w-4" />}
          />
          <NightStatCell
            label="Slag"
            value={hasData
              ? (data.totalShots || sessions.reduce((a, s) => a + s.totalShots, 0)).toLocaleString("nb-NO")
              : "0"}
            icon={<Icon name="my_location" className="h-4 w-4" />}
          />
          <NightStatCell
            label="Beste carry"
            value={hasData ? `${data.bestCarry}m` : "–"}
            icon={<Icon name="trending_up" className="h-4 w-4" />}
          />
          <NightStatCell
            label="Snitt carry"
            value={hasData ? `${data.avgCarry}m` : "–"}
            icon={<Icon name="monitoring" className="h-4 w-4" />}
          />
        </div>
      </NightSurface>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30">
          <h3 className="text-sm font-semibold text-on-surface mb-4">
            Ballfart-trend (Driver)
          </h3>
          <div className="h-[220px]">
            {ballSpeedTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ballSpeedTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.outlineVariant} />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: COLORS.onSurfaceVariant }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: COLORS.onSurfaceVariant }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: `1px solid ${COLORS.outlineVariant}` }}
                    labelStyle={{ color: COLORS.onSurface, fontWeight: 600 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="speed"
                    stroke={COLORS.onSurface}
                    strokeWidth={2}
                    dot={{ r: 4, fill: COLORS.onSurface, strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-on-surface-variant">
                Ingen driver-sesjoner ennå
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30">
          <h3 className="text-sm font-semibold text-on-surface mb-4">
            Carry per klubb
          </h3>
          <div className="h-[220px]">
            {carryByClub.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={carryByClub}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.outlineVariant} vertical={false} />
                  <XAxis dataKey="club" tick={{ fontSize: 12, fill: COLORS.onSurfaceVariant }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: COLORS.onSurfaceVariant }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: `1px solid ${COLORS.outlineVariant}` }}
                    labelStyle={{ color: COLORS.onSurface, fontWeight: 600 }}
                    formatter={(value) => [`${value}m`, "Carry"]}
                  />
                  <Bar dataKey="carry" fill={COLORS.primary} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-on-surface-variant">
                Ingen sesjoner ennå
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Club Stats Table */}
      {data.clubStats.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden">
          <div className="p-4 border-b border-outline-variant/30">
            <h3 className="font-semibold text-on-surface">Klubb-statistikk</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  {[
                    "Klubb",
                    "Klubb-fart",
                    "Ball-fart",
                    "Spin",
                    "Launch",
                    "Carry",
                  ].map((header) => (
                    <th
                      key={header}
                      className={`text-xs font-semibold text-on-surface-variant uppercase tracking-wider p-4 ${
                        header === "Klubb" ? "text-left" : "text-right"
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.clubStats.map((club) => (
                  <tr
                    key={club.club}
                    className="border-t border-outline-variant/30 hover:bg-surface/50"
                  >
                    <td className="p-4 font-medium text-on-surface">{club.club}</td>
                    <td className="p-4 text-right">
                      <MonoLabel size="md" className="text-on-surface">
                        {club.avgSpeed ? `${club.avgSpeed} mph` : "\u2013"}
                      </MonoLabel>
                    </td>
                    <td className="p-4 text-right">
                      <MonoLabel size="md" className="text-on-surface">
                        {club.avgBallSpeed ? `${club.avgBallSpeed} mph` : "\u2013"}
                      </MonoLabel>
                    </td>
                    <td className="p-4 text-right">
                      <MonoLabel size="md" className="text-on-surface">
                        {club.avgSpin ? `${Math.round(club.avgSpin)} rpm` : "\u2013"}
                      </MonoLabel>
                    </td>
                    <td className="p-4 text-right">
                      <MonoLabel size="md" className="text-on-surface">
                        {club.avgLaunch ? `${club.avgLaunch}\u00B0` : "\u2013"}
                      </MonoLabel>
                    </td>
                    <td className="p-4 text-right">
                      <MonoLabel size="md" className="font-semibold text-on-surface">
                        {club.avgCarry}m
                      </MonoLabel>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Session List */}
      <div>
        <h3 className="font-semibold text-on-surface mb-4">Sesjonsoversikt</h3>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  {["Dato", "Klubb", "Slag", "Kontekst"].map((h) => (
                    <th
                      key={h}
                      className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider p-4 text-left"
                    >
                      {h}
                    </th>
                  ))}
                  <th className="p-4" />
                </tr>
              </thead>
              <tbody>
                {loadingSessions ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-sm text-on-surface-variant">Laster sesjoner...</td>
                  </tr>
                ) : displaySessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-sm text-on-surface-variant">Ingen sesjoner funnet. Last opp TrackMan-data for å komme i gang.</td>
                  </tr>
                ) : (
                  displaySessions.map((session) => {
                    const isOpen = expandedSessionId === session.id;
                    const shots = sessionShots[session.id] ?? [];
                    const analytics = sessionAnalytics[session.id];
                    return (
                      <React.Fragment key={session.id}>
                        <tr
                          className="border-t border-outline-variant/30 hover:bg-surface/50 cursor-pointer"
                          onClick={() => setExpandedSessionId(isOpen ? null : session.id)}
                        >
                          <td className="p-4 text-sm text-on-surface">
                            {new Date(session.sessionDate).toLocaleDateString("nb-NO", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="p-4 font-medium text-on-surface">{session.club}</td>
                          <td className="p-4 text-sm text-on-surface">{session.shotCount}</td>
                          <td className="p-4 text-sm text-on-surface">TRAINING</td>
                          <td className="p-4">
                            <button className="p-1 rounded-lg hover:bg-surface-variant/30 transition-colors">
                              {isOpen ? (
                                <Icon name="expand_less" className="w-4 h-4 text-on-surface-variant" />
                              ) : (
                                <Icon name="expand_more" className="w-4 h-4 text-on-surface-variant" />
                              )}
                            </button>
                          </td>
                        </tr>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                            >
                              <td colSpan={5} className="p-0">
                                <div className="bg-surface/60 px-4 py-4 space-y-6">
                                  {/* Shot Dispersion Chart */}
                                  <div>
                                    <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block mb-3">Shot-spredning</MonoLabel>
                                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3">
                                      <ShotDispersionChart shots={shots} />
                                    </div>
                                  </div>

                                  {/* Session Analytics */}
                                  {analytics && (
                                    <div>
                                      <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block mb-3">Sesjonsanalyse</MonoLabel>
                                      <TrackManAnalyticsCard analytics={analytics} />
                                    </div>
                                  )}

                                  {/* Shot Details Table */}
                                  <div>
                                    <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block mb-3">Slagdetaljer</MonoLabel>
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="text-left text-xs text-on-surface-variant">
                                            <th className="pb-2 font-medium">#</th>
                                            <th className="pb-2 font-medium">Ballfart</th>
                                            <th className="pb-2 font-medium">Carry</th>
                                            <th className="pb-2 font-medium">Total</th>
                                            <th className="pb-2 font-medium">Spin</th>
                                            <th className="pb-2 font-medium">Launch</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {shots.length > 0 ? (
                                            shots.map((shot, idx) => (
                                              <tr key={shot.id}>
                                                <td className="py-2 text-on-surface">{idx + 1}</td>
                                                <td className="py-2 text-on-surface">
                                                  {shot.ballSpeed ? `${Math.round(shot.ballSpeed * 10) / 10} mph` : "–"}
                                                </td>
                                                <td className="py-2 text-on-surface">
                                                  {shot.carryDistance ? `${Math.round(shot.carryDistance)}m` : "–"}
                                                </td>
                                                <td className="py-2 text-on-surface">
                                                  {shot.totalDistance ? `${Math.round(shot.totalDistance)}m` : "–"}
                                                </td>
                                                <td className="py-2 text-on-surface">
                                                  {shot.spinRate ? `${Math.round(shot.spinRate)} rpm` : "–"}
                                                </td>
                                                <td className="py-2 text-on-surface">
                                                  {shot.launchAngle ? `${Math.round(shot.launchAngle * 10) / 10}°` : "–"}
                                                </td>
                                              </tr>
                                            ))
                                          ) : (
                                            <tr>
                                              <td colSpan={6} className="py-3 text-on-surface-variant">
                                                Ingen detaljerte slagdata tilgjengelig.
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-on-surface mb-4">Handlinger</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button variant="secondary" className="h-auto py-3 justify-start gap-3" asChild>
            <a href="#">
              <Upload className="w-4 h-4" />
              <div className="text-left">
                <p className="text-sm font-medium">Last opp CSV</p>
                <p className="text-xs text-on-surface-variant">Importer fra TrackMan</p>
              </div>
            </a>
          </Button>
          <Button variant="secondary" className="h-auto py-3 justify-start gap-3" asChild>
            <a href="#">
              <FileSpreadsheet className="w-4 h-4" />
              <div className="text-left">
                <p className="text-sm font-medium">Eksporter data</p>
                <p className="text-xs text-on-surface-variant">Last ned rapport</p>
              </div>
            </a>
          </Button>
          <Button variant="secondary" className="h-auto py-3 justify-start gap-3" asChild>
            <a href="/portal/analyse">
              <Icon name="trending_up" className="w-4 h-4" />
              <div className="text-left">
                <p className="text-sm font-medium">Se analyse</p>
                <p className="text-xs text-on-surface-variant">Dyp innsikt</p>
              </div>
            </a>
          </Button>
        </div>
      </div>

      {/* Skjulte file inputs */}
      <input
        ref={csvInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleCSVUpload}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}

// ── Upload Modal ─────────────────────────────────────────

function UploadModal({
  upload,
  setUpload,
  resetUpload,
  csvInputRef,
  imageInputRef,
}: {
  upload: UploadState;
  setUpload: React.Dispatch<React.SetStateAction<UploadState>>;
  resetUpload: () => void;
  csvInputRef: React.RefObject<HTMLInputElement | null>;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !upload.loading) resetUpload();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-on-surface">Last opp TrackMan-data</h2>
          {!upload.loading && (
            <button
              onClick={resetUpload}
              className="p-1 rounded-lg hover:bg-surface transition-colors"
            >
              <Icon name="close" className="w-5 h-5 text-on-surface-variant" />
            </button>
          )}
        </div>

        {/* Feedback */}
        {upload.error && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-error/10 text-error text-sm mb-4">
            <Icon name="error" className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{upload.error}</p>
          </div>
        )}
        {upload.success && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-success/10 text-success text-sm mb-4">
            <Icon name="check_circle" className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{upload.success}</p>
          </div>
        )}

        {/* Loading */}
        {upload.loading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Icon name="progress_activity" className="w-8 h-8 text-on-surface animate-spin" />
            <p className="text-sm text-on-surface-variant">
              {upload.mode === "image"
                ? "Analyserer bilde med AI..."
                : "Importerer CSV-data..."}
            </p>
          </div>
        )}

        {/* Upload-valg */}
        {!upload.loading && !upload.success && (
          <div className="space-y-3">
            <button
              onClick={() => {
                setUpload((prev) => ({ ...prev, mode: "csv" }));
                csvInputRef.current?.click();
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-outline-variant/30 hover:border-on-surface hover:bg-surface transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-on-surface/10 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet className="w-6 h-6 text-on-surface" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-on-surface">Last opp CSV-fil</p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Eksporter fra TrackMan Range eller Performance Studio
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                setUpload((prev) => ({ ...prev, mode: "image" }));
                imageInputRef.current?.click();
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-outline-variant/30 hover:border-ai hover:bg-ai-light/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-ai-light flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-6 h-6 text-ai" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-on-surface">Last opp skjermbilde</p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  AI leser data fra TrackMan-skjerm (PNG, JPG)
                </p>
              </div>
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── NightStatCell ────────────────────────────────────────

function NightStatCell({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 text-surface/50">
        {icon}
        <MonoLabel size="xs" uppercase>
          {label}
        </MonoLabel>
      </div>
      <p className="text-3xl font-bold tabular-nums tracking-tight text-surface">{value}</p>
    </div>
  );
}

// ── Hjelpefunksjon ───────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
