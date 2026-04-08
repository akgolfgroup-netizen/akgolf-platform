"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-white border-[#e5e1d8]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#2D5A27] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-[#DFFF00]" />
            </div>
            <h1 className="text-2xl font-bold text-[#333333]">AK Sports OS</h1>
            <p className="text-[#666666]">Sign in to your account</p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">Email</label>
              <input
                type="email"
                placeholder="coach@akgolf.no"
                className="w-full px-4 py-3 bg-[#F5F1E8] border border-[#e5e1d8] rounded-xl text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#DFFF00]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#F5F1E8] border border-[#e5e1d8] rounded-xl text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#DFFF00]"
              />
            </div>
            <Button className="w-full bg-[#2D5A27] hover:bg-[#1a3d16] text-[#F5F1E8] font-bold py-3 rounded-xl">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-[#2D5A27] hover:underline text-sm">Forgot password?</a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
