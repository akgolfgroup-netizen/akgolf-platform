import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AK Golf Academy",
  description: "Premium golfcoaching for ambisiøse spillere. Individuell coaching, juniorakademi og teknologiløsninger.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
