import { Providers } from "@/components/portal/providers";

export const dynamic = "force-dynamic";

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
    <div className="min-h-screen bg-surface">
      <Providers>
        {children}
      </Providers>
    </div>
  );
}
