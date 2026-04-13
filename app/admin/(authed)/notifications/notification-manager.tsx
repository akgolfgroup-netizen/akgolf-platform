"use client";

import { useState, useEffect } from "react";
import { Send, Users, Bell, Loader2, CheckCircle } from "lucide-react";
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminStatCard,
} from "@/components/portal/mission-control/ui";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AdminStatCard
          label="Push-abonnementer"
          value={stats?.totalSubscriptions ?? "—"}
          icon={<Bell className="w-5 h-5" />}
        />
        <AdminStatCard
          label="Unike brukere"
          value={stats?.uniqueUsers ?? "—"}
          icon={<Users className="w-5 h-5" />}
        />
      </div>

      {/* Send form */}
      <AdminCard>
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
              className="w-4 h-4 rounded border-[#D5DFDB] text-[#0A1F18] focus:ring-[#0A1F18]"
            />
            <span className="text-sm text-[#0A1F18]">
              Send til alle brukere (broadcast)
            </span>
          </label>

          <AdminButton
            type="submit"
            disabled={isSending || !form.title || !form.body}
            icon={
              sent ? (
                <CheckCircle className="w-4 h-4" />
              ) : isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )
            }
          >
            {isSending ? "Sender..." : sent ? "Sendt!" : "Send notifikasjon"}
          </AdminButton>
        </form>
      </AdminCard>
    </div>
  );
}
