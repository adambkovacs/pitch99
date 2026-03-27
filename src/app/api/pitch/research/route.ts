import { NextResponse } from "next/server";
import { chatCompletion, MODELS } from "@/lib/openrouter";
import { rateLimit } from "@/lib/rateLimit";
import { validatePitchRequest, parseAIResponse } from "@/lib/validation";

interface ResearchRequest {
  productName: string;
  productDescription: string;
  audienceType: string;
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

    const body = (await request.json()) as ResearchRequest;
    const { productName, productDescription, audienceType } = body;

    const validationError = validatePitchRequest(body);
    if (validationError) return validationError;

    const systemPrompt = `You are a startup pitch research analyst. You conduct deep market research and return structured JSON data. Always respond with valid JSON only — no markdown, no code fences, no explanation outside the JSON.`;

    const userPrompt = `Research the following product for a pitch deck:

Product: ${productName}
Description: ${productDescription}
Target Audience: ${audienceType}

Provide comprehensive research in this exact JSON structure:
{
  "tam": {
    "value": "Total Addressable Market size (e.g. $50B)",
    "description": "Brief explanation of TAM calculation",
    "growth_rate": "Annual growth rate percentage",
    "source_context": "What data this estimate is based on"
  },
  "sam": {
    "value": "Serviceable Addressable Market size",
    "description": "Brief explanation of SAM scope"
  },
  "som": {
    "value": "Serviceable Obtainable Market size",
    "description": "Realistic first 3-year capture explanation"
  },
  "competitors": [
    {
      "name": "Competitor name",
      "description": "What they do",
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "funding": "Known funding or revenue info",
      "differentiation": "How the product differs from this competitor"
    }
  ],
  "icp": {
    "title": "Ideal Customer Profile title",
    "demographics": "Key demographic traits",
    "pain_points": ["pain1", "pain2", "pain3"],
    "buying_triggers": ["trigger1", "trigger2"],
    "objections": ["objection1", "objection2"],
    "decision_criteria": ["criterion1", "criterion2"]
  },
  "market_trends": [
    {
      "trend": "Trend name",
      "relevance": "Why this matters for the product",
      "timeframe": "When this trend peaks or is most relevant"
    }
  ],
  "key_stats": [
    {
      "stat": "A compelling statistic",
      "context": "Why this stat matters for the pitch"
    }
  ]
}`;

    const result = await chatCompletion({
      model: MODELS.RESEARCH,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    });

    const parsed = parseAIResponse(result);

    return NextResponse.json({ research: parsed });
  } catch (error) {
    console.error("[research] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
