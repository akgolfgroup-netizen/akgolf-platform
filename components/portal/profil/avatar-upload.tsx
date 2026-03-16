"use client";

import { useCallback, useState } from "react";
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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setUploading(true);
    const fd = new FormData();
    fd.append("avatar", file);
    await uploadAvatar(fd);
    setUploading(false);
  }, []);

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
      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[var(--color-border)] group-hover:border-[var(--color-gold)] transition-colors">
        {preview ? (
          <img src={preview} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[var(--color-bg)] flex items-center justify-center text-2xl font-bold text-[var(--color-gold)]">
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
        <div className="absolute inset-0 rounded-2xl border-2 border-[var(--color-gold)] bg-[var(--color-gold)]/10 flex items-center justify-center">
          <Camera className="w-5 h-5 text-[var(--color-gold)]" />
        </div>
      )}
    </div>
  );
}
