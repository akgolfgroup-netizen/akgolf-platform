"use client";

import { User, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] p-6">
      <h1 className="text-3xl font-bold text-[#333333] mb-6">Min Profil</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-[#e5e1d8] text-center">
          <div className="w-24 h-24 bg-[#2D5A27] rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-[#DFFF00]" />
          </div>
          <h2 className="text-xl font-bold text-[#333333]">Ola Nordmann</h2>
        </Card>
        <Card className="p-6 bg-white border-[#e5e1d8] md:col-span-2">
          <h3 className="font-bold text-[#333333] mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#DFFF00]" />
            Statistikk
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-[#F5F1E8] rounded-xl">
              <p className="text-3xl font-bold text-[#2D5A27]">14.2</p>
              <p className="text-sm text-[#666666]">Handicap</p>
            </div>
            <div className="text-center p-4 bg-[#F5F1E8] rounded-xl">
              <p className="text-3xl font-bold text-[#2D5A27]">24</p>
              <p className="text-sm text-[#666666]">Sessions</p>
            </div>
            <div className="text-center p-4 bg-[#F5F1E8] rounded-xl">
              <p className="text-3xl font-bold text-[#2D5A27]">76</p>
              <p className="text-sm text-[#666666]">Best score</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
