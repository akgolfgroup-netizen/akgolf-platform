"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Phase = "idle" | "uploading" | "transcribing" | "analyzing" | "done" | "error";

interface PostSessionUploadProps {
  /** Either provide an existing CoachingSession.id, or a Booking.id to create a new session */
  sessionId?: string;
  bookingId?: string;
  studentName?: string;
  onComplete?: (result: { sessionId: string }) => void;
}

const PHASE_LABEL: Record<Phase, string> = {
  idle: "Klar",
  uploading: "Laster opp lyd...",
  transcribing: "Transkriberer med Whisper...",
  analyzing: "Claude analyserer...",
  done: "Ferdig",
  error: "Feil",
};

export function PostSessionUpload({
  sessionId,
  bookingId,
  studentName,
  onComplete,
}: PostSessionUploadProps) {
  const router = useRouter();
  const audioRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [trackmanImage, setTrackmanImage] = useState<File | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [resultSessionId, setResultSessionId] = useState<string | null>(null);

  function handlePickAudio() {
    audioRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (f.size > 25 * 1024 * 1024) {
      setError("Filen er for stor. Maks 25 MB.");
      return;
    }
    setError(null);
    setFile(f);
  }

  async function handleSubmit() {
    if (!file) return;
    setError(null);

    try {
      // 1) Optionally parse TrackMan image first for context
      let trackmanContext: string | undefined;
      if (trackmanImage) {
        setPhase("uploading");
        const base64 = await fileToBase64(trackmanImage);
        const tmResp = await fetch("/api/portal/trackman/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64, preview: true }),
        });
        if (tmResp.ok) {
          const tmData = await tmResp.json();
          if (tmData.averages) {
            trackmanContext = JSON.stringify(tmData.averages);
          }
        }
      }

      // 2) Upload audio and transcribe
      setPhase("uploading");
      const formData = new FormData();
      formData.append("audio", file);
      if (sessionId) formData.append("sessionId", sessionId);
      if (bookingId) formData.append("bookingId", bookingId);
      if (trackmanContext) formData.append("trackmanContext", trackmanContext);

      setPhase("transcribing");
      const resp = await fetch("/api/portal/ai/coaching-transcription", {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Ukjent feil" }));
        throw new Error(err.error ?? `HTTP ${resp.status}`);
      }

      setPhase("analyzing");
      const data = await resp.json();
      setResultSessionId(data.sessionId);
      setPhase("done");
      onComplete?.({ sessionId: data.sessionId });
      router.refresh();
    } catch (err) {
      setPhase("error");
      setError(err instanceof Error ? err.message : "Noe gikk galt");
    }
  }

  const isBusy = phase === "uploading" || phase === "transcribing" || phase === "analyzing";

  return (
    <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6 shadow-card">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-on-surface tracking-tight">Last opp coaching-økt</h3>
        <p className="text-sm text-on-surface-variant mt-1">
          {studentName
            ? `Last opp lydopptak fra økten med ${studentName}. Valgfritt: legg ved et TrackMan-skjermbilde for bedre kontekst.`
            : "Last opp lydopptak fra økten. Valgfritt: legg ved et TrackMan-skjermbilde for bedre kontekst."}
        </p>
      </div>

      <div className="space-y-3">
        <input
          ref={audioRef}
          type="file"
          accept=".m4a,.mp3,.wav,.webm,.mp4,.ogg,audio/*"
          capture="user"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          onClick={handlePickAudio}
          disabled={isBusy}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl border-2 border-dashed p-4 text-left transition-colors",
            file
              ? "border-primary bg-primary/5"
              : "border-outline-variant/50 hover:border-primary/50 hover:bg-surface-container-low",
            isBusy && "opacity-60 cursor-not-allowed",
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-on-primary shrink-0">
            <Icon name="mic" size={20} filled />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-on-surface truncate">
              {file?.name ?? "Velg lydfil (.m4a, .mp3, .wav)"}
            </div>
            <div className="text-xs text-on-surface-variant">
              {file
                ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
                : "Maks 25 MB — Whisper-grense"}
            </div>
          </div>
          <Icon name="upload" size={18} className="text-on-surface-variant" />
        </button>

        <TrackmanImagePicker
          image={trackmanImage}
          onChange={setTrackmanImage}
          disabled={isBusy}
        />
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          {phase !== "idle" && (
            <div className="flex items-center gap-2 text-sm">
              {phase === "done" ? (
                <Icon name="check_circle" size={16} className="text-primary" filled />
              ) : phase === "error" ? (
                <Icon name="error" size={16} className="text-error" filled />
              ) : (
                <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
              )}
              <span className="text-on-surface-variant truncate">{PHASE_LABEL[phase]}</span>
            </div>
          )}
          {error && (
            <div className="text-xs text-error mt-1">{error}</div>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!file || isBusy}
          isLoading={isBusy}
          variant="primary"
        >
          {phase === "done" ? "Last opp ny" : "Generer sammendrag"}
        </Button>
      </div>

      {resultSessionId && phase === "done" && (
        <div className="mt-4 rounded-xl bg-primary/10 border border-primary/20 p-3 text-sm text-on-surface">
          Sammendraget er lagret som utkast. Gå til fanen &quot;Sammendrag&quot; for å redigere og publisere til eleven.
        </div>
      )}
    </div>
  );
}

function TrackmanImagePicker({
  image,
  onChange,
  disabled,
}: {
  image: File | null;
  onChange: (f: File | null) => void;
  disabled: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      <button
        onClick={() => ref.current?.click()}
        disabled={disabled}
        className={cn(
          "w-full flex items-center gap-3 rounded-xl border border-outline-variant/50 p-3 text-left transition-colors",
          image ? "bg-secondary-fixed/10 border-secondary-fixed/30" : "hover:bg-surface-container-low",
          disabled && "opacity-60 cursor-not-allowed",
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container shrink-0">
          <Icon name="image" size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-on-surface truncate">
            {image ? image.name : "TrackMan-skjermbilde (valgfritt)"}
          </div>
          <div className="text-xs text-on-surface-variant">
            {image
              ? `${(image.size / 1024).toFixed(0)} KB - Claude Vision parser dataene`
              : "Last opp screenshot for mer presis analyse"}
          </div>
        </div>
        {image && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="text-on-surface-variant hover:text-error p-1"
            aria-label="Fjern bilde"
          >
            <Icon name="close" size={16} />
          </button>
        )}
      </button>
    </>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // strip "data:image/png;base64," prefix
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
