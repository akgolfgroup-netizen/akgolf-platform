"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadAvatar } from "@/app/portal/(dashboard)/profil/actions";
import { Camera } from "lucide-react";

interface AvatarUploadProps {
  currentImage?: string | null;
  name?: string | null;
}

export function AvatarUpload({ currentImage, name }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Cleanup object URL ved unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);

    // Revoke gammel preview-URL for å unngå memory leak
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    // Vis lokal preview umiddelbart
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setPreview(objectUrl);

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const serverUrl = await uploadAvatar(fd);

      // Erstatt object URL med server-URL og frigjør minne
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setPreview(serverUrl);
    } catch {
      // Upload feilet — fjern preview og vis feilmelding
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setPreview(currentImage ?? null);
      setError("Kunne ikke laste opp bilde. Prøv igjen.");
    } finally {
      setUploading(false);
    }
  }, [currentImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div
      {...getRootProps()}
      className="relative w-24 h-24 flex-shrink-0 cursor-pointer group"
    >
      <input {...getInputProps()} />
      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[var(--color-grey-200)] group-hover:border-[var(--color-grey-900)] transition-colors">
        {preview ? (
          <img src={preview} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[var(--color-grey-100)] flex items-center justify-center text-2xl font-bold text-[var(--color-grey-900)]">
            {initials}
          </div>
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
        {uploading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Camera className="w-5 h-5 text-white" />
        )}
      </div>

      {isDragActive && (
        <div className="absolute inset-0 rounded-2xl border-2 border-[var(--color-grey-900)] bg-[var(--color-grey-900)]/10 flex items-center justify-center">
          <Camera className="w-5 h-5 text-[var(--color-grey-900)]" />
        </div>
      )}

      {error && (
        <p className="absolute -bottom-6 left-0 right-0 text-center text-xs text-[var(--color-error)]">
          {error}
        </p>
      )}
    </div>
  );
}
