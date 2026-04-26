/**
 * Tester template-service med både DB-treff og fallback.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/portal/prisma", () => ({
  prisma: {
    trainingPlanTemplate: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import {
  getActiveTemplates,
  getTemplateById,
} from "@/lib/portal/training/template-service";
import { prisma } from "@/lib/portal/prisma";

describe("template-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getActiveTemplates", () => {
    it("returnerer DB-rader når tabellen har data", async () => {
      const dbRow = {
        id: "custom-template",
        title: "Egendefinert",
        description: "Beskrivelse",
        iconName: "fitness_center",
        badge: null,
        periodType: "PREPARATION",
        weekPattern: [
          { dayOfWeek: 1, title: "Test", durationMinutes: 60, focusArea: "JERN" },
        ],
        weeklyFocusTemplate: "Uke {n}",
      };

      (prisma.trainingPlanTemplate.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([dbRow]);

      const templates = await getActiveTemplates();
      expect(templates).toHaveLength(1);
      expect(templates[0].id).toBe("custom-template");
      expect(templates[0].source).toBe("db");
    });

    it("faller tilbake til hardkodet liste når DB er tom", async () => {
      (prisma.trainingPlanTemplate.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

      const templates = await getActiveTemplates();
      expect(templates.length).toBeGreaterThan(0);
      expect(templates[0].source).toBe("fallback");
    });

    it("faller tilbake hvis DB kaster feil", async () => {
      (prisma.trainingPlanTemplate.findMany as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("DB nede")
      );

      const templates = await getActiveTemplates();
      expect(templates.length).toBeGreaterThan(0);
      expect(templates[0].source).toBe("fallback");
    });
  });

  describe("getTemplateById", () => {
    it("returnerer DB-rad hvis aktiv", async () => {
      (prisma.trainingPlanTemplate.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: "custom-1",
        title: "DB-mal",
        description: "",
        iconName: "x",
        badge: null,
        periodType: "PREPARATION",
        weekPattern: [],
        weeklyFocusTemplate: null,
        isActive: true,
      });

      const t = await getTemplateById("custom-1");
      expect(t?.title).toBe("DB-mal");
      expect(t?.source).toBe("db");
    });

    it("faller tilbake til hardkodet mal hvis DB ikke har den", async () => {
      (prisma.trainingPlanTemplate.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const t = await getTemplateById("allround");
      expect(t).toBeDefined();
      expect(t?.source).toBe("fallback");
    });

    it("returnerer null for ukjent id", async () => {
      (prisma.trainingPlanTemplate.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const t = await getTemplateById("ikke-eksisterer-noe-sted");
      expect(t).toBeNull();
    });
  });
});
