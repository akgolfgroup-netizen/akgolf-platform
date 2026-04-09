"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f7f3ea] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-white border-[#154212]/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#154212] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-[#d2f000]" />
            </div>
            <h1 className="text-2xl font-bold text-[#154212]">AK Golf Academy</h1>
            <p className="text-[#666666]">Logg inn på din konto</p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#154212] mb-1">E-post</label>
              <input
                type="email"
                placeholder="coach@akgolf.no"
                className="w-full px-4 py-3 bg-[#f7f3ea] border border-[#154212]/10 rounded-xl text-[#154212] focus:outline-none focus:ring-2 focus:ring-[#d2f000]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#154212] mb-1">Passord</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#f7f3ea] border border-[#154212]/10 rounded-xl text-[#154212] focus:outline-none focus:ring-2 focus:ring-[#d2f000]"
              />
            </div>
            <Button className="w-full bg-[#154212] hover:bg-[#0f3d0a] text-white font-bold py-3 rounded-xl">
              Logg inn
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-[#154212] hover:underline text-sm">Glemt passord?</a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
