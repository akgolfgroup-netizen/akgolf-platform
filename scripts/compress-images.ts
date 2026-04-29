/**
 * Konservativ bildekomprimering for public/images/.
 *
 * Bruker sharp (kommer med Next.js-installasjonen) til a:
 *   1. Konvertere store .jpg/.jpeg/.png til WebP @ kvalitet 82
 *   2. Bytte ut originalen kun hvis ny fil er minst 30% mindre
 *   3. Lagre originaler i public/images/_backup-pre-compress/<sti>
 *
 * Kjor manuelt etter visuell sammenligning av et utvalg:
 *   npx tsx scripts/compress-images.ts --dry-run   # vis hva som vil endres
 *   npx tsx scripts/compress-images.ts --apply     # gjor endringene
 *
 * NB: <Image>-komponenten i Next.js velger automatisk WebP/AVIF for
 * stottede browsere — vi trenger ikke endre import-stier i koden.
 *
 * Kun .jpg/.jpeg → .webp. PNG-filer beholdes (kan ha alpha-kanal).
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const IMAGES_DIR = path.resolve(process.cwd(), "public/images");
const BACKUP_DIR = path.resolve(IMAGES_DIR, "_backup-pre-compress");
const SIZE_THRESHOLD_KB = 500;
const MIN_REDUCTION_PCT = 30;
const QUALITY = 82;

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run") || !args.includes("--apply");

interface Result {
  file: string;
  origKB: number;
  newKB: number;
  reductionPct: number;
  applied: boolean;
  reason?: string;
}

async function findLargeImages(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith("_backup-")) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await findLargeImages(full)));
    } else if (/\.(jpe?g|png)$/i.test(e.name)) {
      const stat = await fs.stat(full);
      if (stat.size > SIZE_THRESHOLD_KB * 1024) out.push(full);
    }
  }
  return out;
}

async function compressOne(file: string): Promise<Result> {
  const orig = await fs.stat(file);
  const origKB = Math.round(orig.size / 1024);
  const ext = path.extname(file).toLowerCase();
  const isPng = ext === ".png";

  // Generer komprimert versjon i minne
  const buf = isPng
    ? await sharp(file).png({ quality: QUALITY, compressionLevel: 9 }).toBuffer()
    : await sharp(file).webp({ quality: QUALITY }).toBuffer();

  const newKB = Math.round(buf.length / 1024);
  const reductionPct = Math.round((1 - newKB / origKB) * 100);

  if (reductionPct < MIN_REDUCTION_PCT) {
    return {
      file,
      origKB,
      newKB,
      reductionPct,
      applied: false,
      reason: `kun ${reductionPct}% reduksjon (terskel ${MIN_REDUCTION_PCT}%) — beholder original`,
    };
  }

  if (DRY_RUN) {
    return { file, origKB, newKB, reductionPct, applied: false, reason: "DRY-RUN" };
  }

  // Backup original
  const relPath = path.relative(IMAGES_DIR, file);
  const backupPath = path.join(BACKUP_DIR, relPath);
  await fs.mkdir(path.dirname(backupPath), { recursive: true });
  await fs.copyFile(file, backupPath);

  // Skriv komprimert. For JPG → WebP (ny extension)
  const newFile = isPng ? file : file.replace(/\.(jpe?g)$/i, ".webp");
  await fs.writeFile(newFile, buf);
  if (newFile !== file) {
    await fs.unlink(file); // slett original .jpg
  }

  return { file, origKB, newKB, reductionPct, applied: true };
}

async function main() {
  console.log(`\n${DRY_RUN ? "🔍 DRY-RUN" : "⚙️  APPLY"} — komprimerer >${SIZE_THRESHOLD_KB} KB-bilder med kvalitet ${QUALITY}\n`);

  const files = await findLargeImages(IMAGES_DIR);
  console.log(`Fant ${files.length} bilder >${SIZE_THRESHOLD_KB} KB.\n`);

  const results: Result[] = [];
  for (const f of files) {
    try {
      const r = await compressOne(f);
      results.push(r);
      const rel = path.relative(IMAGES_DIR, r.file);
      const action = r.applied ? "✅" : "⊘";
      console.log(`  ${action}  ${rel.padEnd(50)} ${r.origKB} → ${r.newKB} KB (-${r.reductionPct}%)${r.reason ? ` · ${r.reason}` : ""}`);
    } catch (err) {
      console.error(`  ❌  ${f} — ${err instanceof Error ? err.message : err}`);
    }
  }

  const applied = results.filter((r) => r.applied);
  const totalSaved = applied.reduce((sum, r) => sum + (r.origKB - r.newKB), 0);

  console.log(`\nSammendrag: ${applied.length}/${results.length} komprimert, ${totalSaved} KB total spart.`);
  if (DRY_RUN) {
    console.log("\nKjor med --apply for a faktisk endre filer (originaler backes opp til public/images/_backup-pre-compress/).");
  } else {
    console.log(`\nOriginaler backet opp i ${path.relative(process.cwd(), BACKUP_DIR)}/`);
    console.log("Visuelt verifiser i nettleseren for du committer.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
