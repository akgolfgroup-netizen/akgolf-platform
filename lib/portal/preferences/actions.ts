"use server";

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { type ScreenId, type ViewId, isValidView } from "@/lib/portal/views/registry";
import type { Prisma } from "@prisma/client";

// ── Typer ────────────────────────────────────────────────

export interface UserPreferencesData {
  defaultViewPerScreen: Record<string, ViewId>;
  dashboardWidgetLayout: Record<string, unknown>;
  hiddenWidgets: string[];
}

// ── Hjelpefunksjoner ─────────────────────────────────────

function parsePreferences(raw: {
  defaultViewPerScreen: unknown;
  dashboardWidgetLayout: unknown;
  hiddenWidgets: unknown;
}): UserPreferencesData {
  return {
    defaultViewPerScreen:
      typeof raw.defaultViewPerScreen === "object" && raw.defaultViewPerScreen !== null
        ? (raw.defaultViewPerScreen as Record<string, ViewId>)
        : {},
    dashboardWidgetLayout:
      typeof raw.dashboardWidgetLayout === "object" && raw.dashboardWidgetLayout !== null
        ? (raw.dashboardWidgetLayout as Record<string, unknown>)
        : {},
    hiddenWidgets: Array.isArray(raw.hiddenWidgets) ? (raw.hiddenWidgets as string[]) : [],
  };
}

async function getOrCreatePreferences(userId: string) {
  let prefs = await prisma.userPreferences.findUnique({
    where: { userId },
  });

  if (!prefs) {
    prefs = await prisma.userPreferences.create({
      data: {
        userId,
        defaultViewPerScreen: {},
        dashboardWidgetLayout: {},
        hiddenWidgets: [],
      },
    });
  }

  return prefs;
}

// ── Actions ──────────────────────────────────────────────

/**
 * Henter brukerens preferanser.
 * Oppretter rad automatisk hvis den ikke finnes.
 */
export async function getUserPreferences(): Promise<UserPreferencesData> {
  const user = await requirePortalUser();
  const prefs = await getOrCreatePreferences(user.id);
  return parsePreferences(prefs);
}

/**
 * Henter default view for en spesifikk skjerm.
 * Returnerer opt1 hvis brukeren ikke har satt preferanse.
 */
export async function getDefaultView(screenId: ScreenId): Promise<ViewId> {
  const user = await requirePortalUser();
  const prefs = await getOrCreatePreferences(user.id);
  const parsed = parsePreferences(prefs);

  const viewId = parsed.defaultViewPerScreen[screenId];
  if (viewId && isValidView(screenId, viewId)) {
    return viewId;
  }

  return "opt1";
}

/**
 * Setter default view for en skjerm.
 * Validerer at view-et faktisk finnes for skjermen.
 */
export async function setDefaultView(
  screenId: ScreenId,
  viewId: ViewId
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requirePortalUser();

    if (!isValidView(screenId, viewId)) {
      return { success: false, error: `Ugyldig view "${viewId}" for skjerm "${screenId}"` };
    }

    const prefs = await getOrCreatePreferences(user.id);
    const current = parsePreferences(prefs);

    await prisma.userPreferences.update({
      where: { userId: user.id },
      data: {
        defaultViewPerScreen: {
          ...current.defaultViewPerScreen,
          [screenId]: viewId,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("[setDefaultView] Feil:", error);
    return { success: false, error: "Kunne ikke lagre view-preferanse" };
  }
}

/**
 * Oppdaterer dashboard-widget-layout (brukes i Steg 3–5).
 */
export async function updateDashboardLayout(
  layout: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requirePortalUser();
    await prisma.userPreferences.update({
      where: { userId: user.id },
      data: { dashboardWidgetLayout: layout as Prisma.InputJsonValue },
    });
    return { success: true };
  } catch (error) {
    console.error("[updateDashboardLayout] Feil:", error);
    return { success: false, error: "Kunne ikke lagre widget-layout" };
  }
}

/**
 * Skjuler eller viser en widget.
 */
export async function toggleWidget(
  widgetId: string,
  hidden: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requirePortalUser();
    const prefs = await getOrCreatePreferences(user.id);
    const current = parsePreferences(prefs);

    let hiddenWidgets = [...current.hiddenWidgets];

    if (hidden) {
      if (!hiddenWidgets.includes(widgetId)) {
        hiddenWidgets.push(widgetId);
      }
    } else {
      hiddenWidgets = hiddenWidgets.filter((id) => id !== widgetId);
    }

    await prisma.userPreferences.update({
      where: { userId: user.id },
      data: { hiddenWidgets },
    });

    return { success: true };
  } catch (error) {
    console.error("[toggleWidget] Feil:", error);
    return { success: false, error: "Kunne ikke oppdatere widget-synlighet" };
  }
}
