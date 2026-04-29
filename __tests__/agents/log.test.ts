import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma + logger for å isolere logAgentRun fra DB
vi.mock("@/lib/portal/prisma", () => ({
  prisma: {
    agent: { findUnique: vi.fn() },
    agentLog: { create: vi.fn() },
  },
}));

vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn() },
}));

import { prisma } from "@/lib/portal/prisma";
import { logger } from "@/lib/logger";
import {
  getAgentIdByName,
  clearAgentIdCache,
  logAgentRun,
} from "@/lib/portal/agents/log";

const mockFindUnique = prisma.agent.findUnique as ReturnType<typeof vi.fn>;
const mockCreate = prisma.agentLog.create as ReturnType<typeof vi.fn>;
const mockLoggerError = logger.error as ReturnType<typeof vi.fn>;

describe("agent-log", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearAgentIdCache();
  });

  describe("getAgentIdByName", () => {
    it("returnerer agentId fra DB ved første kall", async () => {
      mockFindUnique.mockResolvedValue({ id: "agent-123" });

      const id = await getAgentIdByName("birthday");

      expect(id).toBe("agent-123");
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { name: "birthday" },
        select: { id: true },
      });
    });

    it("cacher resultatet — andre kall treffer ikke DB", async () => {
      mockFindUnique.mockResolvedValue({ id: "agent-456" });

      const first = await getAgentIdByName("dunning");
      const second = await getAgentIdByName("dunning");

      expect(first).toBe("agent-456");
      expect(second).toBe("agent-456");
      expect(mockFindUnique).toHaveBeenCalledTimes(1);
    });

    it("returnerer null hvis agenten ikke finnes (uten cache-poisoning ved retry)", async () => {
      mockFindUnique.mockResolvedValue(null);

      const id = await getAgentIdByName("ikke-eksisterende");

      expect(id).toBeNull();
    });

    it("returnerer null og logger ved DB-feil", async () => {
      mockFindUnique.mockRejectedValue(new Error("DB-tilkobling feilet"));

      const id = await getAgentIdByName("error-case");

      expect(id).toBeNull();
      expect(mockLoggerError).toHaveBeenCalled();
    });

    it("clearAgentIdCache() tomer cache slik at neste kall treffer DB", async () => {
      mockFindUnique.mockResolvedValue({ id: "agent-789" });

      await getAgentIdByName("winback");
      clearAgentIdCache();
      await getAgentIdByName("winback");

      expect(mockFindUnique).toHaveBeenCalledTimes(2);
    });
  });

  describe("logAgentRun", () => {
    it("setter agentId-FK fra cache + lagrer agentType + status", async () => {
      mockFindUnique.mockResolvedValue({ id: "agent-abc" });
      mockCreate.mockResolvedValue({});

      await logAgentRun({
        name: "no-show",
        model: "rule-based",
        status: "success",
        duration: 1234,
        output: "marked 5 no-shows",
      });

      expect(mockCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          agentId: "agent-abc",
          agentType: "no-show",
          model: "rule-based",
          status: "success",
          duration: 1234,
          output: "marked 5 no-shows",
        }),
      });
    });

    it("logger med agentId=null hvis Agent ikke er seedet", async () => {
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue({});

      await logAgentRun({
        name: "ikke-seedet",
        model: "rule-based",
        status: "skipped",
      });

      expect(mockCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          agentId: null,
          agentType: "ikke-seedet",
          status: "skipped",
        }),
      });
    });

    it("svelger feil ved create-failure (logger ikke skal kaste)", async () => {
      mockFindUnique.mockResolvedValue({ id: "agent-xyz" });
      mockCreate.mockRejectedValue(new Error("DB unavailable"));

      await expect(
        logAgentRun({
          name: "any",
          model: "rule-based",
          status: "error",
          error: "test",
        }),
      ).resolves.toBeUndefined();

      expect(mockLoggerError).toHaveBeenCalled();
    });

    it("inkluderer cost hvis satt, ellers null", async () => {
      mockFindUnique.mockResolvedValue({ id: "agent-cost" });
      mockCreate.mockResolvedValue({});

      await logAgentRun({
        name: "post-session-transcriber",
        model: "claude",
        status: "success",
        cost: 0.42,
      });

      expect(mockCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({ cost: 0.42 }),
      });
    });
  });
});
