"use client";

import React, { useState } from "react";
import { Gauge, AlertTriangle, Clock, Settings2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface CapacitySettings {
  maxBookingsPerDay: number;
  bufferMinutes: number;
  enableOverbookingWarning: boolean;
  overbookingThreshold: number;
  autoConfirmThreshold: number;
  requireAdvanceBooking: number; // hours
}

const defaultSettings: CapacitySettings = {
  maxBookingsPerDay: 8,
  bufferMinutes: 10,
  enableOverbookingWarning: true,
  overbookingThreshold: 6,
  autoConfirmThreshold: 2,
  requireAdvanceBooking: 24,
};

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between py-4 px-6 hover:bg-grey-50 transition-colors gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-black">{label}</p>
        {description && <p className="text-xs text-grey-400 mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  unit,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        min={min}
        max={max}
        className={cn(
          "w-16 px-2 py-1.5 rounded-lg border border-grey-200 text-sm font-medium text-center",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        )}
      />
      {unit && <span className="text-sm text-grey-400">{unit}</span>}
    </div>
  );
}

export function CapacityManager() {
  const [settings, setSettings] = useState<CapacitySettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = <K extends keyof CapacitySettings>(
    key: K,
    value: CapacitySettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // TODO: Save to API
    setHasChanges(false);
  };

  const currentUtilization = 5; // Mock: current bookings today
  const utilizationPercentage = (currentUtilization / settings.maxBookingsPerDay) * 100;

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              utilizationPercentage >= 80
                ? "bg-error-light text-error"
                : utilizationPercentage >= 60
                ? "bg-warning-light text-warning"
                : "bg-success-light text-success"
            )}
          >
            <Gauge className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-black">Dagens kapasitet</h3>
            <p className="text-xs text-grey-400">
              {currentUtilization} av {settings.maxBookingsPerDay} bookinger
            </p>
          </div>
          <div className="text-right">
            <span
              className={cn(
                "text-2xl font-bold tabular-nums",
                utilizationPercentage >= 80
                  ? "text-error"
                  : utilizationPercentage >= 60
                  ? "text-warning"
                  : "text-success"
              )}
            >
              {Math.round(utilizationPercentage)}%
            </span>
          </div>
        </div>
        <div className="mt-4 h-2 bg-grey-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500",
              utilizationPercentage >= 80
                ? "bg-error"
                : utilizationPercentage >= 60
                ? "bg-warning"
                : "bg-success"
            )}
            style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
          />
        </div>
        {utilizationPercentage >= 80 && (
          <div className="mt-3 flex items-center gap-2 text-error">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-medium">Høy etterspørsel - vurder å øke kapasitet</span>
          </div>
        )}
      </Card>

      {/* Settings */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-grey-200">
          <div className="flex items-center gap-3">
            <Settings2 className="w-5 h-5 text-grey-400" />
            <h2 className="text-sm font-semibold text-black">Kapasitetsinnstillinger</h2>
          </div>
          {hasChanges && (
            <Button size="sm" onClick={handleSave}>
              Lagre endringer
            </Button>
          )}
        </div>

        <div className="divide-y divide-grey-50">
          <SettingRow
            label="Maks bookinger per dag"
            description="Maksimalt antall bookinger som kan aksepteres per dag"
          >
            <NumberInput
              value={settings.maxBookingsPerDay}
              onChange={(v) => updateSetting("maxBookingsPerDay", v)}
              min={1}
              max={20}
            />
          </SettingRow>

          <SettingRow
            label="Pausetid mellom økter"
            description="Minimum tid mellom bookinger (buffer)"
          >
            <NumberInput
              value={settings.bufferMinutes}
              onChange={(v) => updateSetting("bufferMinutes", v)}
              min={0}
              max={60}
              unit="min"
            />
          </SettingRow>

          <SettingRow
            label="Varsel ved høy etterspørsel"
            description="Få varsel når kapasitet nærmer seg full"
          >
            <Switch
              checked={settings.enableOverbookingWarning}
              onCheckedChange={(v) => updateSetting("enableOverbookingWarning", v)}
            />
          </SettingRow>

          {settings.enableOverbookingWarning && (
            <SettingRow
              label="Varselterskel"
              description="Antall bookinger før varsel sendes"
            >
              <NumberInput
                value={settings.overbookingThreshold}
                onChange={(v) => updateSetting("overbookingThreshold", v)}
                min={1}
                max={settings.maxBookingsPerDay}
              />
            </SettingRow>
          )}

          <SettingRow
            label="Auto-bekreft under terskel"
            description="Automatisk bekreft bookinger under dette antall"
          >
            <NumberInput
              value={settings.autoConfirmThreshold}
              onChange={(v) => updateSetting("autoConfirmThreshold", v)}
              min={0}
              max={5}
            />
          </SettingRow>

          <SettingRow
            label="Påkrevd forhåndsbestilling"
            description="Minimum timer før en booking kan gjøres"
          >
            <NumberInput
              value={settings.requireAdvanceBooking}
              onChange={(v) => updateSetting("requireAdvanceBooking", v)}
              min={0}
              max={168}
              unit="t"
            />
          </SettingRow>
        </div>
      </Card>

      {/* Quick Tips */}
      <Card className="p-5 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-black">Tips</h4>
            <p className="text-xs text-grey-400 mt-1">
              Med 10 minutters pause mellom økter får du tid til å forberede neste elev og 
              dokumentere forrige økt. Ved høy etterspørsel kan du redusere pausen til 5 minutter.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
