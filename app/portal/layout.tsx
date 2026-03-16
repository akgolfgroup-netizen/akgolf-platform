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
    <Providers>
      {children}
    </Providers>
  );
}
