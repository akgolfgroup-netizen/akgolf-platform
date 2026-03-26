import { NextResponse } from "next/server";
import { z, type ZodSchema } from "zod";

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; response: NextResponse };

export async function validateRequest<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<ValidationResult<T>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Ugyldig JSON i request body", code: "INVALID_JSON" },
        { status: 400 }
      ),
    };
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    }));
    return {
      success: false,
      response: NextResponse.json(
        { error: "Valideringsfeil", code: "VALIDATION_ERROR", details },
        { status: 400 }
      ),
    };
  }

  return { success: true, data: result.data };
}

// Common reusable schemas
export const idSchema = z.string().min(1, "ID er påkrevd");
export const dateStringSchema = z.string().refine(
  (val) => !isNaN(Date.parse(val)),
  { message: "Ugyldig datoformat" }
);
export const optionalDateStringSchema = z.string().refine(
  (val) => !isNaN(Date.parse(val)),
  { message: "Ugyldig datoformat" }
).optional();
