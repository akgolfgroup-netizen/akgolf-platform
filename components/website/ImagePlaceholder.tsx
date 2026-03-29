import Image from "next/image";

export function ImagePlaceholder({
  aspect = "4/3",
  label,
  className = "",
  src,
  alt,
}: {
  aspect?: string;
  label?: string;
  className?: string;
  src?: string;
  alt?: string;
}) {
  // Real image — render at full aspect ratio
  if (src) {
    return (
      <div
        className={`relative overflow-hidden rounded-[20px] ${className}`}
        style={{ aspectRatio: aspect }}
      >
        <Image
          src={src}
          alt={alt || label || ""}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );
  }

  // Placeholder — compact version until real images are added
  return (
    <div
      className={`relative overflow-hidden rounded-[20px] ${className}`}
    >
      <div className="flex items-center gap-4 px-6 py-5 bg-grey-100 border border-grey-200">
        <div className="w-10 h-10 rounded-xl bg-grey-200 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-grey-400">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <div>
          {label && (
            <span className="font-mono text-[10px] tracking-wider uppercase text-grey-500 block">
              {label}
            </span>
          )}
          <span className="text-[10px] text-grey-400">Bilde kommer</span>
        </div>
      </div>
    </div>
  );
}
