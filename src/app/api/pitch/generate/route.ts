import { NextResponse } from "next/server";
import { chatCompletion, MODELS } from "@/lib/openrouter";
import { rateLimit } from "@/lib/rateLimit";
import { validatePitchRequest, parseAIResponse } from "@/lib/validation";

interface GenerateRequest {
  productName: string;
  productDescription: string;
  audienceType: string;
  askAmount?: string;
  problemStatement?: string;
  solution?: string;
  businessModel?: string;
  traction?: string;
  research?: Record<string, unknown>;
  enrichment?: Record<string, unknown>;
}

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
    const { allowed } = rateLimit(ip, 10, 60000);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = (await request.json()) as GenerateRequest;
    const { productName, productDescription, audienceType } = body;

    const validationError = validatePitchRequest(body);
    if (validationError) return validationError;

    // Prompt injection mitigation: length caps on optional fields
    if (body.askAmount && body.askAmount.length > 200) {
      return NextResponse.json(
        { error: "askAmount must be 200 characters or fewer" },
        { status: 400 }
      );
    }
    if (body.problemStatement && body.problemStatement.length > 2000) {
      return NextResponse.json(
        { error: "problemStatement must be 2000 characters or fewer" },
        { status: 400 }
      );
    }
    if (body.solution && body.solution.length > 2000) {
      return NextResponse.json(
        { error: "solution must be 2000 characters or fewer" },
        { status: 400 }
      );
    }
    if (body.businessModel && body.businessModel.length > 1000) {
      return NextResponse.json(
        { error: "businessModel must be 1000 characters or fewer" },
        { status: 400 }
      );
    }
    if (body.traction && body.traction.length > 1000) {
      return NextResponse.json(
        { error: "traction must be 1000 characters or fewer" },
        { status: 400 }
      );
    }

    // Cap serialized size of object fields
    const researchStr = body.research ? JSON.stringify(body.research) : "";
    const enrichmentStr = body.enrichment ? JSON.stringify(body.enrichment) : "";
    if (researchStr.length > 20000) {
      return NextResponse.json(
        { error: "research payload too large" },
        { status: 400 }
      );
    }
    if (enrichmentStr.length > 20000) {
      return NextResponse.json(
        { error: "enrichment payload too large" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an elite pitch deck architect. You generate structured JSON slide configurations for investor pitch decks. Every slide must be compelling, data-driven, and follow proven pitch frameworks (Sequoia, YC, etc.).

Always respond with valid JSON only — no markdown, no code fences, no explanation outside the JSON.

Each slide has this structure:
{
  "slide_number": number,
  "title": "Slide title",
  "eyebrow": "Small label above title (e.g. 'THE PROBLEM', 'OUR SOLUTION')",
  "content_blocks": [
    // Array of content blocks, each with a "type" and type-specific fields
  ],
  "talking_points": "Bullet-pointed speaker notes for this slide",
  "timing_seconds": number (recommended presentation time)
}

Available content block types:
- { "type": "heading", "text": "..." }
- { "type": "paragraph", "text": "..." }
- { "type": "stat_grid", "stats": [{ "value": "...", "label": "..." }, ...] }
- { "type": "step_flow", "steps": [{ "number": 1, "title": "...", "description": "..." }, ...] }
- { "type": "metric_bar", "metrics": [{ "label": "...", "value": number, "max": number, "unit": "..." }, ...] }
- { "type": "cta", "headline": "...", "subtext": "..." }`;

    const userPrompt = `Generate a 5-slide pitch deck JSON for:

Product: ${productName}
Description: ${productDescription}
Target Audience: ${audienceType}
${body.askAmount ? `Ask Amount: ${body.askAmount}` : ""}
${body.problemStatement ? `Problem: ${body.problemStatement}` : ""}
${body.solution ? `Solution: ${body.solution}` : ""}
${body.businessModel ? `Business Model: ${body.businessModel}` : ""}
${body.traction ? `Traction: ${body.traction}` : ""}

${body.research ? `Market Research Data:\n${JSON.stringify(body.research, null, 2)}` : ""}
${body.enrichment ? `Enrichment Data:\n${JSON.stringify(body.enrichment, null, 2)}` : ""}

Generate exactly 5 slides in this order:
1. Title / Hook — grab attention with a bold stat or statement
2. Problem — pain point with supporting data
3. Solution — how the product solves it, use step_flow for process
4. Market & Traction — TAM/SAM/SOM stats, traction metrics
5. Ask / CTA — the investment ask or call to action

Return a JSON object: { "slides": [...] }`;

    const rawResult = await chatCompletion({
      model: MODELS.AGENTIC,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    const result = parseAIResponse(rawResult);
    const slides = (result as { slides?: unknown[] }).slides;
    if (!Array.isArray(slides)) {
      throw new Error("AI response missing slides array");
    }

    return NextResponse.json({ slides });
  } catch (error) {
    console.error("[generate] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
