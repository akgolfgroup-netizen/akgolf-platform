"use client";



import { Icon } from "@/components/ui/icon";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";

export default function Profile() {
  return (
    <div className="min-h-screen bg-surface p-6">
      <h1 className="text-3xl font-bold text-on-surface mb-6">Min Profil</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <PremiumCard className="p-6 text-center">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="person" className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-bold text-on-surface">Ola Nordmann</h2>
        </PremiumCard>
        <PremiumCard className="p-6 md:col-span-2">
          <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
            <Icon name="emoji_events" className="w-5 h-5 text-accent-cta" />
            Statistikk
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-surface-container rounded-xl">
              <p className="text-3xl font-bold text-on-surface tabular-nums">14.2</p>
              <p className="text-sm text-on-surface-variant">Handicap</p>
            </div>
            <div className="text-center p-4 bg-surface-container rounded-xl">
              <p className="text-3xl font-bold text-on-surface tabular-nums">24</p>
              <p className="text-sm text-on-surface-variant">Sessions</p>
            </div>
            <div className="text-center p-4 bg-surface-container rounded-xl">
              <p className="text-3xl font-bold text-on-surface tabular-nums">76</p>
              <p className="text-sm text-on-surface-variant">Best score</p>
            </div>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
