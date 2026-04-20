"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui/card";

const LEVELS = ["nasjonal", "regional", "lokal", "internasjonal"] as const;

export function AddTournamentForm() {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [level, setLevel] = useState<"nasjonal" | "regional" | "lokal" | "internasjonal">("nasjonal");
  const [location, setLocation] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !startDate) return;
    setSaving(true);
    await fetch("/api/tournament-planner/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, startDate, level, location, externalUrl }),
    });
    setSaving(false);
    setName("");
    setStartDate("");
    setLocation("");
    setExternalUrl("");
    router.refresh();
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Turneringsnavn *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-sm outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Startdato *</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-sm outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Nivå</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as typeof level)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-sm outline-none focus:border-black"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Sted/bane</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-sm outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Ekstern URL</label>
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-sm outline-none focus:border-black"
            />
          </div>
        </div>
        <Button type="submit" isLoading={saving}>
          Legg til turnering
        </Button>
      </form>
    </Card>
  );
}
