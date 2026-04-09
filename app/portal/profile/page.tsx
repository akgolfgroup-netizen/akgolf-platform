"use client";

import { User, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#f7f3ea] p-6">
      <h1 className="text-3xl font-bold text-[#154212] mb-6">Min Profil</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-[#154212]/10 text-center">
          <div className="w-24 h-24 bg-[#154212] rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-[#d2f000]" />
          </div>
          <h2 className="text-xl font-bold text-[#154212]">Ola Nordmann</h2>
        </Card>
        <Card className="p-6 bg-white border-[#154212]/10 md:col-span-2">
          <h3 className="font-bold text-[#154212] mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#d2f000]" />
            Statistikk
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-[#f7f3ea] rounded-xl">
              <p className="text-3xl font-bold text-[#154212]">14.2</p>
              <p className="text-sm text-[#666666]">Handicap</p>
            </div>
            <div className="text-center p-4 bg-[#f7f3ea] rounded-xl">
              <p className="text-3xl font-bold text-[#154212]">24</p>
              <p className="text-sm text-[#666666]">Sessions</p>
            </div>
            <div className="text-center p-4 bg-[#f7f3ea] rounded-xl">
              <p className="text-3xl font-bold text-[#154212]">76</p>
              <p className="text-sm text-[#666666]">Best score</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
