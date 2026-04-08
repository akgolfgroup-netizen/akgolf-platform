/**
 * AK Sports OS — Heritage Tech Layout
 * "Luxury meets Precision"
 * 
 * Typography:
 * - Headlines: Playfair Display (Heritage serif)
 * - Body/UI: Inter (Technical precision)
 * 
 * Color Palette: "Heritage Grid"
 * - Deep Moss Green #2D5A27
 * - Electric Lime #DFFF00
 * - Warm Cream #F5F1E8
 */

import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";

// Technical sans-serif for UI
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

// Heritage serif for headlines
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AK Sports OS | Heritage meets Precision",
  description: "Norges ledende idretts- og utviklingsplattform. Tre pilarer: Academy, Wang Hub, Facility OS — forenet i én skalerbar infrastruktur.",
  keywords: ["sports platform", "coaching", "academy", "Norway", "Wang Toppidrett", "idrettsteknologi", "AK Sports"],
  openGraph: {
    title: "AK Sports OS",
    description: "Heritage meets Precision — Norges ledende idrettsplattform",
    type: "website",
  },
};

export default function HeritageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" className={`${inter.variable} ${playfair.variable} dark`}>
      <body className="font-sans antialiased bg-[#0A0D0A] text-[#F5F1E8]">
        {children}
      </body>
    </html>
  );
}
