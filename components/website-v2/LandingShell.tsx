import type { ReactNode } from "react";
import { WebNav } from "./web-nav";
import { WebFooter } from "./web-footer";

interface LandingShellProps {
  children: ReactNode;
  active?: "home" | "academy" | "junior" | "pricing";
}

export function LandingShell({ children, active = "home" }: LandingShellProps) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--color-surface)",
        color: "var(--color-ink)",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      <WebNav active={active} />
      <main>{children}</main>
      <WebFooter />
    </div>
  );
}
