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
    <div className="min-h-screen bg-gradient-to-b from-[white] to-[var(--color-grey-100)]">
      <Providers>
        {children}
      </Providers>
    </div>
  );
}
