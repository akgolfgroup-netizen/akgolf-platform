"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  Mail,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  ChevronRight,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

// Mock data
const reportTypes = [
  {
    id: "monthly",
    name: "Månedsrapport",
    description: "Oversikt over omsetning, elever og aktivitet",
    icon: Calendar,
    color: "var(--hg-primary)",
    lastGenerated: "1. april 2024",
  },
  {
    id: "students",
    name: "Elev-statistikk",
    description: "Detaljert analyse av elevaktivitet og fremgang",
    icon: Users,
    color: "var(--hg-success)",
    lastGenerated: "5. april 2024",
  },
  {
    id: "financial",
    name: "Økonomisk rapport",
    description: "Inntekter, utgifter og lønnsomhet",
    icon: DollarSign,
    color: "var(--hg-info)",
    lastGenerated: "1. april 2024",
  },
  {
    id: "capacity",
    name: "Kapasitetsrapport",
    description: "Utnyttelse og booking-trender",
    icon: TrendingUp,
    color: "var(--hg-warning)",
    lastGenerated: "3. april 2024",
  },
];

const scheduledReports = [
  { id: "1", name: "Månedsrapport", frequency: "Månedlig", recipients: "anders@akgolf.no", nextRun: "1. mai 2024", active: true },
  { id: "2", name: "Ukentlig oppsummering", frequency: "Ukentlig", recipients: "anders@akgolf.no", nextRun: "8. april 2024", active: true },
];

const recentReports = [
  { id: "1", name: "Månedsrapport - Mars 2024", type: "Månedlig", generatedAt: "1. april 2024", size: "2.4 MB" },
  { id: "2", name: "Elev-statistikk Q1", type: "Kvartalsvis", generatedAt: "28. mars 2024", size: "1.8 MB" },
  { id: "3", name: "Årsrapport 2023", type: "Årlig", generatedAt: "5. januar 2024", size: "5.2 MB" },
];

export default function RapporterPage() {
  const { toggle } = useMCSidebar();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  return (
    <>
      <MCTopbar
        title="Rapporter"
        subtitle="Generer og eksporter rapporter"
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={cn(
                  "hg-card p-4 cursor-pointer transition-all hover:border-[var(--hg-border-hover)]",
                  selectedReport === report.id && "ring-2 ring-[var(--hg-primary)]"
                )}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${report.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: report.color }} />
                </div>
                <h3 className="text-sm font-semibold text-[var(--hg-text)] mb-1">{report.name}</h3>
                <p className="text-xs text-[var(--hg-text-muted)] mb-3">{report.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--hg-text-muted)]">
                    Sist generert: {report.lastGenerated}
                  </span>
                  <button className="p-1.5 rounded-md hover:bg-[var(--hg-surface-raised)] text-[var(--hg-primary)]">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Generate Report */}
          <div className="hg-card p-4">
            <h3 className="hg-section-title mb-4">Generer ny rapport</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--hg-text-muted)] block mb-1.5">Rapporttype</label>
                <select className="w-full hg-input">
                  <option>Velg rapport...</option>
                  {reportTypes.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--hg-text-muted)] block mb-1.5">Fra dato</label>
                  <input type="date" className="w-full hg-input" />
                </div>
                <div>
                  <label className="text-xs text-[var(--hg-text-muted)] block mb-1.5">Til dato</label>
                  <input type="date" className="w-full hg-input" />
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--hg-text-muted)] block mb-1.5">Format</label>
                <div className="flex gap-2">
                  {["PDF", "Excel", "CSV"].map((format) => (
                    <button
                      key={format}
                      className={cn(
                        "flex-1 py-2 text-xs font-medium rounded-lg border transition-colors",
                        format === "PDF"
                          ? "bg-[var(--hg-primary)] text-[var(--hg-bg)] border-[var(--hg-primary)]"
                          : "bg-[var(--hg-surface)] text-[var(--hg-text-secondary)] border-[var(--hg-border)] hover:border-[var(--hg-border-hover)]"
                      )}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>
              <button className="w-full hg-btn hg-btn-primary">
                <FileText className="w-4 h-4" />
                Generer rapport
              </button>
            </div>
          </div>

          {/* Scheduled Reports */}
          <div className="hg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
              <h3 className="hg-section-title">Automatiske rapporter</h3>
              <button className="p-1.5 rounded-md hover:bg-[var(--hg-surface-raised)]">
                <Plus className="w-4 h-4 text-[var(--hg-text-muted)]" />
              </button>
            </div>
            <div className="divide-y divide-[var(--hg-border-subtle)]">
              {scheduledReports.map((report) => (
                <div key={report.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-[var(--hg-text)]">{report.name}</h4>
                      <p className="text-xs text-[var(--hg-text-muted)]">{report.frequency}</p>
                    </div>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      report.active ? "bg-[var(--hg-success)]" : "bg-[var(--hg-text-muted)]"
                    )} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--hg-text-muted)]">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {report.recipients}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Neste: {report.nextRun}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="hg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
            <h3 className="hg-section-title">Nylig genererte rapporter</h3>
            <button className="text-xs text-[var(--hg-primary)] hover:underline">Se alle</button>
          </div>
          <div className="divide-y divide-[var(--hg-border-subtle)]">
            {recentReports.map((report) => (
              <div key={report.id} className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-lg bg-[var(--hg-surface-raised)]">
                  <FileText className="w-5 h-5 text-[var(--hg-primary)]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-[var(--hg-text)]">{report.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-[var(--hg-text-muted)]">
                    <span>{report.type}</span>
                    <span>•</span>
                    <span>{report.generatedAt}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg hover:bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[var(--hg-surface-raised)] text-[var(--hg-primary)]">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
