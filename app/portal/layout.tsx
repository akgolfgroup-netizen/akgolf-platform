import "./globals.css";
import { Providers } from "@/components/portal/providers";

export const metadata = {
  title: "AK Golf Portal",
  description: "Spillerportal for AK Golf Academy",
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-deep-ink)] to-[#0D2137]">
      <Providers>
        {children}
      </Providers>
    </div>
  );
}
