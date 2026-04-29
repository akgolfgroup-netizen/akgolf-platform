"use client";

import React, { useCallback, useRef, useState, useTransition } from "react";
import {
  Upload,
  FileSpreadsheet,
  Image as ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import { uploadTrackmanImage, uploadTrackmanCsv } from "@/lib/portal/trackman/upload-actions";
import { Tabs } from "@/components/ui/tabs";
import { UploadMetadataFields } from "./upload-metadata-fields";
import { UploadStatus } from "./upload-status";

interface UploadFormProps {
  clubs: string[];
}

type UploadTab = "image" | "csv";

interface UploadState {
  file: File | null;
  preview: string | null;
  date: string;
  club: string;
  notes: string;
  isUploading: boolean;
  error: string | null;
  success: { sessionId: string; shotsImported: number; confidence: number } | null;
}

function todayInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function UploadForm({ clubs }: UploadFormProps) {
  const [tab, setTab] = useState<UploadTab>("image");
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<UploadState>({
    file: null,
    preview: null,
    date: todayInputValue(),
    club: "",
    notes: "",
    isUploading: false,
    error: null,
    success: null,
  });
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setState({
      file: null,
      preview: null,
      date: todayInputValue(),
      club: "",
      notes: "",
      isUploading: false,
      error: null,
      success: null,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      if (tab === "image") {
        if (!file.type.startsWith("image/")) {
          setState((s) => ({ ...s, error: "Filen må være et bilde (PNG, JPG, WEBP)" }));
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          setState((s) => ({ ...s, error: "Bildet er for stort (maks 10 MB)" }));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          setState((s) => ({
            ...s,
            file,
            preview: reader.result as string,
            error: null,
            success: null,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
          setState((s) => ({ ...s, error: "Filen må være en CSV-fil" }));
          return;
        }
        setState((s) => ({
          ...s,
          file,
          preview: null,
          error: null,
          success: null,
        }));
      }
    },
    [tab]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleUpload = useCallback(() => {
    const file = state.file;
    if (!file) return;

    setState((s) => ({ ...s, isUploading: true, error: null, success: null }));

    startTransition(async () => {
      try {
        const sessionDate = new Date(state.date);
        const metadata = {
          sessionDate,
          club: state.club || undefined,
          notes: state.notes || undefined,
        };

        if (tab === "image") {
          const base64 = await fileToBase64(file);
          const result = await uploadTrackmanImage(base64, metadata);
          setState((s) => ({
            ...s,
            isUploading: false,
            success: {
              sessionId: result.sessionId,
              shotsImported: result.shotsImported,
              confidence: result.confidence,
            },
          }));
        } else {
          const csvText = await file.text();
          const result = await uploadTrackmanCsv(csvText, metadata);
          setState((s) => ({
            ...s,
            isUploading: false,
            success: {
              sessionId: result.sessionId,
              shotsImported: result.shotsImported,
              confidence: 1,
            },
          }));
        }
      } catch (err) {
        setState((s) => ({
          ...s,
          isUploading: false,
          error: err instanceof Error ? err.message : "Opplasting feilet",
        }));
      }
    });
  }, [state.file, state.date, state.club, state.notes, tab]);

  return (
    <div className="space-y-6">
      <Tabs
        items={[
          { id: "image", label: "Last opp bilde", icon: <ImageIcon className="w-4 h-4" /> },
          { id: "csv", label: "Last opp CSV", icon: <FileSpreadsheet className="w-4 h-4" /> },
        ]}
        value={tab}
        onValueChange={(v) => {
          setTab(v as UploadTab);
          reset();
        }}
      />

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors
          ${dragOver ? "border-primary bg-primary-soft" : "border-line hover:border-ink-muted bg-card"}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={tab === "image" ? "image/*" : ".csv,text/csv"}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <div className="mx-auto w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-3">
          {tab === "image" ? (
            <ImageIcon className="w-6 h-6 text-ink-muted" />
          ) : (
            <FileSpreadsheet className="w-6 h-6 text-ink-muted" />
          )}
        </div>
        <p className="text-sm font-medium text-ink">
          {tab === "image" ? "Dra inn et bilde, eller klikk for å velge" : "Dra inn CSV-fil, eller klikk for å velge"}
        </p>
        <p className="text-xs text-ink-subtle mt-1">
          {tab === "image" ? "PNG, JPG eller WEBP · maks 10 MB" : "TrackMan CSV-eksport"}
        </p>
      </div>

      {/* Preview / File info */}
      {state.preview && tab === "image" && (
        <div className="relative rounded-xl overflow-hidden border border-line bg-card">
          <img src={state.preview} alt="Forhåndsvisning" className="w-full max-h-64 object-contain" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setState((s) => ({ ...s, file: null, preview: null }));
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-ink/60 text-white hover:bg-ink/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {state.file && tab === "csv" && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-line">
          <FileSpreadsheet className="w-5 h-5 text-primary" />
          <span className="text-sm text-ink flex-1 truncate">{state.file.name}</span>
          <button
            onClick={() => setState((s) => ({ ...s, file: null, preview: null }))}
            className="p-1 rounded hover:bg-line transition-colors"
          >
            <X className="w-4 h-4 text-ink-muted" />
          </button>
        </div>
      )}

      {/* Metadata form */}
      <UploadMetadataFields
        date={state.date}
        onDateChange={(v) => setState((s) => ({ ...s, date: v }))}
        club={state.club}
        onClubChange={(v) => setState((s) => ({ ...s, club: v }))}
        notes={state.notes}
        onNotesChange={(v) => setState((s) => ({ ...s, notes: v }))}
        clubs={clubs}
      />

      {/* Status */}
      <UploadStatus error={state.error} success={state.success} isImage={tab === "image"} />

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!state.file || state.isUploading || isPending}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[48px]"
      >
        {state.isUploading || isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {tab === "image" ? "Analyserer bilde med AI..." : "Importerer CSV..."}
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            {tab === "image" ? "Last opp og analyser" : "Last opp CSV"}
          </>
        )}
      </button>

      {state.isUploading && tab === "image" && (
        <p className="text-xs text-center text-ink-subtle">
          AI-analyse tar 5–15 sekunder avhengig av bildekvalitet.
        </p>
      )}
    </div>
  );
}
