#!/usr/bin/env tsx
/**
 * Pre-deploy sjekkliste
 * 
 * Kjøres før hver produksjonsdeploy for å verifisere at alt er klart.
 * 
 * Usage:
 *   npm run pre-deploy
 *   # eller
 *   npx tsx scripts/pre-deploy-check.ts
 */

import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

interface CheckResult {
  name: string;
  status: "pass" | "fail" | "warn";
  message: string;
}

const results: CheckResult[] = [];

function log(message: string) {
  console.log(message);
}

function success(message: string) {
  console.log(`${GREEN}✓${RESET} ${message}`);
}

function error(message: string) {
  console.log(`${RED}✗${RESET} ${message}`);
}

function warn(message: string) {
  console.log(`${YELLOW}⚠${RESET} ${message}`);
}

// Sjekker
async function checkEnvFile(): Promise<CheckResult> {
  const envPath = join(process.cwd(), ".env.production");
  if (!existsSync(envPath)) {
    return {
      name: ".env.production finnes",
      status: "fail",
      message: ".env.production finnes ikke - kopier fra .env.example",
    };
  }
  
  const envContent = readFileSync(envPath, "utf-8");
  const required = [
    "NEXT_PUBLIC_APP_URL",
    "DATABASE_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
  ];
  
  const missing = required.filter(key => 
    !envContent.includes(key) || envContent.includes(`${key}=your_`) || envContent.includes(`${key}=xxx`)
  );
  
  if (missing.length > 0) {
    return {
      name: ".env.production er konfigurert",
      status: "fail",
      message: `Mangler eller har placeholder verdier for: ${missing.join(", ")}`,
    };
  }
  
  return {
    name: ".env.production er konfigurert",
    status: "pass",
    message: "Alle nødvendige variabler er satt",
  };
}

async function checkStripeKeys(): Promise<CheckResult> {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeKey) {
    return {
      name: "Stripe keys",
      status: "warn",
      message: "STRIPE_SECRET_KEY ikke satt - sjekk .env.production",
    };
  }
  
  const isLive = stripeKey.startsWith("sk_live_");
  const isTest = stripeKey.startsWith("sk_test_");
  
  if (isTest) {
    return {
      name: "Stripe mode",
      status: "warn",
      message: "Bruker TEST keys - bytt til LIVE keys før produksjon",
    };
  }
  
  if (isLive) {
    return {
      name: "Stripe mode",
      status: "pass",
      message: "Bruker LIVE keys - klar for produksjon",
    };
  }
  
  return {
    name: "Stripe keys",
    status: "fail",
    message: "Ugyldig Stripe key format",
  };
}

async function checkBuild(): Promise<CheckResult> {
  try {
    log("Kjører bygg... (dette kan ta noen minutter)");
    execSync("npm run build", { stdio: "pipe" });
    return {
      name: "Build",
      status: "pass",
      message: "Bygg fullført uten feil",
    };
  } catch (e) {
    return {
      name: "Build",
      status: "fail",
      message: "Bygg feilet - se output over",
    };
  }
}

async function checkLint(): Promise<CheckResult> {
  try {
    execSync("npm run lint", { stdio: "pipe" });
    return {
      name: "Linting",
      status: "pass",
      message: "Ingen linting-feil",
    };
  } catch (e) {
    return {
      name: "Linting",
      status: "fail",
      message: "Linting-feil funnet",
    };
  }
}

async function checkTests(): Promise<CheckResult> {
  try {
    execSync("npm test", { stdio: "pipe" });
    return {
      name: "Tester",
      status: "pass",
      message: "Alle tester passerer",
    };
  } catch (e) {
    return {
      name: "Tester",
      status: "fail",
      message: "Tester feilet",
    };
  }
}

async function checkVercelConfig(): Promise<CheckResult> {
  const vercelPath = join(process.cwd(), "vercel.json");
  if (!existsSync(vercelPath)) {
    return {
      name: "vercel.json finnes",
      status: "fail",
      message: "vercel.json mangler",
    };
  }
  
  return {
    name: "vercel.json finnes",
    status: "pass",
    message: "Vercel konfigurasjon funnet",
  };
}

async function checkHealthEndpoints(): Promise<CheckResult> {
  const healthPath = join(process.cwd(), "app", "api", "health", "route.ts");
  if (!existsSync(healthPath)) {
    return {
      name: "Health check endpoint",
      status: "fail",
      message: "/api/health/route.ts mangler",
    };
  }
  
  return {
    name: "Health check endpoint",
    status: "pass",
    message: "Health check er implementert",
  };
}

async function checkConsoleLogs(): Promise<CheckResult> {
  // Sjekk etter console.log i produksjonskode (unntatt i api routes og spesifikke filer)
  try {
    const output = execSync(
      'grep -r "console.log" app --include="*.tsx" --include="*.ts" | grep -v "node_modules" | grep -v ".test." | grep -v "api/" | head -20',
      { encoding: "utf-8" }
    );
    
    if (output.trim()) {
      return {
        name: "Console.log sjekk",
        status: "warn",
        message: `Fant console.log i klient-kode:\n${output}`,
      };
    }
    
    return {
      name: "Console.log sjekk",
      status: "pass",
      message: "Ingen console.log funnet i klient-kode",
    };
  } catch (e) {
    // grep returnerer 1 hvis ingen treff funnet, noe som er bra
    return {
      name: "Console.log sjekk",
      status: "pass",
      message: "Ingen console.log funnet i klient-kode",
    };
  }
}

// Hovedfunksjon
async function main() {
  log("\n" + "=".repeat(60));
  log("🔍 PRE-DEPLOY SJEKKLISTE");
  log("=".repeat(60) + "\n");
  
  // Rask sjekker først
  results.push(await checkEnvFile());
  results.push(await checkStripeKeys());
  results.push(await checkVercelConfig());
  results.push(await checkHealthEndpoints());
  results.push(await checkConsoleLogs());
  
  // Vis resultater så langt
  results.forEach(r => {
    if (r.status === "pass") success(`${r.name}: ${r.message}`);
    if (r.status === "fail") error(`${r.name}: ${r.message}`);
    if (r.status === "warn") warn(`${r.name}: ${r.message}`);
  });
  
  // Stopp hvis kritiske feil
  const criticalFails = results.filter(r => r.status === "fail");
  if (criticalFails.length > 0) {
    log("\n" + RED + "Kritiske feil funnet! Fix disse før deploy:" + RESET);
    criticalFails.forEach(r => error(r.message));
    process.exit(1);
  }
  
  // Kjør bygg, lint og tester
  log("\n" + "-".repeat(60));
  log("Kjører bygg, lint og tester...\n");
  
  results.push(await checkLint());
  results.push(await checkTests());
  results.push(await checkBuild());
  
  // Oppsummering
  log("\n" + "=".repeat(60));
  log("OPPSUMMERING");
  log("=".repeat(60));
  
  const passed = results.filter(r => r.status === "pass").length;
  const failed = results.filter(r => r.status === "fail").length;
  const warnings = results.filter(r => r.status === "warn").length;
  
  log(`\n${GREEN}${passed} sjekker OK${RESET}`);
  if (warnings > 0) log(`${YELLOW}${warnings} advarsler${RESET}`);
  if (failed > 0) log(`${RED}${failed} feil${RESET}`);
  
  if (failed > 0) {
    log("\n" + RED + "❌ Deploy blokkert - fix feilene over først" + RESET);
    process.exit(1);
  } else if (warnings > 0) {
    log("\n" + YELLOW + "⚠️  Deploy mulig, men se advarsler over" + RESET);
    process.exit(0);
  } else {
    log("\n" + GREEN + "✅ Klar for produksjonsdeploy!" + RESET);
    process.exit(0);
  }
}

main().catch(e => {
  console.error("Uventet feil:", e);
  process.exit(1);
});
