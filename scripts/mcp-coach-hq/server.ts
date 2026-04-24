#!/usr/bin/env tsx
/**
 * MCP server for CoachHQ — exposes coach tools to Claude Code / Kimi Claw.
 *
 * Tools:
 *   - list-students
 *   - get-student-context       (recent sessions, HCP, goals, focus areas)
 *   - get-session-transcript    (full transcript + summary)
 *   - generate-next-session     (same orchestrator as UI)
 *   - search-drills             (by focus area + l-phase)
 *   - log-training-note         (add a quick coach note for a student)
 *
 * Run: `tsx scripts/mcp-coach-hq/server.ts`
 *
 * Register in ~/.claude.json or project .mcp.json as:
 * {
 *   "mcpServers": {
 *     "ak-coach": {
 *       "command": "tsx",
 *       "args": ["/absolute/path/scripts/mcp-coach-hq/server.ts"]
 *     }
 *   }
 * }
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { prisma } from "@/lib/portal/prisma";
import { subDays } from "date-fns";
import { nanoid } from "nanoid";

const server = new Server(
  {
    name: "ak-coach-hq",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ---------------------------------------------------------------------------
// Tool definitions
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: "list-students",
    description:
      "Lists active students (name + id + handicap). Supports optional query string filter.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Optional name filter" },
        limit: { type: "number", description: "Max results (default 20)" },
      },
    },
  },
  {
    name: "get-student-context",
    description:
      "Returns consolidated context for a student — recent sessions, HCP, goals, focus areas, TrackMan averages.",
    inputSchema: {
      type: "object",
      properties: {
        studentId: { type: "string" },
      },
      required: ["studentId"],
    },
  },
  {
    name: "get-session-transcript",
    description: "Returns full transcript + AI summary for a CoachingSession.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: { type: "string" },
      },
      required: ["sessionId"],
    },
  },
  {
    name: "generate-next-session",
    description:
      "Generates a complete next-session draft for a student (focus + plan + context).",
    inputSchema: {
      type: "object",
      properties: {
        studentId: { type: "string" },
        durationMinutes: { type: "number", description: "Default 60" },
      },
      required: ["studentId"],
    },
  },
  {
    name: "search-drills",
    description: "Search ExerciseDefinition by focus area and optional l-phase.",
    inputSchema: {
      type: "object",
      properties: {
        area: {
          type: "string",
          description: "One of: tee, approach, short_game, putting",
        },
        lPhase: { type: "string", description: "Optional L-phase filter" },
        limit: { type: "number", description: "Default 10" },
      },
      required: ["area"],
    },
  },
  {
    name: "log-training-note",
    description: "Add a coaching note as a TrainingLog entry for a student.",
    inputSchema: {
      type: "object",
      properties: {
        studentId: { type: "string" },
        focusArea: { type: "string" },
        notes: { type: "string" },
        durationMinutes: { type: "number" },
        rating: { type: "number", description: "1-5" },
      },
      required: ["studentId", "focusArea", "notes"],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

// ---------------------------------------------------------------------------
// Tool handlers
// ---------------------------------------------------------------------------

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    if (name === "list-students") {
      const q = (args.query as string | undefined)?.trim();
      const limit = Math.min(Number(args.limit) || 20, 50);
      const students = await prisma.user.findMany({
        where: {
          role: "STUDENT",
          ...(q
            ? {
                OR: [
                  { name: { contains: q, mode: "insensitive" as const } },
                  { email: { contains: q, mode: "insensitive" as const } },
                ],
              }
            : {}),
        },
        orderBy: { name: "asc" },
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          HandicapEntry: {
            orderBy: { date: "desc" },
            take: 1,
            select: { handicapIndex: true },
          },
        },
      });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              students.map((s) => ({
                id: s.id,
                name: s.name,
                email: s.email,
                handicap: s.HandicapEntry[0]?.handicapIndex ?? null,
              })),
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === "get-student-context") {
      const studentId = args.studentId as string;
      const [sessions, goals, handicap, trackman] = await Promise.all([
        prisma.coachingSession.findMany({
          where: { studentId },
          orderBy: { sessionDate: "desc" },
          take: 5,
          select: {
            id: true,
            sessionDate: true,
            primaryFocus: true,
            aiSummary: true,
            aiFocusAreas: true,
            aiActionItems: true,
            publishedToStudent: true,
          },
        }),
        prisma.playerGoals.findMany({
          where: { userId: studentId, isActive: true },
          orderBy: { priority: "asc" },
        }),
        prisma.handicapEntry.findFirst({
          where: { userId: studentId },
          orderBy: { date: "desc" },
        }),
        prisma.trackmanSession.findMany({
          where: { userId: studentId, sessionDate: { gte: subDays(new Date(), 30) } },
          orderBy: { sessionDate: "desc" },
          take: 5,
        }),
      ]);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { sessions, goals, handicap, trackman },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === "get-session-transcript") {
      const sessionId = args.sessionId as string;
      const session = await prisma.coachingSession.findUnique({
        where: { id: sessionId },
        select: {
          id: true,
          sessionDate: true,
          rawTranscript: true,
          aiSummary: true,
          aiKeyPoints: true,
          aiFocusAreas: true,
          aiActionItems: true,
          publishedToStudent: true,
        },
      });
      return {
        content: [{ type: "text", text: JSON.stringify(session, null, 2) }],
      };
    }

    if (name === "generate-next-session") {
      const { generateNextSessionDraft } = await import(
        "@/lib/portal/ai/next-session-orchestrator"
      );
      const draft = await generateNextSessionDraft({
        studentId: args.studentId as string,
        durationMinutes: Number(args.durationMinutes) || 60,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(draft, null, 2) }],
      };
    }

    if (name === "search-drills") {
      const area = args.area as string;
      const lPhase = args.lPhase as string | undefined;
      const limit = Math.min(Number(args.limit) || 10, 50);
      const drills = await prisma.exerciseDefinition.findMany({
        where: {
          area: { equals: area, mode: "insensitive" as const },
          ...(lPhase ? { lPhase } : {}),
        },
        take: limit,
        orderBy: { createdAt: "desc" },
      });
      return {
        content: [{ type: "text", text: JSON.stringify(drills, null, 2) }],
      };
    }

    if (name === "log-training-note") {
      const log = await prisma.trainingLog.create({
        data: {
          id: nanoid(),
          userId: args.studentId as string,
          focusArea: args.focusArea as string,
          notes: args.notes as string,
          durationMinutes: Number(args.durationMinutes) || 30,
          rating: args.rating ? Number(args.rating) : null,
          date: new Date(),
          updatedAt: new Date(),
        },
      });
      return {
        content: [
          {
            type: "text",
            text: `Logged: ${log.id} (${log.focusArea}, ${log.durationMinutes}min)`,
          },
        ],
      };
    }

    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true,
    };
  } catch (err) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${err instanceof Error ? err.message : String(err)}`,
        },
      ],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
