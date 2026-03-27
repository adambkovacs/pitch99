import { NextResponse } from "next/server";

export const VALID_AUDIENCE_TYPES = [
  "investors",
  "customers",
  "partners",
  "general",
  "competition",
] as const;

export type AudienceType = (typeof VALID_AUDIENCE_TYPES)[number];

export function validatePitchRequest(body: {
  productName?: string;
  productDescription?: string;
  audienceType?: string;
}): NextResponse | null {
  if (!body.productName || !body.productDescription || !body.audienceType) {
    return NextResponse.json(
      { error: "Missing required fields: productName, productDescription, audienceType" },
      { status: 400 }
    );
  }
  if (body.productName.length > 200) {
    return NextResponse.json(
      { error: "productName must be 200 characters or fewer" },
      { status: 400 }
    );
  }
  if (body.productDescription.length > 5000) {
    return NextResponse.json(
      { error: "productDescription must be 5000 characters or fewer" },
      { status: 400 }
    );
  }
  if (
    !VALID_AUDIENCE_TYPES.includes(
      body.audienceType.toLowerCase() as AudienceType
    )
  ) {
    return NextResponse.json(
      {
        error: `Invalid audienceType. Must be one of: ${VALID_AUDIENCE_TYPES.join(", ")}`,
      },
      { status: 400 }
    );
  }
  return null;
}

export function parseAIResponse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch?.[1]) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch {
        throw new Error("Failed to parse AI response as JSON");
      }
    }
    throw new Error("Failed to parse AI response as JSON");
  }
}
