import type { ReactNode } from "react";

interface McEmptyProps {
  title?: string;
  body?: string;
  children?: ReactNode;
}

export function McEmpty({
  title = "Ingen data",
  body = "Det finnes ingen oppføringer å vise ennå.",
  children,
}: McEmptyProps) {
  return (
    <div
      className="rounded-2xl p-10 text-center"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
        style={{ color: "#D1F843" }}
      >
        / {title.toUpperCase()}
      </div>
      <p className="m-0 text-[14px] text-white/55 max-w-md mx-auto">{body}</p>
      {children}
    </div>
  );
}
