"use client";


import { Icon } from "@/components/ui/icon";
import { useMemo, useState, useTransition } from "react";

import Link from "next/link";
import { UserRole, type Capability } from "@prisma/client";
import { Button, Badge } from "@/components/ui";
import {
  inviteTeamMember,
  updateUserRole,
  updateUserCapabilities,
  deactivateUser,
  reactivateUser,
  type TeamMemberRow,
} from "./actions";
import { UserDialog, type UserDialogValues } from "./components/user-dialog";
import { SensitiveAuthPrompt } from "./components/sensitive-auth-prompt";

interface PresetSummary {
  id: string;
  label: string;
  description: string;
  capabilityCount: number;
}

interface TeamClientProps {
  initialMembers: TeamMemberRow[];
  presets: PresetSummary[];
  permissions: {
    canAssignCapabilities: boolean;
    canAssignRole: boolean;
    canDeactivate: boolean;
  };
}

const ROLE_LABEL: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Admin",
  [UserRole.INSTRUCTOR]: "Trener",
  [UserRole.STUDENT]: "Spiller",
  [UserRole.INVITED]: "Invitert",
  [UserRole.PARENT]: "Forelder",
};

const ROLE_VARIANT: Record<UserRole, "success" | "muted" | "warning"> = {
  [UserRole.ADMIN]: "success",
  [UserRole.INSTRUCTOR]: "success",
  [UserRole.STUDENT]: "muted",
  [UserRole.INVITED]: "warning",
  [UserRole.PARENT]: "muted",
};

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function TeamClient({
  initialMembers,
  presets,
  permissions,
}: TeamClientProps) {
  const [members] = useState(initialMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMemberRow | null>(null);
  const [pending, startTransition] = useTransition();
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [sensitivePrompt, setSensitivePrompt] = useState<null | (() => Promise<void> | void)>(null);

  async function runSensitive<T>(fn: () => Promise<T>): Promise<T | undefined> {
    try {
      return await fn();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("Bekreft identiteten")) {
        return new Promise((resolve) => {
          setSensitivePrompt(() => async () => {
            try {
              const result = await fn();
              resolve(result);
            } catch (retryErr) {
              resolve(undefined);
              throw retryErr;
            }
          });
        });
      }
      throw err;
    }
  }

  const filtered = useMemo(() => {
    if (roleFilter === "all") return members;
    return members.filter((m) => m.role === roleFilter);
  }, [members, roleFilter]);

  async function handleInvite(values: UserDialogValues) {
    await runSensitive(() =>
      inviteTeamMember({
        email: values.email,
        name: values.name,
        role: values.role,
        capabilities: values.capabilities,
        presetId: values.presetId === "custom" ? undefined : values.presetId,
      })
    );
  }

  async function handleEdit(values: UserDialogValues) {
    if (!editing) return;
    if (values.role !== editing.role && permissions.canAssignRole) {
      await runSensitive(() =>
        updateUserRole({ userId: editing.id, role: values.role })
      );
    }
    if (permissions.canAssignCapabilities) {
      await runSensitive(() =>
        updateUserCapabilities({
          userId: editing.id,
          capabilities: values.capabilities,
          reason:
            values.presetId !== "custom"
              ? `Preset: ${values.presetId}`
              : "Manuell endring",
        })
      );
    }
  }

  function toggleActivation(member: TeamMemberRow) {
    startTransition(async () => {
      if (member.isActive) {
        await deactivateUser({ userId: member.id });
      } else {
        await reactivateUser({ userId: member.id });
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Brand V2 page header — d23 mockup */}
      <div className="flex items-end justify-between border-b border-line pb-5">
        <div>
          <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-primary">
            / MENNESKER · TEAM
          </div>
          <h1 className="mt-2 font-inter-tight text-[28px] font-bold leading-tight tracking-tight text-ink">
            Team og tilgang.
          </h1>
          <p className="mt-1.5 max-w-2xl text-[13px] text-ink-muted">
            Oversikt over admin-brukere, roller og kapabiliteter. Huke av
            hvilke funksjoner hver enkelt har tilgang til.
          </p>
        </div>
        {permissions.canAssignCapabilities && (
          <div className="flex items-center gap-2">
            <Link
              href="/admin/team/audit"
              className="inline-flex items-center gap-1.5 text-[13px] text-primary hover:underline"
            >
              <Icon name="assignment" className="h-4 w-4" />
              Audit-logg
            </Link>
            <Button onClick={() => setInviteOpen(true)}>
              <Icon name="person_add" className="h-4 w-4" />
              Inviter bruker
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 rounded-[10px] bg-[var(--color-surface-container)] p-[3px] w-fit">
        {(
          [
            { id: "all", label: "Alle" },
            { id: UserRole.ADMIN, label: "Admin" },
            { id: UserRole.INSTRUCTOR, label: "Trenere" },
            { id: UserRole.INVITED, label: "Invitert" },
          ] as const
        ).map((o) => (
          <button
            key={o.id}
            onClick={() => setRoleFilter(o.id)}
            className={`rounded-[7px] px-3 py-1.5 text-[13px] font-medium transition-colors ${
              roleFilter === o.id
                ? "bg-[var(--color-primary)] text-surface"
                : "text-[var(--color-outline)] hover:text-[var(--color-on-surface-variant)]"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-outline-variant)]">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-outline)]">
                Navn
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-outline)]">
                E-post
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-outline)]">
                Rolle
              </th>
              <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-outline)]">
                Kapabiliteter
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-outline)]">
                Sist aktiv
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-outline)]">
                Status
              </th>
              <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-outline)]">
                Handlinger
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-[var(--color-outline)]"
                >
                  Ingen brukere i valgt filter.
                </td>
              </tr>
            )}
            {filtered.map((m) => (
              <tr
                key={m.id}
                className="border-b border-[var(--color-outline-variant)] last:border-0 hover:bg-[var(--color-surface-container)] transition-colors"
              >
                <td className="px-6 py-3 text-sm font-medium text-[var(--color-on-surface)]">
                  {m.name ?? "—"}
                </td>
                <td className="px-6 py-3 text-sm text-[var(--color-on-surface-variant)]">
                  {m.email ?? "—"}
                </td>
                <td className="px-6 py-3">
                  <Badge variant={ROLE_VARIANT[m.role]}>
                    {ROLE_LABEL[m.role]}
                  </Badge>
                </td>
                <td className="px-6 py-3 text-right text-sm tabular-nums text-[var(--color-on-surface-variant)]">
                  {m.capabilityCount}
                </td>
                <td className="px-6 py-3 text-sm text-[var(--color-on-surface-variant)]">
                  {formatDate(m.lastActiveAt)}
                </td>
                <td className="px-6 py-3">
                  <Badge variant={m.isActive ? "success" : "muted"}>
                    {m.isActive ? "Aktiv" : "Inaktiv"}
                  </Badge>
                </td>
                <td className="px-6 py-3">
                  <div className="flex justify-end gap-2">
                    {permissions.canAssignCapabilities && (
                      <button
                        onClick={() => setEditing(m)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-outline-variant)] px-2.5 py-1 text-xs font-medium text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]"
                      >
                        <Icon name="edit" className="h-3.5 w-3.5" />
                        Rediger
                      </button>
                    )}
                    {permissions.canDeactivate && (
                      <button
                        onClick={() => toggleActivation(m)}
                        disabled={pending}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-outline-variant)] px-2.5 py-1 text-xs font-medium text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] disabled:opacity-50"
                      >
                        {m.isActive ? (
                          <>
                            <Icon name="power_off" className="h-3.5 w-3.5" />
                            Deaktiver
                          </>
                        ) : (
                          <>
                            <Icon name="power" className="h-3.5 w-3.5" />
                            Aktiver
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)] p-5">
        <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mb-3">
          Tilgjengelige preset-maler
        </h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {presets.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border border-[var(--color-outline-variant)] p-3"
            >
              <div className="text-sm font-medium text-[var(--color-on-surface)]">
                {p.label}
              </div>
              <div className="mt-1 text-[11px] text-[var(--color-outline)]">
                {p.description}
              </div>
              <div className="mt-2 text-[11px] font-medium tabular-nums text-[var(--color-primary)]">
                {p.capabilityCount} kapabiliteter
              </div>
            </div>
          ))}
        </div>
      </div>

      <UserDialog
        mode="create"
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSubmit={handleInvite}
        canAssignCapabilities={permissions.canAssignCapabilities}
        canAssignRole={permissions.canAssignRole}
      />

      <UserDialog
        mode="edit"
        open={editing !== null}
        onClose={() => setEditing(null)}
        onSubmit={handleEdit}
        initialValues={
          editing
            ? {
                email: editing.email ?? "",
                name: editing.name ?? "",
                role: editing.role,
                presetId: "custom",
                capabilities: editing.capabilities as Capability[],
              }
            : undefined
        }
        canAssignCapabilities={permissions.canAssignCapabilities}
        canAssignRole={permissions.canAssignRole}
      />

      <SensitiveAuthPrompt
        open={sensitivePrompt !== null}
        onClose={() => setSensitivePrompt(null)}
        onConfirmed={() => {
          const pending = sensitivePrompt;
          setSensitivePrompt(null);
          if (pending) void pending();
        }}
      />
    </div>
  );
}
