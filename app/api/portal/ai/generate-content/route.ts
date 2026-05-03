import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/portal/rate-limit";
import { isStaff } from "@/lib/portal/rbac";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import { nanoid } from "nanoid";
import { ContentType, ContentStatus } from "@prisma/client";
import Anthropic from "@anthropic-ai/sdk";
import { syncContentToNotion } from "@/lib/portal/notion/content-sync";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// ── Rate limit: 5 per time for innholdsgenerering ──
const CONTENT_GEN_LIMIT = { limit: 5, windowSeconds: 3600 };

// ── Input-typer ──

type TargetAudience =
  | "nybegynner"
  | "amatoer"
  | "junior"
  | "bedrift"
  | "alle";

type ContentPlatform =
  | "portal"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "nyhetsbrev";

interface GenerateContentInput {
  type: ContentType;
  topic: string;
  targetAudience: TargetAudience;
  platform?: ContentPlatform;
}

// ── Validering ──

const VALID_TYPES: ContentType[] = [
  ContentType.ARTICLE,
  ContentType.NEWSLETTER,
  ContentType.SOME_POST,
];

const VALID_AUDIENCES: TargetAudience[] = [
  "nybegynner",
  "amatoer",
  "junior",
  "bedrift",
  "alle",
];

const VALID_PLATFORMS: ContentPlatform[] = [
  "portal",
  "instagram",
  "facebook",
  "linkedin",
  "nyhetsbrev",
];

function validateInput(
  data: unknown
): { valid: true; input: GenerateContentInput } | { valid: false; error: string } {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Ugyldig foresporselsformat" };
  }

  const obj = data as Record<string, unknown>;

  if (!obj.type || !VALID_TYPES.includes(obj.type as ContentType)) {
    return {
      valid: false,
      error: `Ugyldig type. Gyldig: ${VALID_TYPES.join(", ")}`,
    };
  }

  if (!obj.topic || typeof obj.topic !== "string" || obj.topic.trim().length < 3) {
    return { valid: false, error: "Emne (topic) er pakrevd og ma vaere minst 3 tegn" };
  }

  if (
    !obj.targetAudience ||
    !VALID_AUDIENCES.includes(obj.targetAudience as TargetAudience)
  ) {
    return {
      valid: false,
      error: `Ugyldig malgruppe. Gyldig: ${VALID_AUDIENCES.join(", ")}`,
    };
  }

  if (obj.platform !== undefined && !VALID_PLATFORMS.includes(obj.platform as ContentPlatform)) {
    return {
      valid: false,
      error: `Ugyldig plattform. Gyldig: ${VALID_PLATFORMS.join(", ")}`,
    };
  }

  return {
    valid: true,
    input: {
      type: obj.type as ContentType,
      topic: (obj.topic as string).trim().slice(0, 500),
      targetAudience: obj.targetAudience as TargetAudience,
      platform: obj.platform as ContentPlatform | undefined,
    },
  };
}

// ── Prompt-bygging ──

const BASE_CONTEXT = `Du er innholdsprodusent for AK Golf Academy, en premium golfcoaching-tjeneste i Fredrikstad, Norge.

Regler:
- Skriv pa norsk bokmal
- Profesjonell men varm tone
- Aldri bruk emojier
- Aldri nevn sertifiseringer (PGA, TrackMan, TPI osv.)
- Fokuser pa praktiske rad og verdi for leseren
- AK Golf Academy tilbyr personlig coaching, gruppetrening, juniorprogram og bedriftspakker`;

const AUDIENCE_CONTEXT: Record<TargetAudience, string> = {
  nybegynner:
    "Malgruppen er nybegynnere som nettopp har begynt med golf. Bruk enkelt sprak, unnga fagterminologi, og vekt laeringsglede.",
  amatoer:
    "Malgruppen er amatoergolfere med noe erfaring (hcp 15-36). De kjenner grunnleggende begreper og onsker a bli bedre.",
  junior:
    "Malgruppen er juniorer (10-19 ar) og deres foresatte. Vektlegg utvikling, sosialt miljo og idrettsglede.",
  bedrift:
    "Malgruppen er bedrifter som vurderer golf som teambuilding eller kundepleie. Profesjonell tone, fokus pa verdi og opplevelse.",
  alle: "Skriv for et bredt publikum av golfinteresserte i alle aldre og nivaer.",
};

function buildTypeInstructions(
  type: ContentType,
  platform?: ContentPlatform
): string {
  switch (type) {
    case ContentType.ARTICLE:
      return `Skriv en artikkel pa 500-1500 ord.
Struktur:
1. Engasjerende introduksjon (2-3 setninger)
2. Hoveddel med konkrete rad, eksempler eller ovelser (3-5 avsnitt)
3. Oppsummerende konklusjon med en tydelig oppfordring

Returner i dette JSON-formatet:
{
  "title": "Artikkeltittel",
  "body": "Full artikkeltekst med avsnitt separert av dobbel linjeskift",
  "excerpt": "1-2 setninger som oppsummerer artikkelen",
  "hashtags": ["relevante", "hashtags", "uten", "hashsymbol"]
}`;

    case ContentType.NEWSLETTER:
      return `Skriv et nyhetsbrev med flere seksjoner.
Struktur:
1. Velkomst/intro (2-3 setninger, sesongbasert)
2. Hovedsak — en artikkel eller nyhet (150-300 ord)
3. Tips fra treneren — et konkret rad (50-100 ord)
4. Kommende aktiviteter — plassholder for datoer
5. Avslutning med hilsen fra AK Golf Academy

Returner i dette JSON-formatet:
{
  "title": "Nyhetsbrev-tittel",
  "body": "Full nyhetsbrev-tekst med seksjoner separert av dobbel linjeskift",
  "excerpt": "1-2 setninger som oppsummerer hovedinnholdet",
  "hashtags": []
}`;

    case ContentType.SOME_POST: {
      const platformHint = platform
        ? `Tilpass for ${platform}. `
        : "";
      const lengthGuide =
        platform === "instagram"
          ? "Maks 2200 tegn. Kort og visuelt beskrivende."
          : platform === "linkedin"
            ? "150-300 ord. Profesjonell tone."
            : "50-200 ord. Kort og engasjerende.";

      return `${platformHint}Skriv et SoMe-innlegg.
${lengthGuide}
- Fang oppmerksomhet i forste setning
- Avslutt med en oppfordring til handling (CTA)
- Foreslå relevante hashtags

Returner i dette JSON-formatet:
{
  "title": "Kort tittel for intern bruk",
  "body": "Innleggets tekst",
  "excerpt": null,
  "hashtags": ["relevante", "hashtags", "uten", "hashsymbol"]
}`;
    }
  }
}

function buildPrompt(input: GenerateContentInput): string {
  return `${BASE_CONTEXT}

${AUDIENCE_CONTEXT[input.targetAudience]}

${buildTypeInstructions(input.type, input.platform)}

Emne: ${input.topic}

VIKTIG: Returner KUN gyldig JSON. Ingen tekst for eller etter JSON-objektet.`;
}

// ── Slug-generering ──

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[æ]/g, "ae")
    .replace(/[ø]/g, "o")
    .replace(/[å]/g, "a")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

// ── AI-respons-parsing ──

interface AIContentResponse {
  title: string;
  body: string;
  excerpt: string | null;
  hashtags: string[];
}

function parseAIResponse(text: string): AIContentResponse {
  // Fjern eventuelle markdown code blocks
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  const parsed: unknown = JSON.parse(cleaned);

  if (!parsed || typeof parsed !== "object") {
    throw new Error("AI-respons er ikke et gyldig objekt");
  }

  const obj = parsed as Record<string, unknown>;

  if (typeof obj.title !== "string" || typeof obj.body !== "string") {
    throw new Error("AI-respons mangler title eller body");
  }

  return {
    title: obj.title,
    body: obj.body,
    excerpt: typeof obj.excerpt === "string" ? obj.excerpt : null,
    hashtags: Array.isArray(obj.hashtags)
      ? obj.hashtags.filter((h): h is string => typeof h === "string")
      : [],
  };
}

// ── Hovedrute ──

export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  if (!isStaff(user.role)) {
    return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
  }

  const rateLimit = checkRateLimit(
    `ai-generate-content:${user.id}`,
    CONTENT_GEN_LIMIT
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "For mange foresporsler. Maks 5 genereringer per time.",
        resetAt: rateLimit.resetAt,
      },
      { status: 429 }
    );
  }

  // Valider input
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const validation = validateInput(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const input = validation.input;

  // Generer innhold via Claude
  const prompt = buildPrompt(input);

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Ingen tekst i AI-respons");
    }

    const aiContent = parseAIResponse(textBlock.text);

    // Lag unik slug
    const baseSlug = slugify(aiContent.title);
    const uniqueSlug = `${baseSlug}-${nanoid(6)}`;

    // Lagre i database
    const contentItem = await prisma.contentItem.create({
      data: {
        id: nanoid(),
        updatedAt: new Date(),
        type: input.type,
        status: ContentStatus.DRAFT,
        title: aiContent.title,
        slug: uniqueSlug,
        body: aiContent.body,
        excerpt: aiContent.excerpt,
        platform: input.platform ?? null,
        hashtags: aiContent.hashtags,
        aiGenerated: true,
        aiModel: "claude-sonnet-4-5",
        segment: input.targetAudience,
        createdBy: user.id,
      },
    });

    // Sync til Notion (non-blocking — ikke vent pa resultat)
    syncContentToNotion({
      id: contentItem.id,
      title: contentItem.title,
      type: contentItem.type,
      status: contentItem.status,
      body: contentItem.body,
      excerpt: contentItem.excerpt,
      platform: contentItem.platform,
      segment: contentItem.segment,
      aiGenerated: true,
      publishedAt: null,
      scheduledAt: null,
      hashtags: contentItem.hashtags,
      imageUrl: null,
    }).then((notionPageId) => {
      if (notionPageId) {
        prisma.contentItem
          .update({
            where: { id: contentItem.id },
            data: { notionPageId, updatedAt: new Date() },
          })
          .catch((err: Error) => {
            logger.error("[generate-content] Notion ID update failed:", {
              error: err.message,
              contentId: contentItem.id,
            });
          });
      }
    }).catch((err: Error) => {
      logger.error("[generate-content] Notion sync failed:", {
        error: err.message,
        contentId: contentItem.id,
      });
    });

    logger.info("[generate-content] Innhold generert:", {
      contentId: contentItem.id,
      type: input.type,
      userId: user.id,
    });

    return NextResponse.json({
      id: contentItem.id,
      type: contentItem.type,
      status: contentItem.status,
      title: contentItem.title,
      slug: contentItem.slug,
      body: contentItem.body,
      excerpt: contentItem.excerpt,
      hashtags: contentItem.hashtags,
      platform: contentItem.platform,
      segment: contentItem.segment,
      aiGenerated: true,
      aiModel: "claude-sonnet-4-5",
      createdAt: contentItem.createdAt,
    });
  } catch (error) {
    const message =
      error instanceof SyntaxError
        ? "Kunne ikke tolke AI-respons"
        : "Feil ved generering av innhold";

    logger.error("[generate-content] Error:", {
      error: error instanceof Error ? error.message : "Unknown",
      type: input.type,
      userId: user.id,
    });

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
