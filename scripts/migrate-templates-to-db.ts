/**
 * Engangs-migrering: flytter hardkodede treningsplan-maler fra
 * lib/portal/training/standard-templates.ts til DB.
 *
 * Idempotent — kjører trygt flere ganger. Bruker template-id som unique key
 * og oppdaterer eksisterende rader hvis de finnes.
 *
 * Kjør: `npx tsx scripts/migrate-templates-to-db.ts`
 */

import { PrismaClient } from "@prisma/client";
import { STANDARD_TEMPLATES } from "@/lib/portal/training/standard-templates";

const prisma = new PrismaClient();

async function main() {
  console.log(
    `Migrerer ${STANDARD_TEMPLATES.length} hardkodede maler til TrainingPlanTemplate-tabellen...`
  );

  let created = 0;
  let updated = 0;

  for (let i = 0; i < STANDARD_TEMPLATES.length; i++) {
    const t = STANDARD_TEMPLATES[i];
    const existing = await prisma.trainingPlanTemplate.findUnique({
      where: { id: t.id },
    });

    const data = {
      id: t.id,
      title: t.title,
      description: t.description,
      iconName: t.iconName,
      badge: t.badge,
      periodType: t.periodType,
      weekPattern: t.weekPattern as unknown as object,
      weeklyFocusTemplate: t.weeklyFocusTemplate,
      isPublic: true,
      isActive: true,
      sortOrder: i,
      createdById: null,
      updatedAt: new Date(),
    };

    if (existing) {
      await prisma.trainingPlanTemplate.update({
        where: { id: t.id },
        data,
      });
      updated++;
      console.log(`  [oppdatert] ${t.id} — ${t.title}`);
    } else {
      await prisma.trainingPlanTemplate.create({ data });
      created++;
      console.log(`  [opprettet] ${t.id} — ${t.title}`);
    }
  }

  console.log(`\nFerdig: ${created} opprettet, ${updated} oppdatert.`);
}

main()
  .catch((err) => {
    console.error("Migrering feilet:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
