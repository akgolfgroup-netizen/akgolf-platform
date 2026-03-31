import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { verifyCsrf } from "@/lib/portal/csrf";

/**
 * Escape HTML special characters to prevent XSS attacks.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Lazy initialization av Resend for å unngå byggefeil
let resendInstance: Resend | null = null;
function getResend(): Resend {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "post@akgolf.no";
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`contact:${clientIp}`, RATE_LIMITS.CONTACT_FORM);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "For mange forsøk. Prøv igjen senere." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } }
      );
    }

    // CSRF-beskyttelse
    if (!verifyCsrf(req)) {
      return NextResponse.json(
        { error: "Ugyldig forespørsel" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, phone, handicap, program, message } = body;

    // Validering
    if (!name || !email) {
      return NextResponse.json(
        { error: "Navn og e-post er påkrevd" },
        { status: 400 }
      );
    }

    const resend = getResend();

    // Send e-post
    const { data, error } = await resend.emails.send({
      from: `AK Golf Website <${FROM_EMAIL}>`,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `Ny henvendelse fra ${name} - AK Golf`,
      html: `
        <h2>Ny henvendelse fra nettsiden</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Navn:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">E-post:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(email)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Telefon:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(phone || "Ikke oppgitt")}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Handicap:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(handicap || "Ikke oppgitt")}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Program:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(program || "Ikke valgt")}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; vertical-align: top;">Melding:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(message || "Ingen melding").replace(/\n/g, "<br>")}</td>
          </tr>
        </table>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Kunne ikke sende e-post" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Noe gikk galt" },
      { status: 500 }
    );
  }
}
