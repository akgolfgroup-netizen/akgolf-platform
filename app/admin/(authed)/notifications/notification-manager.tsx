"use client";

import { Icon } from "@/components/ui/icon";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AdminInput,
  AdminTextarea,
} from "@/components/portal/coach-hq/ui";
import {
  MonoLabel,
  BentoGrid,
  BentoCard,
  GlassPanel,
} from "@/components/portal/patterns";

interface PushStats {
  totalSubscriptions: number;
  uniqueUsers: number;
}

export function NotificationManager() {
  const [stats, setStats] = useState<PushStats | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body: "",
    url: "/portal",
    broadcast: false,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/push");
      if (res.ok) {
        const data: PushStats = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch push stats:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const res = await fetch("/api/admin/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSent(true);
        setForm({ title: "", body: "", url: "/portal", broadcast: false });
        setTimeout(() => setSent(false), 3000);
      }
    } catch (error) {
      console.error("Failed to send push:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <BentoGrid cols={2} gap="md">
        <BentoCard variant="light" padding="md">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <MonoLabel size="xs" uppercase className="text-on-surface-variant block">
                Push-abonnementer
              </MonoLabel>
              <p className="mt-2 text-3xl font-bold text-on-surface tracking-tight tabular-nums">
                {stats?.totalSubscriptions ?? "—"}
              </p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
              <Icon name="notifications" className="w-5 h-5" />
            </div>
          </div>
        </BentoCard>
        <BentoCard variant="light" padding="md">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <MonoLabel size="xs" uppercase className="text-on-surface-variant block">
                Unike brukere
              </MonoLabel>
              <p className="mt-2 text-3xl font-bold text-on-surface tracking-tight tabular-nums">
                {stats?.uniqueUsers ?? "—"}
              </p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
              <Icon name="person" className="w-5 h-5" />
            </div>
          </div>
        </BentoCard>
      </BentoGrid>

      {/* Send form */}
      <GlassPanel variant="light" padding="md">
        <h2 className="admin-section-title mb-5">Send notifikasjon</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AdminInput
            label="Tittel"
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="F.eks. Ny funksjon tilgjengelig!"
            required
          />

          <AdminTextarea
            label="Melding"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="Skriv din melding her..."
            rows={3}
            required
          />

          <AdminInput
            label="Lenke (valgfritt)"
            type="text"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="/portal"
            helper="Hvor brukeren sendes når de klikker på notifikasjonen"
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.broadcast}
              onChange={(e) =>
                setForm({ ...form, broadcast: e.target.checked })
              }
              className="w-4 h-4 rounded border-outline-variant/30 text-on-surface focus:ring-on-surface"
            />
            <span className="text-sm text-on-surface">
              Send til alle brukere (broadcast)
            </span>
          </label>

          <Button
            type="submit"
            disabled={isSending || !form.title || !form.body}
            isLoading={isSending}
          >
            {sent ? (
              <Icon name="check_circle" className="w-4 h-4" />
            ) : isSending ? (
              <Icon name="progress_activity" className="w-4 h-4 animate-spin" />
            ) : (
              <Icon name="send" className="w-4 h-4" />
            )}
            {isSending ? "Sender..." : sent ? "Sendt!" : "Send notifikasjon"}
          </Button>
        </form>
      </GlassPanel>
    </div>
  );
}
