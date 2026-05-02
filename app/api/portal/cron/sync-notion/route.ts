import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { syncDrillToNotion } from "@/lib/portal/notion/drill-sync";
import { syncTrainingPlanToNotion } from "@/lib/portal/notion/training-plan-sync";
import { syncContentToNotion } from "@/lib/portal/notion/content-sync";
import { subHours } from "date-fns";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutter for Notion API-kall

interface SyncSummary {
  drills: { synced: number; failed: number };
  plans: { synced: number; failed: number };
  content: { synced: number; failed: number };
  durationMs: number;
  errors: string[];
}

/**
 * Cron job: kjores hver time via Vercel Cron.
 * Synkroniserer nye/endrede drills, treningsplaner og innhold til Notion.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const cutoff = subHours(new Date(), 24);

  const summary: SyncSummary = {
    drills: { synced: 0, failed: 0 },
    plans: { synced: 0, failed: 0 },
    content: { synced: 0, failed: 0 },
    durationMs: 0,
    errors: [],
  };

  try {
    // 1. Sync nye/endrede drills (siste 24 timer)
    const drills = await prisma.exerciseDefinition.findMany({
      where: { updatedAt: { gte: cutoff } },
    });

    console.log(`[sync-notion] Fant ${drills.length} drills endret siste 24t`);

    for (const drill of drills) {
      try {
        await syncDrillToNotion({
          id: drill.id,
          name: drill.name,
          description: drill.description,
          instructions: drill.instructions,
          pyramid: drill.pyramid,
          area: drill.area,
          lPhase: drill.lPhase,
          difficulty: drill.difficulty,
          minDurationMinutes: drill.minDurationMinutes,
          maxDurationMinutes: drill.maxDurationMinutes,
          isPublic: drill.isPublic,
          isSystemDrill: drill.isSystemDrill,
          tags: drill.tags,
          createdById: drill.createdById,
        });
        summary.drills.synced++;
      } catch (error) {
        summary.drills.failed++;
        const msg = `Drill "${drill.name}" (${drill.id}): ${error instanceof Error ? error.message : String(error)}`;
        summary.errors.push(msg);
        console.error(`[sync-notion] Feil: ${msg}`);
      }
    }

    // 2. Sync nye AI-genererte treningsplaner (siste 24 timer)
    const plans = await prisma.trainingPlan.findMany({
      where: {
        createdAt: { gte: cutoff },
        aiGenerated: true,
      },
      include: {
        User_TrainingPlan_studentIdToUser: { select: { name: true } },
        TrainingPlanWeek: {
          include: { TrainingPlanSession: true },
          orderBy: { weekNumber: "asc" },
        },
      },
    });

    console.log(
      `[sync-notion] Fant ${plans.length} AI-treningsplaner opprettet siste 24t`
    );

    for (const plan of plans) {
      try {
        await syncTrainingPlanToNotion({
          id: plan.id,
          title: plan.title,
          description: plan.description,
          studentName:
            plan.User_TrainingPlan_studentIdToUser.name ?? "Ukjent spiller",
          periodType: plan.periodType,
          startDate: plan.startDate,
          endDate: plan.endDate,
          isActive: plan.isActive,
          aiGenerated: plan.aiGenerated,
          weeks: plan.TrainingPlanWeek.map((week) => ({
            weekNumber: week.weekNumber,
            weekStart: week.weekStart.toISOString(),
            focus: week.focus,
            volumeLabel: week.volumeLabel,
            sessions: week.TrainingPlanSession.map((session) => ({
              dayOfWeek: session.dayOfWeek,
              title: session.title,
              description: session.description,
              durationMinutes: session.durationMinutes,
              focusArea: session.focusArea,
            })),
          })),
        });
        summary.plans.synced++;
      } catch (error) {
        summary.plans.failed++;
        const msg = `Plan "${plan.title}" (${plan.id}): ${error instanceof Error ? error.message : String(error)}`;
        summary.errors.push(msg);
        console.error(`[sync-notion] Feil: ${msg}`);
      }
    }

    // 3. Sync nye ContentItems uten Notion-kobling (siste 24 timer)
    const contentItems = await prisma.contentItem.findMany({
      where: {
        updatedAt: { gte: cutoff },
        notionPageId: null,
      },
    });

    console.log(
      `[sync-notion] Fant ${contentItems.length} innholdselementer uten Notion-kobling`
    );

    for (const item of contentItems) {
      try {
        const notionPageId = await syncContentToNotion({
          id: item.id,
          title: item.title,
          type: item.type as "SOME_POST" | "NEWSLETTER" | "ARTICLE",
          status: item.status as
            | "DRAFT"
            | "REVIEW"
            | "APPROVED"
            | "PUBLISHED"
            | "ARCHIVED",
          body: item.body,
          excerpt: item.excerpt,
          platform: item.platform,
          segment: item.segment,
          aiGenerated: item.aiGenerated,
          publishedAt: item.publishedAt,
          scheduledAt: item.scheduledAt,
          hashtags: item.hashtags,
          imageUrl: item.imageUrl,
        });

        // Lagre Notion page ID tilbake pa ContentItem
        if (notionPageId) {
          await prisma.contentItem.update({
            where: { id: item.id },
            data: { notionPageId },
          });
        }

        summary.content.synced++;
      } catch (error) {
        summary.content.failed++;
        const msg = `Content "${item.title}" (${item.id}): ${error instanceof Error ? error.message : String(error)}`;
        summary.errors.push(msg);
        console.error(`[sync-notion] Feil: ${msg}`);
      }
    }
  } catch (error) {
    const msg = `Kritisk feil: ${error instanceof Error ? error.message : String(error)}`;
    summary.errors.push(msg);
    console.error(`[sync-notion] ${msg}`);
  }

  summary.durationMs = Date.now() - startTime;

  const totalSynced =
    summary.drills.synced + summary.plans.synced + summary.content.synced;
  const totalFailed =
    summary.drills.failed + summary.plans.failed + summary.content.failed;

  console.log(
    `[sync-notion] Ferdig: ${totalSynced} synket, ${totalFailed} feilet (${summary.durationMs}ms)`
  );

  return NextResponse.json({
    ok: totalFailed === 0,
    summary,
    totalSynced,
    totalFailed,
  });
}
