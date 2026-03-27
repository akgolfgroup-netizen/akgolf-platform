# AK Golf Monorepo Konsolidering — Implementeringsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Konsolidere akgolf-website og akgolf-dashboard til ett monorepo med pnpm workspaces og delte pakker.

**Architecture:** Turborepo monorepo med tre apps (website, dashboard, docs) og fem delte pakker (database, ui, auth, integrations, config). Én Prisma-schema, delt typesystem, felles CI/CD.

**Tech Stack:** pnpm workspaces, Turborepo, Next.js 16, Prisma 7.5, Supabase Auth, TypeScript 5.9

---

## Scope

Denne planen dekker:
1. Monorepo-oppsett med pnpm workspaces
2. Migrering av eksisterende kode
3. Delte pakker for felles funksjonalitet
4. Oppdatert CI/CD og deploy

**Ikke inkludert:** Refaktorering av app-logikk, nye features, UI-redesign.

---

## Filstruktur (etter konsolidering)

```
akgolf/                           # Monorepo root
├── pnpm-workspace.yaml
├── turbo.json
├── package.json                  # Root scripts
├── .env.example
├── .gitignore
│
├── apps/
│   ├── website/                  # Fra akgolf-website (port 3000)
│   │   ├── app/
│   │   ├── components/
│   │   ├── package.json
│   │   └── next.config.ts
│   │
│   └── dashboard/                # Fra akgolf-dashboard (port 3003)
│       ├── app/
│       ├── components/
│       ├── package.json
│       └── next.config.ts
│
├── packages/
│   ├── database/                 # Prisma schema + client
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   └── index.ts          # Export PrismaClient singleton
│   │   └── package.json
│   │
│   ├── auth/                     # Supabase auth helpers
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── server.ts         # createServerClient
│   │   │   ├── client.ts         # createBrowserClient
│   │   │   └── rbac.ts           # Rollebasert tilgang
│   │   └── package.json
│   │
│   ├── integrations/             # Eksterne API-klienter
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── stripe.ts
│   │   │   ├── anthropic.ts
│   │   │   ├── resend.ts
│   │   │   ├── twilio.ts
│   │   │   ├── notion.ts
│   │   │   └── google-calendar.ts
│   │   └── package.json
│   │
│   ├── ui/                       # Delte UI-komponenter
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   └── package.json
│   │
│   └── config/                   # Delt konfigurasjon
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
│
└── tooling/
    └── scripts/                  # Build/deploy scripts
```

---

## Task 1: Opprett monorepo-struktur

**Files:**
- Create: `akgolf/pnpm-workspace.yaml`
- Create: `akgolf/turbo.json`
- Create: `akgolf/package.json`
- Create: `akgolf/.gitignore`
- Create: `akgolf/.npmrc`

- [ ] **Step 1: Opprett ny monorepo-mappe**

```bash
cd ~/Developer/akgolf
mkdir akgolf-monorepo
cd akgolf-monorepo
git init
```

- [ ] **Step 2: Opprett pnpm-workspace.yaml**

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 3: Opprett turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "db:generate": {
      "cache": false
    },
    "db:push": {
      "cache": false
    }
  }
}
```

- [ ] **Step 4: Opprett root package.json**

```json
{
  "name": "akgolf",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@9.15.0",
  "scripts": {
    "dev": "turbo dev",
    "dev:website": "turbo dev --filter=@akgolf/website",
    "dev:dashboard": "turbo dev --filter=@akgolf/dashboard",
    "build": "turbo build",
    "lint": "turbo lint",
    "db:generate": "turbo db:generate",
    "db:push": "pnpm --filter=@akgolf/database db:push",
    "clean": "turbo clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^2.5.0",
    "typescript": "5.9.3"
  }
}
```

- [ ] **Step 5: Opprett .npmrc**

```ini
# .npmrc
auto-install-peers=true
strict-peer-dependencies=false
```

- [ ] **Step 6: Opprett .gitignore**

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build
.next/
dist/
.turbo/

# Environment
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.swp

# Prisma
prisma/migrations/migration_lock.toml

# OS
.DS_Store
Thumbs.db
```

- [ ] **Step 7: Verifiser struktur**

```bash
ls -la
# Forventet: pnpm-workspace.yaml, turbo.json, package.json, .gitignore, .npmrc
```

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "chore: initialize monorepo structure

- Add pnpm-workspace.yaml for workspace config
- Add turbo.json for task orchestration
- Add root package.json with workspace scripts

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Opprett @akgolf/database pakke

**Files:**
- Create: `packages/database/package.json`
- Create: `packages/database/tsconfig.json`
- Create: `packages/database/src/index.ts`
- Move: `akgolf-website/prisma/schema.prisma` → `packages/database/prisma/schema.prisma`

- [ ] **Step 1: Opprett mappestruktur**

```bash
mkdir -p packages/database/src
mkdir -p packages/database/prisma
```

- [ ] **Step 2: Opprett package.json**

```json
{
  "name": "@akgolf/database",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./client": "./src/client.ts"
  },
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/adapter-pg": "^7.5.0",
    "@prisma/client": "^7.5.0",
    "pg": "^8.20.0"
  },
  "devDependencies": {
    "@types/pg": "^8.11.11",
    "prisma": "^7.5.0",
    "typescript": "5.9.3"
  }
}
```

- [ ] **Step 3: Opprett tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 4: Kopier Prisma schema fra website**

```bash
cp ../akgolf-website/prisma/schema.prisma packages/database/prisma/
```

- [ ] **Step 5: Opprett src/index.ts (re-eksporter alt)**

```typescript
// packages/database/src/index.ts
export * from "@prisma/client";
export { prisma } from "./client";
```

- [ ] **Step 6: Opprett src/client.ts (singleton)**

```typescript
// packages/database/src/client.ts
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

- [ ] **Step 7: Verifiser pakkestruktur**

```bash
ls -la packages/database/
# Forventet: package.json, tsconfig.json, src/, prisma/
ls -la packages/database/src/
# Forventet: index.ts, client.ts
ls -la packages/database/prisma/
# Forventet: schema.prisma
```

- [ ] **Step 8: Commit**

```bash
git add packages/database/
git commit -m "feat(database): add @akgolf/database package

- Prisma schema (consolidated from website)
- PrismaClient singleton with PrismaPg adapter
- Re-export all Prisma types

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Opprett @akgolf/auth pakke

**Files:**
- Create: `packages/auth/package.json`
- Create: `packages/auth/tsconfig.json`
- Create: `packages/auth/src/index.ts`
- Create: `packages/auth/src/server.ts`
- Create: `packages/auth/src/client.ts`
- Create: `packages/auth/src/rbac.ts`

- [ ] **Step 1: Opprett mappestruktur**

```bash
mkdir -p packages/auth/src
```

- [ ] **Step 2: Opprett package.json**

```json
{
  "name": "@akgolf/auth",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./server": "./src/server.ts",
    "./client": "./src/client.ts",
    "./rbac": "./src/rbac.ts"
  },
  "dependencies": {
    "@supabase/ssr": "^0.8.0",
    "@supabase/supabase-js": "^2.98.0"
  },
  "peerDependencies": {
    "@akgolf/database": "workspace:*",
    "next": ">=16.0.0"
  },
  "devDependencies": {
    "typescript": "5.9.3"
  }
}
```

- [ ] **Step 3: Opprett src/server.ts**

```typescript
// packages/auth/src/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore - called from Server Component
          }
        },
      },
    }
  );
}

export async function getSupabaseUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
```

- [ ] **Step 4: Opprett src/client.ts**

```typescript
// packages/auth/src/client.ts
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 5: Opprett src/rbac.ts**

```typescript
// packages/auth/src/rbac.ts
import type { UserRole, DashboardRole } from "@akgolf/database";

// Portal RBAC (for website portal)
export function hasPortalAccess(role: UserRole | null, requiredRole: UserRole): boolean {
  if (!role) return false;

  const roleHierarchy: Record<UserRole, number> = {
    STUDENT: 1,
    INSTRUCTOR: 2,
    ADMIN: 3,
  };

  return roleHierarchy[role] >= roleHierarchy[requiredRole];
}

export function isPortalAdmin(role: UserRole | null): boolean {
  return role === "ADMIN";
}

export function isPortalInstructor(role: UserRole | null): boolean {
  return role === "INSTRUCTOR" || role === "ADMIN";
}

// Dashboard RBAC (for internal dashboard)
export type DashboardModule =
  | "spillere"
  | "kalender"
  | "bookinger"
  | "oppgaver"
  | "okonomi"
  | "system"
  | "agenter"
  | "turneringer"
  | "junior-academy";

const dashboardModuleAccess: Record<DashboardModule, DashboardRole[]> = {
  spillere: ["ADMIN", "INSTRUCTOR", "VOLUNTEER"],
  kalender: ["ADMIN", "INSTRUCTOR", "VOLUNTEER", "CLUB_REP"],
  bookinger: ["ADMIN", "INSTRUCTOR"],
  oppgaver: ["ADMIN", "INSTRUCTOR", "CLUB_REP"],
  okonomi: ["ADMIN"],
  system: ["ADMIN"],
  agenter: ["ADMIN", "INSTRUCTOR"],
  turneringer: ["ADMIN", "INSTRUCTOR"],
  "junior-academy": ["ADMIN", "INSTRUCTOR"],
};

export function hasDashboardAccess(
  role: DashboardRole | null,
  module: DashboardModule
): boolean {
  if (!role) return false;
  return dashboardModuleAccess[module].includes(role);
}

export function isDashboardAdmin(role: DashboardRole | null): boolean {
  return role === "ADMIN";
}
```

- [ ] **Step 6: Opprett src/index.ts**

```typescript
// packages/auth/src/index.ts
export * from "./server";
export * from "./client";
export * from "./rbac";
```

- [ ] **Step 7: Verifiser pakkestruktur**

```bash
ls -la packages/auth/src/
# Forventet: index.ts, server.ts, client.ts, rbac.ts
```

- [ ] **Step 8: Commit**

```bash
git add packages/auth/
git commit -m "feat(auth): add @akgolf/auth package

- Supabase server/client helpers
- RBAC for portal and dashboard
- Type-safe role checking

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Opprett @akgolf/integrations pakke

**Files:**
- Create: `packages/integrations/package.json`
- Create: `packages/integrations/src/index.ts`
- Create: `packages/integrations/src/stripe.ts`
- Create: `packages/integrations/src/anthropic.ts`
- Create: `packages/integrations/src/resend.ts`
- Create: `packages/integrations/src/twilio.ts`
- Create: `packages/integrations/src/notion.ts`
- Create: `packages/integrations/src/google-calendar.ts`

- [ ] **Step 1: Opprett mappestruktur**

```bash
mkdir -p packages/integrations/src
```

- [ ] **Step 2: Opprett package.json**

```json
{
  "name": "@akgolf/integrations",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./stripe": "./src/stripe.ts",
    "./anthropic": "./src/anthropic.ts",
    "./resend": "./src/resend.ts",
    "./twilio": "./src/twilio.ts",
    "./notion": "./src/notion.ts",
    "./google-calendar": "./src/google-calendar.ts"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.80.0",
    "@notionhq/client": "^5.13.0",
    "googleapis": "^171.4.0",
    "resend": "^6.9.2",
    "stripe": "^20.4.1",
    "twilio": "^5.7.0"
  },
  "devDependencies": {
    "typescript": "5.9.3"
  }
}
```

- [ ] **Step 3: Opprett src/stripe.ts**

```typescript
// packages/integrations/src/stripe.ts
import Stripe from "stripe";

const globalForStripe = globalThis as unknown as {
  stripe: Stripe | undefined;
};

function createStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }
  return new Stripe(secretKey);
}

// Lazy initialization via Proxy
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    if (!globalForStripe.stripe) {
      globalForStripe.stripe = createStripeClient();
    }
    return Reflect.get(globalForStripe.stripe, prop);
  },
});

// Type re-exports
export type { Stripe };
```

- [ ] **Step 4: Opprett src/anthropic.ts**

```typescript
// packages/integrations/src/anthropic.ts
import Anthropic from "@anthropic-ai/sdk";

const globalForAnthropic = globalThis as unknown as {
  anthropic: Anthropic | undefined;
};

function createAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }
  return new Anthropic({ apiKey });
}

export const anthropic = new Proxy({} as Anthropic, {
  get(_, prop) {
    if (!globalForAnthropic.anthropic) {
      globalForAnthropic.anthropic = createAnthropicClient();
    }
    return Reflect.get(globalForAnthropic.anthropic, prop);
  },
});

// Common model IDs
export const CLAUDE_MODELS = {
  OPUS: "claude-opus-4-6",
  SONNET: "claude-sonnet-4-6",
  HAIKU: "claude-haiku-4-5-20251001",
} as const;

export type { Anthropic };
```

- [ ] **Step 5: Opprett src/resend.ts**

```typescript
// packages/integrations/src/resend.ts
import { Resend } from "resend";

const globalForResend = globalThis as unknown as {
  resend: Resend | undefined;
};

function createResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
}

export const resend = new Proxy({} as Resend, {
  get(_, prop) {
    if (!globalForResend.resend) {
      globalForResend.resend = createResendClient();
    }
    return Reflect.get(globalForResend.resend, prop);
  },
});

export type { Resend };
```

- [ ] **Step 6: Opprett src/twilio.ts**

```typescript
// packages/integrations/src/twilio.ts
import twilio from "twilio";

type TwilioClient = ReturnType<typeof twilio>;

const globalForTwilio = globalThis as unknown as {
  twilioClient: TwilioClient | undefined;
};

function createTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set");
  }

  return twilio(accountSid, authToken);
}

export const twilioClient = new Proxy({} as TwilioClient, {
  get(_, prop) {
    if (!globalForTwilio.twilioClient) {
      globalForTwilio.twilioClient = createTwilioClient();
    }
    return Reflect.get(globalForTwilio.twilioClient, prop);
  },
});

export function formatNorwegianPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("47")) {
    return `+${cleaned}`;
  }
  if (cleaned.length === 8) {
    return `+47${cleaned}`;
  }
  return `+${cleaned}`;
}
```

- [ ] **Step 7: Opprett src/notion.ts**

```typescript
// packages/integrations/src/notion.ts
import { Client } from "@notionhq/client";

const globalForNotion = globalThis as unknown as {
  notion: Client | undefined;
};

function createNotionClient() {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    throw new Error("NOTION_API_KEY environment variable is not set");
  }
  return new Client({ auth: apiKey });
}

export const notion = new Proxy({} as Client, {
  get(_, prop) {
    if (!globalForNotion.notion) {
      globalForNotion.notion = createNotionClient();
    }
    return Reflect.get(globalForNotion.notion, prop);
  },
});

export type { Client as NotionClient };
```

- [ ] **Step 8: Opprett src/google-calendar.ts**

```typescript
// packages/integrations/src/google-calendar.ts
import { google, calendar_v3 } from "googleapis";

export function createOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google-calendar/callback`
  );
}

export function createCalendarClient(accessToken: string, refreshToken: string) {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  return google.calendar({ version: "v3", auth: oauth2Client });
}

export function getAuthUrl(state: string): string {
  const oauth2Client = createOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
    state,
    prompt: "consent",
  });
}

export type { calendar_v3 };
```

- [ ] **Step 9: Opprett src/index.ts**

```typescript
// packages/integrations/src/index.ts
export { stripe, type Stripe } from "./stripe";
export { anthropic, CLAUDE_MODELS, type Anthropic } from "./anthropic";
export { resend, type Resend } from "./resend";
export { twilioClient, formatNorwegianPhone } from "./twilio";
export { notion, type NotionClient } from "./notion";
export {
  createOAuth2Client,
  createCalendarClient,
  getAuthUrl,
  type calendar_v3,
} from "./google-calendar";
```

- [ ] **Step 10: Commit**

```bash
git add packages/integrations/
git commit -m "feat(integrations): add @akgolf/integrations package

- Stripe payment client
- Anthropic AI client with model constants
- Resend email client
- Twilio SMS client with Norwegian phone formatting
- Notion API client
- Google Calendar OAuth helpers

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Opprett @akgolf/config pakke

**Files:**
- Create: `packages/config/package.json`
- Create: `packages/config/eslint/base.js`
- Create: `packages/config/typescript/base.json`
- Create: `packages/config/tailwind/preset.ts`

- [ ] **Step 1: Opprett mappestruktur**

```bash
mkdir -p packages/config/eslint
mkdir -p packages/config/typescript
mkdir -p packages/config/tailwind
```

- [ ] **Step 2: Opprett package.json**

```json
{
  "name": "@akgolf/config",
  "version": "1.0.0",
  "private": true,
  "exports": {
    "./eslint": "./eslint/base.js",
    "./typescript/base": "./typescript/base.json",
    "./tailwind": "./tailwind/preset.ts"
  },
  "devDependencies": {
    "eslint": "^9",
    "eslint-config-next": "16.2.0",
    "tailwindcss": "^4",
    "typescript": "5.9.3"
  }
}
```

- [ ] **Step 3: Opprett eslint/base.js**

```javascript
// packages/config/eslint/base.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];

export default eslintConfig;
```

- [ ] **Step 4: Opprett typescript/base.json**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@akgolf/database": ["../../packages/database/src"],
      "@akgolf/auth": ["../../packages/auth/src"],
      "@akgolf/auth/*": ["../../packages/auth/src/*"],
      "@akgolf/integrations": ["../../packages/integrations/src"],
      "@akgolf/integrations/*": ["../../packages/integrations/src/*"],
      "@akgolf/ui": ["../../packages/ui/src"],
      "@akgolf/ui/*": ["../../packages/ui/src/*"]
    }
  },
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Opprett tailwind/preset.ts**

```typescript
// packages/config/tailwind/preset.ts
import type { Config } from "tailwindcss";

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        // AK Golf Brand System v5.0 Final
        navy: "#000000",
        gold: "#B07D4F",
        bronze: {
          DEFAULT: "#B07D4F",
          light: "#F3EBE2",
          dark: "#8E6340",
        },
        ink: {
          5: "#F5F5F5",
          10: "#E5E5E5",
          20: "#CCCCCC",
          40: "#999999",
          60: "#666666",
          80: "#333333",
          100: "#000000",
        },
        // Semantic colors
        success: "#10B981",
        error: "#EF4444",
        warning: "#F59E0B",
        info: "#38BDF8",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
    },
  },
};

export default preset;
```

- [ ] **Step 6: Opprett root tsconfig.base.json**

```bash
# I monorepo root
cat > tsconfig.base.json << 'EOF'
{
  "extends": "./packages/config/typescript/base.json"
}
EOF
```

- [ ] **Step 7: Commit**

```bash
git add packages/config/ tsconfig.base.json
git commit -m "feat(config): add @akgolf/config package

- Shared ESLint config (Next.js + TypeScript strict)
- Base TypeScript config with workspace paths
- Tailwind preset with AK Golf brand tokens

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 6: Migrer website-appen

**Files:**
- Move: `akgolf-website/` → `apps/website/`
- Modify: `apps/website/package.json`
- Modify: `apps/website/tsconfig.json`
- Delete: `apps/website/lib/portal/prisma.ts` (bruk @akgolf/database)
- Delete: `apps/website/lib/supabase/` (bruk @akgolf/auth)

- [ ] **Step 1: Kopier website til apps/**

```bash
mkdir -p apps
cp -r ../akgolf-website apps/website
rm -rf apps/website/node_modules
rm -rf apps/website/.next
rm -rf apps/website/.git
```

- [ ] **Step 2: Oppdater package.json**

```json
{
  "name": "@akgolf/website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@akgolf/auth": "workspace:*",
    "@akgolf/database": "workspace:*",
    "@akgolf/integrations": "workspace:*",
    "@base-ui/react": "^1.3.0",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@react-email/components": "^1.0.9",
    "@react-pdf/renderer": "^4.3.2",
    "@stripe/react-stripe-js": "^5.6.1",
    "@stripe/stripe-js": "^8.9.0",
    "@vercel/analytics": "^2.0.1",
    "@vercel/speed-insights": "^2.0.0",
    "bcrypt": "^6.0.0",
    "cheerio": "^1.2.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "framer-motion": "^12.34.0",
    "lucide-react": "^0.577.0",
    "motion": "^12.36.0",
    "nanoid": "^5.1.5",
    "next": "16.1.6",
    "next-themes": "^0.4.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-dropzone": "^15.0.0",
    "recharts": "^3.8.0",
    "shadcn": "^4.0.7",
    "tailwind-merge": "^3.5.0",
    "tw-animate-css": "^1.4.0"
  },
  "devDependencies": {
    "@akgolf/config": "workspace:*",
    "@tailwindcss/postcss": "^4",
    "@types/bcrypt": "^6.0.0",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "dotenv": "^17.3.1",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "tailwindcss": "^4",
    "typescript": "5.9.3"
  }
}
```

- [ ] **Step 3: Oppdater tsconfig.json**

```json
{
  "extends": "@akgolf/config/typescript/base",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*", "./*"],
      "@akgolf/database": ["../../packages/database/src"],
      "@akgolf/auth": ["../../packages/auth/src"],
      "@akgolf/auth/*": ["../../packages/auth/src/*"],
      "@akgolf/integrations": ["../../packages/integrations/src"],
      "@akgolf/integrations/*": ["../../packages/integrations/src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Oppdater imports i lib/portal/prisma.ts**

```typescript
// apps/website/lib/portal/prisma.ts
// Re-eksporter fra workspace-pakke
export { prisma } from "@akgolf/database";
```

- [ ] **Step 5: Oppdater imports i lib/supabase/server.ts**

```typescript
// apps/website/lib/supabase/server.ts
export { createSupabaseServerClient } from "@akgolf/auth/server";
```

- [ ] **Step 6: Oppdater imports i lib/supabase/client.ts**

```typescript
// apps/website/lib/supabase/client.ts
export { createSupabaseBrowserClient } from "@akgolf/auth/client";
```

- [ ] **Step 7: Slett prisma-mappe (bruker workspace-pakke)**

```bash
rm -rf apps/website/prisma
```

- [ ] **Step 8: Verifiser struktur**

```bash
ls -la apps/website/
# Skal ha: app/, components/, lib/, package.json, tsconfig.json, next.config.ts
```

- [ ] **Step 9: Commit**

```bash
git add apps/website/
git commit -m "feat(website): migrate akgolf-website to apps/website

- Update package.json to use workspace dependencies
- Re-export database and auth from workspace packages
- Remove local prisma folder (use @akgolf/database)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Migrer dashboard-appen

**Files:**
- Move: `akgolf-dashboard/` → `apps/dashboard/`
- Modify: `apps/dashboard/package.json`
- Modify: `apps/dashboard/tsconfig.json`

- [ ] **Step 1: Kopier dashboard til apps/**

```bash
cp -r ../akgolf-dashboard apps/dashboard
rm -rf apps/dashboard/node_modules
rm -rf apps/dashboard/.next
rm -rf apps/dashboard/.git
```

- [ ] **Step 2: Oppdater package.json**

```json
{
  "name": "@akgolf/dashboard",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3003",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@akgolf/auth": "workspace:*",
    "@akgolf/database": "workspace:*",
    "@akgolf/integrations": "workspace:*",
    "@headlessui/react": "^2.2.9",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "framer-motion": "^12.38.0",
    "lucide-react": "^0.577.0",
    "motion": "^12.38.0",
    "next": "16.2.0",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "recharts": "^3.8.0",
    "tailwind-merge": "^3.5.0"
  },
  "devDependencies": {
    "@akgolf/config": "workspace:*",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.0",
    "tailwindcss": "^4",
    "typescript": "5.9.3"
  }
}
```

- [ ] **Step 3: Oppdater tsconfig.json**

```json
{
  "extends": "@akgolf/config/typescript/base",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*", "./*"],
      "@akgolf/database": ["../../packages/database/src"],
      "@akgolf/auth": ["../../packages/auth/src"],
      "@akgolf/auth/*": ["../../packages/auth/src/*"],
      "@akgolf/integrations": ["../../packages/integrations/src"],
      "@akgolf/integrations/*": ["../../packages/integrations/src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Oppdater lib/prisma.ts**

```typescript
// apps/dashboard/lib/prisma.ts
export { prisma } from "@akgolf/database";
```

- [ ] **Step 5: Oppdater lib/supabase/server.ts**

```typescript
// apps/dashboard/lib/supabase/server.ts
export { createSupabaseServerClient } from "@akgolf/auth/server";
```

- [ ] **Step 6: Slett lokal prisma-mappe**

```bash
rm -rf apps/dashboard/prisma
```

- [ ] **Step 7: Verifiser struktur**

```bash
ls -la apps/dashboard/
```

- [ ] **Step 8: Commit**

```bash
git add apps/dashboard/
git commit -m "feat(dashboard): migrate akgolf-dashboard to apps/dashboard

- Update package.json to use workspace dependencies
- Re-export database and auth from workspace packages
- Remove local prisma folder (use @akgolf/database)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 8: Installer avhengigheter og verifiser

**Files:**
- Modify: `pnpm-lock.yaml` (generert)

- [ ] **Step 1: Installer pnpm hvis ikke installert**

```bash
npm install -g pnpm@9.15.0
```

- [ ] **Step 2: Installer alle avhengigheter**

```bash
cd ~/Developer/akgolf/akgolf-monorepo
pnpm install
```

- [ ] **Step 3: Generer Prisma-klient**

```bash
pnpm db:generate
```

- [ ] **Step 4: Typesjekk**

```bash
pnpm exec tsc --noEmit
```

- [ ] **Step 5: Lint**

```bash
pnpm lint
```

- [ ] **Step 6: Test dev-servere**

```bash
# Terminal 1
pnpm dev:website
# Åpne http://localhost:3000

# Terminal 2
pnpm dev:dashboard
# Åpne http://localhost:3003
```

- [ ] **Step 7: Test build**

```bash
pnpm build
```

- [ ] **Step 8: Commit lock-fil**

```bash
git add pnpm-lock.yaml
git commit -m "chore: add pnpm-lock.yaml

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 9: Oppsett Vercel deploy

**Files:**
- Create: `apps/website/vercel.json`
- Create: `apps/dashboard/vercel.json`

- [ ] **Step 1: Opprett apps/website/vercel.json**

```json
{
  "framework": "nextjs",
  "installCommand": "cd ../.. && pnpm install",
  "buildCommand": "cd ../.. && pnpm turbo build --filter=@akgolf/website"
}
```

- [ ] **Step 2: Opprett apps/dashboard/vercel.json**

```json
{
  "framework": "nextjs",
  "installCommand": "cd ../.. && pnpm install",
  "buildCommand": "cd ../.. && pnpm turbo build --filter=@akgolf/dashboard"
}
```

- [ ] **Step 3: Konfigurer Vercel prosjekter**

```bash
# For website
vercel link --cwd apps/website

# For dashboard
vercel link --cwd apps/dashboard
```

- [ ] **Step 4: Sett environment variables i Vercel**

Begge prosjektene trenger:
- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ANTHROPIC_API_KEY`
- `RESEND_API_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

- [ ] **Step 5: Commit**

```bash
git add apps/website/vercel.json apps/dashboard/vercel.json
git commit -m "chore: add Vercel config for monorepo deploy

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 10: Oppdater dokumentasjon

**Files:**
- Create: `README.md`
- Create: `CLAUDE.md`

- [ ] **Step 1: Opprett root README.md**

```markdown
# AK Golf Monorepo

Monorepo for AK Golf Group sine web-applikasjoner.

## Apps

| App | Port | Beskrivelse |
|-----|------|-------------|
| `@akgolf/website` | 3000 | Markedsside + kundeportal |
| `@akgolf/dashboard` | 3003 | Internt dashboard for ansatte |

## Packages

| Package | Beskrivelse |
|---------|-------------|
| `@akgolf/database` | Prisma schema og klient |
| `@akgolf/auth` | Supabase auth helpers + RBAC |
| `@akgolf/integrations` | Stripe, Claude, Resend, Twilio, Notion, Google Calendar |
| `@akgolf/config` | Delt ESLint, TypeScript, Tailwind konfig |

## Utvikling

```bash
# Installer avhengigheter
pnpm install

# Start alle apps
pnpm dev

# Start kun website
pnpm dev:website

# Start kun dashboard
pnpm dev:dashboard

# Build
pnpm build

# Lint
pnpm lint

# Database
pnpm db:generate  # Generer Prisma-klient
pnpm db:push      # Push schema til database
pnpm db:studio    # Åpne Prisma Studio
```

## Miljøvariabler

Kopier `.env.example` til `.env` i root og fyll inn verdier.
```

- [ ] **Step 2: Opprett root CLAUDE.md**

```markdown
# AK Golf Monorepo — CLAUDE.md

## Struktur

Dette er et pnpm monorepo med Turborepo for task-orkestrering.

- `apps/website` — Markedsside + kundeportal (port 3000)
- `apps/dashboard` — Internt dashboard (port 3003)
- `packages/database` — Prisma schema og klient
- `packages/auth` — Supabase auth helpers
- `packages/integrations` — Eksterne API-klienter
- `packages/config` — Delt konfigurasjon

## Viktige kommandoer

```bash
pnpm dev              # Start alle apps
pnpm dev:website      # Kun website
pnpm dev:dashboard    # Kun dashboard
pnpm build            # Build alle
pnpm db:generate      # Generer Prisma-klient
pnpm db:push          # Push schema til DB
```

## Workspace-avhengigheter

Bruk `workspace:*` for interne pakker:

```json
{
  "dependencies": {
    "@akgolf/database": "workspace:*",
    "@akgolf/auth": "workspace:*"
  }
}
```

## Database

Én Prisma-schema i `packages/database/prisma/schema.prisma`.
Begge apps importerer fra `@akgolf/database`.

## Gotchas

1. **Turbopack root:** Hver app trenger `turbopack: { root: import.meta.dirname }` i next.config.ts
2. **Workspace paths:** TypeScript paths må peke til `../../packages/*/src`
3. **Prisma generate:** Kjør `pnpm db:generate` etter schema-endringer
4. **Vercel deploy:** Hver app har egen vercel.json med monorepo-kommandoer
```

- [ ] **Step 3: Opprett .env.example**

```bash
# .env.example
# Database
DATABASE_URL=postgresql://user:pass@host:6543/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxx

# Resend
RESEND_API_KEY=re_xxx

# Twilio
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+47xxx

# Notion
NOTION_API_KEY=secret_xxx

# Google Calendar
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- [ ] **Step 4: Commit**

```bash
git add README.md CLAUDE.md .env.example
git commit -m "docs: add monorepo documentation

- README with project overview and commands
- CLAUDE.md with development guidelines
- .env.example with all required variables

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 11: Arkiver gamle repos

**Files:**
- Ingen filer endres i monorepo

- [ ] **Step 1: Arkiver akgolf-website**

```bash
cd ~/Developer/akgolf/akgolf-website
git tag -a v1.0.0-pre-monorepo -m "Last version before monorepo migration"
git push origin v1.0.0-pre-monorepo
```

- [ ] **Step 2: Arkiver akgolf-dashboard**

```bash
cd ~/Developer/akgolf/akgolf-dashboard
git tag -a v1.0.0-pre-monorepo -m "Last version before monorepo migration"
git push origin v1.0.0-pre-monorepo
```

- [ ] **Step 3: Rename gamle mapper**

```bash
cd ~/Developer/akgolf
mv akgolf-website akgolf-website-archived
mv akgolf-dashboard akgolf-dashboard-archived
```

- [ ] **Step 4: Rename monorepo til akgolf**

```bash
mv akgolf-monorepo akgolf
```

- [ ] **Step 5: Push monorepo til GitHub**

```bash
cd ~/Developer/akgolf/akgolf
gh repo create akgolf-group/akgolf --private --source=. --push
```

---

## Verifiseringssjekkliste

Etter fullført migrering, verifiser:

- [ ] `pnpm install` kjører uten feil
- [ ] `pnpm db:generate` genererer Prisma-klient
- [ ] `pnpm build` bygger begge apps
- [ ] `pnpm dev:website` starter på port 3000
- [ ] `pnpm dev:dashboard` starter på port 3003
- [ ] Website kan logge inn via Supabase
- [ ] Dashboard kan logge inn via Supabase
- [ ] Booking-flyt fungerer på website
- [ ] Kalender fungerer på dashboard
- [ ] Stripe-betalinger fungerer
- [ ] E-post sendes via Resend
- [ ] SMS sendes via Twilio

---

## Oppfølgingsoppgaver (ikke del av denne planen)

1. **Delt UI-pakke:** Flytt felles komponenter til `packages/ui`
2. **E2E-tester:** Sett opp Playwright for begge apps
3. **CI/CD:** GitHub Actions for lint, typecheck, build
4. **Storybook:** Dokumenter UI-komponenter
