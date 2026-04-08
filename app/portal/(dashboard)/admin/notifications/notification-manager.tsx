"use client";

import { useState, useEffect } from "react";
import { Send, Users, Bell, Loader2, CheckCircle } from "lucide-react";

interface PushStats {
  totalSubscriptions: number;
  uniqueUsers: number;
}

export function NotificationManager() {
  const [stats, setStats] = useState<PushStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body: "",
    url: "/portal",
    broadcast: false,
  });

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/portal/admin/push");
      if (res.ok) {
        const data = await res.json();
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
      const res = await fetch("/api/portal/admin/push", {
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
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl p-5 bg-[var(--color-grey-100)] border border-[var(--color-grey-200)]">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-[var(--color-grey-500)]" />
            <span className="text-sm text-[var(--color-grey-500)]">Push-abonnementer</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-grey-900)]">
            {stats?.totalSubscriptions ?? "—"}
          </p>
        </div>
        <div className="rounded-2xl p-5 bg-[var(--color-grey-100)] border border-[var(--color-grey-200)]">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[var(--color-grey-500)]" />
            <span className="text-sm text-[var(--color-grey-500)]">Unike brukere</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-grey-900)]">
            {stats?.uniqueUsers ?? "—"}
          </p>
        </div>
      </div>

      {/* Send form */}
      <form onSubmit={handleSubmit} className="rounded-2xl p-6 bg-white border border-[var(--color-grey-200)]">
        <h2 className="text-lg font-semibold text-[var(--color-grey-900)] mb-4">
          Send notifikasjon
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-grey-700)] mb-1">
              Tittel
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="F.eks. Ny funksjon tilgjengelig!"
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-grey-200)] focus:border-[var(--color-brand)] focus:outline-none text-[var(--color-grey-900)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-grey-700)] mb-1">
              Melding
            </label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Skriv din melding her..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-grey-200)] focus:border-[var(--color-brand)] focus:outline-none text-[var(--color-grey-900)] resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-grey-700)] mb-1">
              Lenke (valgfritt)
            </label>
            <input
              type="text"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="/portal"
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-grey-200)] focus:border-[var(--color-brand)] focus:outline-none text-[var(--color-grey-900)]"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.broadcast}
              onChange={(e) => setForm({ ...form, broadcast: e.target.checked })}
              className="w-4 h-4 rounded border-[var(--color-grey-300)] text-[var(--color-brand)] focus:ring-[var(--color-brand)]"
            />
            <span className="text-sm text-[var(--color-grey-700)]">
              Send til alle brukere (broadcast)
            </span>
          </label>

          <button
            type="submit"
            disabled={isSending || !form.title || !form.body}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-grey-900)] text-white font-semibold hover:bg-[var(--color-grey-800)] transition-colors disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sender...
              </>
            ) : sent ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Sendt!
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send notifikasjon
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
