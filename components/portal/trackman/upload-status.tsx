"use client";

import Link from "next/link";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

interface UploadStatusProps {
  error: string | null;
  success: { shotsImported: number; confidence: number } | null;
  isImage: boolean;
}

export function UploadStatus({ error, success, isImage }: UploadStatusProps) {
  if (error) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl bg-error-light border border-error/10">
        <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-error">Opplasting feilet</p>
          <p className="text-sm text-error/80 mt-0.5">{error}</p>
          <p className="text-xs text-ink-subtle mt-2">
            Tips: Sjekk at bildet er tydelig og at alle slag-rader er synlige. Prøv å laste opp på nytt, eller bruk CSV-import.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl bg-success-light border border-success/10">
        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-success">
            {success.shotsImported} slag importert
          </p>
          {isImage && (
            <p className="text-xs text-ink-muted mt-0.5">
              Konfidens: {Math.round(success.confidence * 100)}%
            </p>
          )}
          <Link
            href="/portal/trackman"
            className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            Se TrackMan-data <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
