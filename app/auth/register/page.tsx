"use client";

import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Register() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center p-4">
      <Card className="p-8 bg-white border-[#e5e1d8] max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#2D5A27] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-[#DFFF00]" />
          </div>
          <h1 className="text-2xl font-bold text-[#333333]">Opprett konto</h1>
        </div>
        <form className="space-y-4">
          <input type="text" placeholder="Navn" className="w-full px-4 py-3 bg-[#F5F1E8] border border-[#e5e1d8] rounded-xl" />
          <input type="email" placeholder="E-post" className="w-full px-4 py-3 bg-[#F5F1E8] border border-[#e5e1d8] rounded-xl" />
          <input type="password" placeholder="Passord" className="w-full px-4 py-3 bg-[#F5F1E8] border border-[#e5e1d8] rounded-xl" />
          <Button className="w-full bg-[#2D5A27] text-[#F5F1E8] font-bold">Registrer</Button>
        </form>
      </Card>
    </div>
  );
}
