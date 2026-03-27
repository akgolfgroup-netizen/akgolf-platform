import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coach Hub | AK Golf",
  description: "Intern dashboard for AK Golf trenere",
};

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
