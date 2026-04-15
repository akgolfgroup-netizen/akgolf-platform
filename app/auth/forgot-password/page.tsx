"use client";

import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-background-beige flex items-center justify-center p-4">
      <Card className="p-8 bg-white border-primary/10 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-accent-cta" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Glemt passord</h1>
        </div>
        <form className="space-y-4">
          <input type="email" placeholder="din@email.com" className="w-full px-4 py-3 bg-background-beige border border-primary/10 rounded-xl" />
          <Button className="w-full bg-primary text-white font-bold">Send reset-lenke</Button>
        </form>
      </Card>
    </div>
  );
}
