import { NextRequest, NextResponse } from "next/server";

// Lazy initialization av Resend for å unngå byggefeil
let resendInstance: any = null;
function getResend() {
  if (!resendInstance) {
    const { Resend } = require("resend");
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "post@akgolf.no";

export async function POST(req: NextRequest) {
  try {
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
      from: "AK Golf Website <kontakt@akgolf.no>",
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `Ny henvendelse fra ${name} - AK Golf`,
      html: `
        <h2>Ny henvendelse fra nettsiden</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Navn:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">E-post:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Telefon:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${phone || "Ikke oppgitt"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Handicap:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${handicap || "Ikke oppgitt"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Program:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${program || "Ikke valgt"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; vertical-align: top;">Melding:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${message?.replace(/\n/g, "<br>") || "Ingen melding"}</td>
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
