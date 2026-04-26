// Whitelabel-konfigurasjon for B2B-tenants

export interface WhitelabelConfig {
  tenantId: string;
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  domain: string | null;
  features: {
    showAkGolfBranding: boolean; // "Powered by AK Golf"
    customLoginPage: boolean;
    customEmailTemplates: boolean;
  };
}

const DEFAULT_CONFIG: WhitelabelConfig = {
  tenantId: "default",
  brandName: "AK Golf Academy",
  primaryColor: "#0d2f0e",
  secondaryColor: "#c5a572",
  logoUrl: null,
  domain: null,
  features: {
    showAkGolfBranding: true,
    customLoginPage: false,
    customEmailTemplates: false,
  },
};

let cachedConfig: WhitelabelConfig | null = null;

/**
 * Hent whitelabel-konfigurasjon for nåværende tenant.
 * I produksjon: hent fra DB basert på domain eller header.
 */
export async function getWhitelabelConfig(
  tenantId?: string
): Promise<WhitelabelConfig> {
  if (!tenantId) return DEFAULT_CONFIG;

  if (cachedConfig?.tenantId === tenantId) {
    return cachedConfig;
  }

  try {
    const response = await fetch(`${process.env.MCP_SERVER_URL}/resources/${encodeURIComponent(`ak-golf://tenants/${tenantId}`)}`, {
      headers: { Authorization: `Bearer ${process.env.MCP_API_KEY}` },
    });

    if (!response.ok) return DEFAULT_CONFIG;

    const data = (await response.json()) as { content: string };
    const tenant = JSON.parse(data.content) as {
      brandName: string;
      primaryColor: string;
      secondaryColor: string;
      logoUrl: string | null;
      domain: string | null;
      tier: string;
    };

    const config: WhitelabelConfig = {
      tenantId,
      brandName: tenant.brandName,
      primaryColor: tenant.primaryColor ?? DEFAULT_CONFIG.primaryColor,
      secondaryColor: tenant.secondaryColor ?? DEFAULT_CONFIG.secondaryColor,
      logoUrl: tenant.logoUrl,
      domain: tenant.domain,
      features: {
        showAkGolfBranding: tenant.tier !== "ENTERPRISE",
        customLoginPage: tenant.tier !== "STARTER",
        customEmailTemplates: tenant.tier === "ENTERPRISE",
      },
    };

    cachedConfig = config;
    return config;
  } catch {
    return DEFAULT_CONFIG;
  }
}

/**
 * Generer CSS-variabler for whitelabel.
 * Brukes i Next.js layout som inline-style.
 */
export function generateWhitelabelCSS(config: WhitelabelConfig): string {
  return `
:root {
  --brand-primary: ${config.primaryColor};
  --brand-secondary: ${config.secondaryColor};
}
`.trim();
}

/**
 * Tenant-resolver fra request.
 * Sjekker (i prioritert rekkefølge):
 * 1. X-Tenant-ID header
 * 2. Subdomain (gfgk.akgolf.no → "gfgk")
 * 3. Custom domain
 */
export function resolveTenantFromRequest(req: Request): string | null {
  // 1. Header
  const tenantHeader = req.headers.get("x-tenant-id");
  if (tenantHeader) return tenantHeader;

  // 2. Subdomain
  const url = new URL(req.url);
  const hostname = url.hostname;

  if (hostname.endsWith(".akgolf.no")) {
    const sub = hostname.replace(".akgolf.no", "");
    if (sub && sub !== "www" && sub !== "app") return sub;
  }

  // 3. Custom domain — krever DB-lookup
  return null;
}
