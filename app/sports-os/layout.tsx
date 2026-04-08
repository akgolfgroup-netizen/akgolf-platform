import { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Sidebar } from "@/components/sports-os/sidebar";
import { Header } from "@/components/sports-os/header";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "AK Sports OS | Mission Control",
  description: "Unified sports management and development platform",
};

export default function SportsOSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${dmSans.variable} font-sans min-h-screen bg-[#F5F1E8]`}>
      <div className="flex h-screen">
        {/* Forest Green Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
