"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TrackManOverview } from "./actions";

// ── Typer ────────────────────────────────────────────────

interface UploadState {
  isOpen: boolean;
  mode: "csv" | "image" | null;
  loading: boolean;
  error: string | null;
  success: string | null;
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

  const csvInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  const hasData = data.totalSessions > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F18]">
            TrackMan Data
          </h1>
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
          value={data.totalSessions.toLocaleString("nb-NO")}
          icon={<Activity className="w-6 h-6 text-[#0A1F18]" />}
          iconBg="bg-[#0A1F18]/10"
        />
        <StatCard
          label="Slag totalt"
          value={data.totalShots.toLocaleString("nb-NO")}
          icon={<Target className="w-6 h-6 text-[#007AFF]" />}
          iconBg="bg-[#007AFF]/10"
        />
        <StatCard
          label="Beste carry"
          value={hasData ? `${data.bestCarry}m` : "\u2013"}
          icon={
            <TrendingUp className="w-6 h-6 text-[#C48A32]" />
          }
          iconBg="bg-[#C48A32]/10"
        />
        <StatCard
          label="Snitt carry"
          value={hasData ? `${data.avgCarry}m` : "\u2013"}
          icon={<Activity className="w-6 h-6 text-[#1A4D36]" />}
          iconBg="bg-[#1A4D36]/10"
        />
      </div>

      {/* Carry Trend */}
      {data.carryTrend.length >= 2 ? (
        <div className="bg-white rounded-2xl p-6 border border-[#D5DFDB]/50">
          <h3 className="text-sm font-semibold text-[#0A1F18] mb-4">
            Driver carry-trend
          </h3>
          <div className="h-[200px] flex items-center justify-center rounded-xl bg-[#F5F8F7]">
            <p className="text-sm text-[#7A8C85]">Carry-trend graf kommer snart.</p>
          </div>
        </div>
      ) : (
        <EmptyState
          title="Driver carry-trend"
          message="Last opp minst 2 Driver-sesjoner for aa se trenden"
        />
      )}

      {/* Club Data Table */}
      {data.clubStats.length > 0 ? (
        <div className="bg-white rounded-2xl border border-[#D5DFDB]/50 overflow-hidden">
          <div className="p-4 border-b border-[#D5DFDB]/30">
            <h3 className="font-semibold text-[#0A1F18]">
              Klubb-statistikk
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F8F7]">
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
                      className={`text-xs font-semibold text-[#7A8C85] uppercase tracking-wider p-4 ${
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
                    className="border-t border-[#D5DFDB]/30 hover:bg-[#F5F8F7]/50"
                  >
                    <td className="p-4 font-medium text-[#0A1F18]">
                      {club.club}
                    </td>
                    <td className="p-4 text-right text-[#0A1F18]">
                      {club.avgSpeed ? `${club.avgSpeed} mph` : "\u2013"}
                    </td>
                    <td className="p-4 text-right text-[#0A1F18]">
                      {club.avgBallSpeed
                        ? `${club.avgBallSpeed} mph`
                        : "\u2013"}
                    </td>
                    <td className="p-4 text-right text-[#0A1F18]">
                      {club.avgSpin
                        ? `${Math.round(club.avgSpin)} rpm`
                        : "\u2013"}
                    </td>
                    <td className="p-4 text-right text-[#0A1F18]">
                      {club.avgLaunch ? `${club.avgLaunch}\u00B0` : "\u2013"}
                    </td>
                    <td className="p-4 text-right font-semibold text-[#0A1F18]">
                      {club.avgCarry}m
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="Klubb-statistikk"
          message="Last opp TrackMan-data for aa se statistikk per klubb"
        />
      )}

      {/* Recent Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#0A1F18]">
            Siste sesjoner
          </h3>
        </div>
        {data.sessions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.sessions.slice(0, 8).map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 border border-[#D5DFDB]/50 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-[#0A1F18]">
                    {session.club}
                  </span>
                  <Calendar className="w-4 h-4 text-[#7A8C85]" />
                </div>
                <p className="text-xs text-[#7A8C85]">
                  {new Date(session.sessionDate).toLocaleDateString("nb-NO", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#D5DFDB]/30">
                  <span className="text-xs text-[#0A1F18]">
                    {session.shotCount} slag
                  </span>
                  <span className="text-sm font-bold text-[#0A1F18]">
                    {session.avgCarry}m
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState message="Ingen sesjoner ennaa — last opp data for aa komme i gang" />
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-[#0A1F18] mb-4">
          Handlinger
        </h3>
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
          <h2 className="text-lg font-bold text-[#0A1F18]">
            Last opp TrackMan-data
          </h2>
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
                <p className="font-semibold text-sm text-[#0A1F18]">
                  Last opp CSV-fil
                </p>
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
                <p className="font-semibold text-sm text-[#0A1F18]">
                  Last opp skjermbilde
                </p>
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
          <p className="text-3xl font-bold text-[#0A1F18] mt-1 tabular-nums">
            {value}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

// ── EmptyState ───────────────────────────────────────────

function EmptyState({
  title,
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#D5DFDB]/50">
      {title && (
        <h3 className="text-sm font-semibold text-[#0A1F18] mb-4">
          {title}
        </h3>
      )}
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Upload className="w-8 h-8 text-[#7A8C85] mb-3" />
        <p className="text-sm text-[#7A8C85]">{message}</p>
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
