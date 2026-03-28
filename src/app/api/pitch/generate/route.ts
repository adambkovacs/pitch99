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

    const systemPrompt = `You are a world-class pitch deck storyteller and strategist. You craft structured JSON slide configurations that read like compelling investor narratives — not wireframes. Your decks have closed Series A rounds, won startup competitions, and moved audiences to action. You follow proven frameworks (Sequoia, YC, a16z) but inject personality and specificity into every slide.

CRITICAL RULES:
- Always respond with valid JSON only — no markdown, no code fences, no explanation outside the JSON.
- Every paragraph MUST be 2-3 full sentences of compelling narrative prose. Never use fragments, bullet points, or single-line placeholders.
- Every stat in a stat_grid MUST have a specific numeric value (e.g. "$8.2B", "27K+", "340M", "40%"), a short unit or context label, and a descriptive human-readable label. Never use vague qualitative words like "Incomplete", "Biased", or "Growing" as stat values.
- Every step in a step_flow MUST have a clear action-oriented title AND a 1-2 sentence description explaining what happens and why it matters.
- Titles must be bold, memorable, and specific to the product — never generic labels like "The Problem" or "Our Solution". Instead use provocative statements, questions, or claims.
- Use the enrichment data and research data extensively. Reference specific metrics, GitHub stars, user counts, revenue figures, market sizes, competitor names, and industry benchmarks whenever available.

Each slide has this structure:
{
  "slide_number": number,
  "title": "A bold, specific, memorable title (not a generic label)",
  "eyebrow": "Short context label above the title (2-4 words, e.g. 'THE $8B PROBLEM', 'HOW IT WORKS')",
  "content_blocks": [
    // Array of content blocks, each with a "type" and type-specific fields
  ],
  "talking_points": "Detailed bullet-pointed speaker notes with delivery cues and emphasis points",
  "timing_seconds": number (recommended presentation time)
}

Available content block types:
- { "type": "heading", "text": "A punchy subheading that advances the narrative" }
- { "type": "paragraph", "text": "2-3 full sentences of compelling narrative. Paint a picture. Use specific numbers, names, and scenarios. Make the reader feel the problem or get excited about the solution." }
- { "type": "stat_grid", "stats": [{ "value": "$8.2B", "label": "Total addressable market for developer tools by 2027" }, { "value": "73%", "label": "Of enterprises report this pain point in annual surveys" }, { "value": "4.2x", "label": "Average ROI within the first 12 months of adoption" }] } — ALWAYS 3-4 stats with LARGE specific numbers, clear units, and descriptive labels.
- { "type": "step_flow", "steps": [{ "number": 1, "title": "Clear Action Title", "description": "1-2 sentences explaining what happens in this step and why it matters to the user." }] } — ALWAYS 3-4 steps with titles AND descriptions.
- { "type": "metric_bar", "metrics": [{ "label": "Metric name", "value": 75, "max": 100, "unit": "%" }] } — Use real benchmarks from the research data.
- { "type": "cta", "headline": "A compelling call to action with specific dollar amount if investor audience", "subtext": "What the funds will achieve, timeline, and urgency. Be specific: 'Join our $2.5M seed round to capture the enterprise market before Q4 2025.'" }`;

    const userPrompt = `Generate a 5-slide pitch deck JSON for:

Product: ${productName}
Description: ${productDescription}
Target Audience: ${audienceType}
${body.askAmount ? `Ask Amount: ${body.askAmount}` : ""}
${body.problemStatement ? `Problem: ${body.problemStatement}` : ""}
${body.solution ? `Solution: ${body.solution}` : ""}
${body.businessModel ? `Business Model: ${body.businessModel}` : ""}
${body.traction ? `Traction: ${body.traction}` : ""}

${body.research ? `Market Research Data (USE THIS EXTENSIVELY — reference specific numbers, competitors, trends, and market sizes from this data):\n${JSON.stringify(body.research, null, 2)}` : ""}
${body.enrichment ? `Enrichment Data (USE THIS EXTENSIVELY — reference GitHub stars, user counts, funding rounds, revenue, team size, and any metrics found here):\n${JSON.stringify(body.enrichment, null, 2)}` : ""}

Generate exactly 5 slides in this order. Each slide must tell a story, not just list facts:

SLIDE 1 — HOOK / TITLE:
- Eyebrow: A short provocative context label (e.g. "THE FUTURE OF X", "A $XB OPPORTUNITY").
- Title: A bold, memorable claim or surprising statistic that makes the audience lean in. NOT just the product name.
- Content: Use a "heading" with a punchy one-liner, then a "paragraph" (2-3 sentences) that positions the product in the market and hints at the massive opportunity. Then a "stat_grid" with 3-4 impressive stats pulled from the research/enrichment data (market size, growth rate, users affected, current inefficiency cost). Each stat MUST have a large specific number as its value.

SLIDE 2 — THE PROBLEM:
- Eyebrow: Something that frames the pain (e.g. "THE $XB PROBLEM", "WHY TEAMS STRUGGLE").
- Title: A vivid, specific statement about the pain — not "The Problem" but something like "Engineers Waste 12 Hours a Week Fighting Bad Tooling".
- Content: Use a "paragraph" (2-3 sentences) that paints the pain vividly — use a concrete scenario or story that the audience can relate to. Then a "stat_grid" with 3-4 stats showing the COST of the problem: dollars lost, hours wasted, percentage of failures, user complaints. Pull real numbers from the research data. Then another "paragraph" (2-3 sentences) that drives home why existing solutions fail and why this problem is getting WORSE, not better.

SLIDE 3 — THE SOLUTION:
- Eyebrow: Something that signals the breakthrough (e.g. "HOW IT WORKS", "THE BREAKTHROUGH").
- Title: A specific statement about the solution's core insight — not "Our Solution" but something like "One API Call Replaces Your Entire Data Pipeline".
- Content: Use a "paragraph" (2-3 sentences) introducing the product and its core innovation. Then a "step_flow" with 3-4 steps showing HOW it works — each step must have an action-oriented title AND a 1-2 sentence description explaining what happens and why it is better than the status quo. Then a "paragraph" (2-3 sentences) highlighting the key differentiator and what makes this 10x better than alternatives.

SLIDE 4 — MARKET & TRACTION:
- Eyebrow: Something showing momentum (e.g. "TRACTION & MARKET", "THE OPPORTUNITY").
- Title: A specific traction headline — not "Market Size" but something like "340K Developers and $2.1M ARR in 14 Months".
- Content: Use a "stat_grid" with 3-4 stats for TAM/SAM/SOM using real dollar amounts from the research data (e.g. "$24B TAM", "$3.2B SAM", "$480M SOM"). Then a "paragraph" (2-3 sentences) explaining the go-to-market wedge and expansion strategy. Then a "stat_grid" or "metric_bar" with 3-4 traction metrics (users, revenue, growth rate, retention, NPS) — use real numbers from the enrichment data if available, or realistic projections if not.

SLIDE 5 — THE ASK / CTA:
- Eyebrow: "THE ASK" or "JOIN US" or "NEXT CHAPTER".
- Title: A forward-looking statement that creates urgency — not "Call to Action" but something like "Join Our $2.5M Round to Own the Developer Workflow".
- Content: Use a "cta" block with a headline that includes the specific dollar amount being raised (use the askAmount if provided, otherwise suggest a realistic amount) and what it will fund. The subtext should break down use of funds (e.g. "60% engineering, 25% go-to-market, 15% operations"), timeline to next milestone, and why NOW is the time to invest. Then a "paragraph" (2-3 sentences) with a compelling closing statement about the vision — where will this company be in 3-5 years and why this is a once-in-a-generation opportunity.

IMPORTANT REMINDERS:
- Every "paragraph" text must be 2-3 FULL SENTENCES of real narrative. Not fragments. Not bullet points.
- Every stat_grid value must be a specific number with units (e.g. "$8.2B", "73%", "4.2x", "27K+"). NEVER use qualitative words as stat values.
- Every step_flow step must have both a title AND a multi-sentence description.
- Mine the research and enrichment data for every specific number, competitor name, trend, and metric you can find. The more specific and data-backed the content, the better.
- If the audience is investors, the CTA MUST include a specific funding ask with dollar amount.

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
