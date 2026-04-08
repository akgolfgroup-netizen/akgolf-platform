"use client";

import { Card } from "@/components/ui/card";

export default function AdminReports() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] p-6">
      <h1 className="text-3xl font-bold text-[#333333] mb-6">Rapporter</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-[#e5e1d8]">
          <p className="text-sm text-[#666666]">Månedlig omsetning</p>
          <p className="text-4xl font-bold text-[#2D5A27]">kr 124,500</p>
          <p className="text-sm text-[#2D5A27]">+12% fra forrige måned</p>
        </Card>
        <Card className="p-6 bg-white border-[#e5e1d8]">
          <p className="text-sm text-[#666666]">Antall sessions</p>
          <p className="text-4xl font-bold text-[#2D5A27]">87</p>
          <p className="text-sm text-[#2D5A27]">+5% fra forrige måned</p>
        </Card>
        <Card className="p-6 bg-white border-[#e5e1d8]">
          <p className="text-sm text-[#666666]">Aktive spillere</p>
          <p className="text-4xl font-bold text-[#2D5A27]">42</p>
          <p className="text-sm text-[#2D5A27]">+3 nye denne måned</p>
        </Card>
      </div>
    </div>
  );
}
