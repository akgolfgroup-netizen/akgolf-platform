import { NextResponse } from "next/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { CustomerType, PaymentMethod } from "@prisma/client";
import { nanoid } from "nanoid";

export async function GET() {
  try {
    const user = await requirePortalUser();

    const preference = await prisma.customerPaymentPreference.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json(preference);
  } catch {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requirePortalUser();
    const body = await request.json();

    const {
      customerType,
      preferredMethod,
      companyName,
      orgNumber,
      invoiceEmail,
      invoiceAddress,
    } = body;

    // Validate enums
    if (customerType && !["PRIVATE", "BUSINESS"].includes(customerType)) {
      return NextResponse.json(
        { error: "Ugyldig kundetype" },
        { status: 400 }
      );
    }

    if (
      preferredMethod &&
      !["STRIPE", "VIPPS", "INVOICE", "NONE"].includes(preferredMethod)
    ) {
      return NextResponse.json(
        { error: "Ugyldig betalingsmetode" },
        { status: 400 }
      );
    }

    const preference = await prisma.customerPaymentPreference.upsert({
      where: { userId: user.id },
      create: {
        id: nanoid(),
        userId: user.id,
        customerType: (customerType as CustomerType) ?? "PRIVATE",
        preferredMethod: (preferredMethod as PaymentMethod) ?? "NONE",
        companyName: companyName ?? null,
        orgNumber: orgNumber ?? null,
        invoiceEmail: invoiceEmail ?? null,
        invoiceAddress: invoiceAddress ?? null,
        updatedAt: new Date(),
      },
      update: {
        customerType: customerType as CustomerType | undefined,
        preferredMethod: preferredMethod as PaymentMethod | undefined,
        companyName: companyName ?? null,
        orgNumber: orgNumber ?? null,
        invoiceEmail: invoiceEmail ?? null,
        invoiceAddress: invoiceAddress ?? null,
      },
    });

    return NextResponse.json(preference);
  } catch {
    return NextResponse.json(
      { error: "Kunne ikke lagre betalingsinnstillinger" },
      { status: 500 }
    );
  }
}
