"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Activity,
  Target,
  TrendingUp,
  Calendar,
  FileSpreadsheet,
  Image,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
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
import type { TrackManOverview } from "./actions";

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
    if (sessionShots[expandedSessionId]) return;

    async function loadShots() {
      const res = await fetch(`/api/portal/trackman/sessions/${expandedSessionId}/shots`);
      if (res.ok) {
        const json = await res.json();
        setSessionShots((prev) => ({ ...prev, [expandedSessionId!]: json.shots ?? [] }));
      }
    }
    loadShots();
  }, [expandedSessionId, sessionShots]);

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
          error: "Nettverksfeil — proev igjen",
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
          error: "Filen maa vaere et bilde (PNG, JPG, etc.)",
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
          error: "Nettverksfeil — proev igjen",
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
    return { date, speed: 0 }; // speed not available in session list, will show 0
  });

  const carryByClub = Array.from(
    sessions.reduce((acc, s) => {
      for (const c of s.clubs) {
        const existing = acc.get(c.club);
        if (existing) {
          existing.carry += 0; // carry not in session list
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
          <h1 className="text-2xl font-bold text-[#0A1F18]">TrackMan Data</h1>
          <p className="text-[#7A8C85] mt-1">
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A1F18] text-white text-sm font-medium hover:opacity-90 transition-opacity"
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Sesjoner"
          value={hasData ? (data.totalSessions || sessions.length).toLocaleString("nb-NO") : "0"}
          icon={<Activity className="w-6 h-6 text-[#0A1F18]" />}
          iconBg="bg-[#0A1F18]/10"
        />
        <StatCard
          label="Slag totalt"
          value={hasData
            ? (data.totalShots || sessions.reduce((a, s) => a + s.totalShots, 0)).toLocaleString("nb-NO")
            : "0"}
          icon={<Target className="w-6 h-6 text-[#007AFF]" />}
          iconBg="bg-[#007AFF]/10"
        />
        <StatCard
          label="Beste carry"
          value={hasData ? `${data.bestCarry}m` : "–"}
          icon={<TrendingUp className="w-6 h-6 text-[#C48A32]" />}
          iconBg="bg-[#C48A32]/10"
        />
        <StatCard
          label="Snitt carry"
          value={hasData ? `${data.avgCarry}m` : "–"}
          icon={<Activity className="w-6 h-6 text-[#1A4D36]" />}
          iconBg="bg-[#1A4D36]/10"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-[#D5DFDB]/50">
          <h3 className="text-sm font-semibold text-[#0A1F18] mb-4">
            Ballfart-trend (Driver)
          </h3>
          <div className="h-[220px]">
            {ballSpeedTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ballSpeedTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ECF0EF" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#7A8C85" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#7A8C85" }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #D5DFDB" }}
                    labelStyle={{ color: "#0A1F18", fontWeight: 600 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="speed"
                    stroke="#0A1F18"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#0A1F18", strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-[#7A8C85]">
                Ingen driver-sesjoner ennå
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#D5DFDB]/50">
          <h3 className="text-sm font-semibold text-[#0A1F18] mb-4">
            Sesjoner per klubb
          </h3>
          <div className="h-[220px]">
            {carryByClub.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={carryByClub}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ECF0EF" vertical={false} />
                  <XAxis dataKey="club" tick={{ fontSize: 12, fill: "#7A8C85" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#7A8C85" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #D5DFDB" }}
                    labelStyle={{ color: "#0A1F18", fontWeight: 600 }}
                  />
                  <Bar dataKey="carry" fill="#0A1F18" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-[#7A8C85]">
                Ingen sesjoner ennå
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Session List */}
      <div>
        <h3 className="font-semibold text-[#0A1F18] mb-4">Sesjonsoversikt</h3>
        <div className="bg-white rounded-2xl border border-[#D5DFDB]/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F8F7]">
                <tr>
                  {["Dato", "Klubb", "Slag", "Kontekst"].map((h) => (
                    <th
                      key={h}
                      className="text-xs font-semibold text-[#7A8C85] uppercase tracking-wider p-4 text-left"
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
                    <td colSpan={5} className="p-4 text-sm text-[#7A8C85]">Laster sesjoner...</td>
                  </tr>
                ) : displaySessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-sm text-[#7A8C85]">Ingen sesjoner funnet. Last opp TrackMan-data for å komme i gang.</td>
                  </tr>
                ) : (
                  displaySessions.map((session) => {
                    const isOpen = expandedSessionId === session.id;
                    const shots = sessionShots[session.id] ?? [];
                    return (
                      <React.Fragment key={session.id}>
                        <tr
                          className="border-t border-[#D5DFDB]/30 hover:bg-[#F5F8F7]/50 cursor-pointer"
                          onClick={() => setExpandedSessionId(isOpen ? null : session.id)}
                        >
                          <td className="p-4 text-sm text-[#0A1F18]">
                            {new Date(session.sessionDate).toLocaleDateString("nb-NO", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="p-4 font-medium text-[#0A1F18]">{session.club}</td>
                          <td className="p-4 text-sm text-[#0A1F18]">{session.shotCount}</td>
                          <td className="p-4 text-sm text-[#0A1F18]">TRAINING</td>
                          <td className="p-4">
                            <button className="p-1 rounded-lg hover:bg-[#D5DFDB]/30 transition-colors">
                              {isOpen ? (
                                <ChevronUp className="w-4 h-4 text-[#7A8C85]" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-[#7A8C85]" />
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
                                <div className="bg-[#F5F8F7]/60 px-4 py-4">
                                  <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8C85] mb-3">
                                    Slagdetaljer
                                  </p>
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="text-left text-xs text-[#7A8C85]">
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
                                              <td className="py-2 text-[#0A1F18]">{idx + 1}</td>
                                              <td className="py-2 text-[#0A1F18]">
                                                {shot.ballSpeed ? `${Math.round(shot.ballSpeed * 10) / 10} mph` : "–"}
                                              </td>
                                              <td className="py-2 text-[#0A1F18]">
                                                {shot.carryDistance ? `${Math.round(shot.carryDistance)}m` : "–"}
                                              </td>
                                              <td className="py-2 text-[#0A1F18]">
                                                {shot.totalDistance ? `${Math.round(shot.totalDistance)}m` : "–"}
                                              </td>
                                              <td className="py-2 text-[#0A1F18]">
                                                {shot.spinRate ? `${Math.round(shot.spinRate)} rpm` : "–"}
                                              </td>
                                              <td className="py-2 text-[#0A1F18]">
                                                {shot.launchAngle ? `${Math.round(shot.launchAngle * 10) / 10}°` : "–"}
                                              </td>
                                            </tr>
                                          ))
                                        ) : (
                                          <tr>
                                            <td colSpan={6} className="py-3 text-[#7A8C85]">
                                              Ingen detaljerte slagdata tilgjengelig.
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
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
        <h3 className="text-sm font-semibold text-[#0A1F18] mb-4">Handlinger</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button variant="secondary" className="h-auto py-3 justify-start gap-3" asChild>
            <a href="#">
              <Upload className="w-4 h-4" />
              <div className="text-left">
                <p className="text-sm font-medium">Last opp CSV</p>
                <p className="text-xs text-muted-foreground">Importer fra TrackMan</p>
              </div>
            </a>
          </Button>
          <Button variant="secondary" className="h-auto py-3 justify-start gap-3" asChild>
            <a href="#">
              <FileSpreadsheet className="w-4 h-4" />
              <div className="text-left">
                <p className="text-sm font-medium">Eksporter data</p>
                <p className="text-xs text-muted-foreground">Last ned rapport</p>
              </div>
            </a>
          </Button>
          <Button variant="secondary" className="h-auto py-3 justify-start gap-3" asChild>
            <a href="/portal/analyse">
              <TrendingUp className="w-4 h-4" />
              <div className="text-left">
                <p className="text-sm font-medium">Se analyse</p>
                <p className="text-xs text-muted-foreground">Dyp innsikt</p>
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !upload.loading) resetUpload();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#0A1F18]">Last opp TrackMan-data</h2>
          {!upload.loading && (
            <button
              onClick={resetUpload}
              className="p-1 rounded-lg hover:bg-[#F5F8F7] transition-colors"
            >
              <X className="w-5 h-5 text-[#7A8C85]" />
            </button>
          )}
        </div>

        {/* Feedback */}
        {upload.error && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#B84233]/10 text-[#B84233] text-sm mb-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{upload.error}</p>
          </div>
        )}
        {upload.success && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#1A4D36]/10 text-[#1A4D36] text-sm mb-4">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{upload.success}</p>
          </div>
        )}

        {/* Loading */}
        {upload.loading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="w-8 h-8 text-[#0A1F18] animate-spin" />
            <p className="text-sm text-[#7A8C85]">
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
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-[#D5DFDB] hover:border-[#0A1F18] hover:bg-[#F5F8F7] transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0A1F18]/10 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet className="w-6 h-6 text-[#0A1F18]" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-[#0A1F18]">Last opp CSV-fil</p>
                <p className="text-xs text-[#7A8C85] mt-0.5">
                  Eksporter fra TrackMan Range eller Performance Studio
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                setUpload((prev) => ({ ...prev, mode: "image" }));
                imageInputRef.current?.click();
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-[#D5DFDB] hover:border-[#AF52DE] hover:bg-[#AF52DE]/5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#AF52DE]/10 flex items-center justify-center flex-shrink-0">
                <Image className="w-6 h-6 text-[#AF52DE]" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-[#0A1F18]">Last opp skjermbilde</p>
                <p className="text-xs text-[#7A8C85] mt-0.5">
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

// ── StatCard ─────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  iconBg,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#D5DFDB]/50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8C85]">
            {label}
          </p>
          <p className="text-3xl font-bold text-[#0A1F18] mt-1 tabular-nums">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
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
