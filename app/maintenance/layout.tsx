import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vedlikehold | AK Golf Academy",
  description: "Vi oppgraderer systemene våre for å gi deg en bedre opplevelse.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
