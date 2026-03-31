"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Link2,
  Save,
  Loader2,
  Mail,
  Calendar,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updateProfile, updateNotifications } from "./actions";

interface Settings {
  profile: {
    name: string;
    email: string;
    phone: string;
    bio: string;
  };
  notifications: {
    emailNewBooking: boolean;
    emailCancellation: boolean;
    emailReminder: boolean;
    pushEnabled: boolean;
  };
  integrations: {
    googleCalendar: boolean;
    outlook: boolean;
  };
}

interface SettingsClientProps {
  initialSettings: Settings;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<
    "profile" | "notifications" | "integrations"
  >("profile");
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleProfileChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
  };

  const handleNotificationToggle = (field: string) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field as keyof typeof prev.notifications],
      },
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    const result = await updateProfile(settings.profile);
    setIsSaving(false);
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    const result = await updateNotifications(settings.notifications);
    setIsSaving(false);
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const tabs = [
    { id: "profile" as const, label: "Profil", icon: User },
    { id: "notifications" as const, label: "Varsler", icon: Bell },
    { id: "integrations" as const, label: "Integrasjoner", icon: Link2 },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--color-grey-200)] pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-[var(--color-black)] text-white"
                : "bg-white border border-[var(--color-grey-200)] text-[var(--color-grey-400)] hover:text-[var(--color-grey-900)]"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="bg-white border border-[var(--color-grey-200)] rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-grey-400)] mb-2">
                Navn
              </label>
              <input
                type="text"
                value={settings.profile.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                className="w-full px-4 py-3 bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] rounded-lg text-[var(--color-grey-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-400)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-grey-400)] mb-2">
                E-post
              </label>
              <input
                type="email"
                value={settings.profile.email}
                disabled
                className="w-full px-4 py-3 bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] rounded-lg text-[var(--color-grey-500)] cursor-not-allowed"
              />
              <p className="text-xs text-[var(--color-grey-500)] mt-1">
                E-post kan ikke endres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-grey-400)] mb-2">
                Telefon
              </label>
              <input
                type="tel"
                value={settings.profile.phone}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
                className="w-full px-4 py-3 bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] rounded-lg text-[var(--color-grey-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-400)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-grey-400)] mb-2">
                Bio
              </label>
              <textarea
                value={settings.profile.bio}
                onChange={(e) => handleProfileChange("bio", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] rounded-lg text-[var(--color-grey-900)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-400)]"
                placeholder="Kort beskrivelse av deg selv..."
              />
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-black)] hover:bg-[var(--color-grey-900)] disabled:opacity-50 rounded-lg font-medium text-white transition-colors"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saveSuccess ? (
              <span className="text-green-600">Lagret!</span>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Lagre endringer
              </>
            )}
          </button>
        </div>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="bg-white border border-[var(--color-grey-200)] rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-[var(--color-grey-900)] flex items-center gap-2">
              <Mail className="h-5 w-5" />
              E-postvarsler
            </h3>

            <div className="space-y-3">
              <ToggleItem
                label="Nye bookinger"
                description="Motta varsel nar noen booker en time"
                checked={settings.notifications.emailNewBooking}
                onChange={() => handleNotificationToggle("emailNewBooking")}
              />
              <ToggleItem
                label="Kanselleringer"
                description="Motta varsel ved avbestillinger"
                checked={settings.notifications.emailCancellation}
                onChange={() => handleNotificationToggle("emailCancellation")}
              />
              <ToggleItem
                label="Paminnelser"
                description="Daglig oppsummering av kommende okter"
                checked={settings.notifications.emailReminder}
                onChange={() => handleNotificationToggle("emailReminder")}
              />
            </div>
          </div>

          <div className="bg-white border border-[var(--color-grey-200)] rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-[var(--color-grey-900)] flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Push-varsler
            </h3>

            <ToggleItem
              label="Aktiver push-varsler"
              description="Motta varsler pa telefon og nettleser"
              checked={settings.notifications.pushEnabled}
              onChange={() => handleNotificationToggle("pushEnabled")}
            />
          </div>

          <button
            onClick={handleSaveNotifications}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-black)] hover:bg-[var(--color-grey-900)] disabled:opacity-50 rounded-lg font-medium text-white transition-colors"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saveSuccess ? (
              <span className="text-green-600">Lagret!</span>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Lagre innstillinger
              </>
            )}
          </button>
        </div>
      )}

      {/* Integrations */}
      {activeTab === "integrations" && (
        <div className="space-y-6">
          <div className="bg-white border border-[var(--color-grey-200)] rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-[var(--color-grey-900)] flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Kalender-synkronisering
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[var(--color-grey-100)] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center">
                    <svg className="h-6 w-6" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-grey-900)]">Google Kalender</p>
                    <p className="text-sm text-[var(--color-grey-500)]">
                      {settings.integrations.googleCalendar
                        ? "Tilkoblet"
                        : "Ikke tilkoblet"}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-[var(--color-grey-200)] hover:bg-[var(--color-grey-300)] rounded-lg text-sm font-medium text-[var(--color-grey-900)] transition-colors">
                  {settings.integrations.googleCalendar
                    ? "Koble fra"
                    : "Koble til"}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--color-grey-100)] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#0078D4] flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21.75 2.25H2.25A2.25 2.25 0 000 4.5v15a2.25 2.25 0 002.25 2.25h19.5A2.25 2.25 0 0024 19.5v-15a2.25 2.25 0 00-2.25-2.25zM2.25 4.5h9v7.5h-9v-7.5zm0 9h9v6h-9v-6zm10.5 6v-15h9v15h-9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-grey-900)]">Outlook</p>
                    <p className="text-sm text-[var(--color-grey-500)]">
                      {settings.integrations.outlook
                        ? "Tilkoblet"
                        : "Ikke tilkoblet"}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-[var(--color-grey-200)] hover:bg-[var(--color-grey-300)] rounded-lg text-sm font-medium text-[var(--color-grey-900)] transition-colors">
                  {settings.integrations.outlook ? "Koble fra" : "Koble til"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleItem({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-[var(--color-grey-900)]">{label}</p>
        <p className="text-sm text-[var(--color-grey-500)]">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={cn(
          "relative w-12 h-6 rounded-full transition-colors",
          checked ? "bg-[var(--color-black)]" : "bg-[var(--color-grey-200)]"
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
            checked ? "left-7" : "left-1"
          )}
        />
      </button>
    </div>
  );
}
