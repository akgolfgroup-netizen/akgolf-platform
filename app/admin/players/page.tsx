"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const players = [
  { name: "Ola Nordmann", handicap: 14.2, status: "green" },
  { name: "Kari Hansen", handicap: 18.5, status: "yellow" },
  { name: "Per Olsen", handicap: 12.1, status: "green" },
];

export default function AdminPlayers() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] p-6">
      <h1 className="text-3xl font-bold text-[#333333] mb-6">Spillere</h1>
      <Input placeholder="Søk etter spiller..." className="mb-6 bg-white border-[#e5e1d8]" />
      <div className="space-y-4">
        {players.map((player) => (
          <Card key={player.name} className="p-4 bg-white border-[#e5e1d8] flex items-center justify-between">
            <div>
              <p className="font-bold text-[#333333]">{player.name}</p>
              <p className="text-sm text-[#666666]">HCP: {player.handicap}</p>
            </div>
            <span className={`w-3 h-3 rounded-full ${player.status === "green" ? "bg-[#2D5A27]" : "bg-[#DFFF00]"}`} />
          </Card>
        ))}
      </div>
    </div>
  );
}
