import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { TopBar } from "@/components/booking-v2/TopBar";
import "./booking-v2.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Booking — AK Golf (V2)",
  robots: { index: false, follow: false },
};

export default function BookingV2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${fraunces.variable} booking-v2-root`} style={{ fontFamily: "var(--body)" }}>
      <div className="shell">
        <TopBar />
        {children}
      </div>
    </div>
  );
}
