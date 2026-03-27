import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock chatCompletion before importing the route
vi.mock("@/lib/openrouter", () => ({
  chatCompletion: vi.fn(),
  MODELS: { RESEARCH: "test-research-model" },
}));

// Mock rateLimit to always allow
vi.mock("@/lib/rateLimit", () => ({
  rateLimit: vi.fn(() => ({ allowed: true, remaining: 9 })),
}));

import { POST } from "@/app/api/pitch/research/route";
import { chatCompletion } from "@/lib/openrouter";
import { rateLimit } from "@/lib/rateLimit";

const mockedChatCompletion = vi.mocked(chatCompletion);
const mockedRateLimit = vi.mocked(rateLimit);

function makeRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/pitch/research", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = {
  productName: "Pitch99",
  productDescription: "AI pitch deck generator",
  audienceType: "investors",
};

describe("POST /api/pitch/research", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedRateLimit.mockReturnValue({ allowed: true, remaining: 9 });
  });

  it("returns 400 when productName is missing", async () => {
    const res = await POST(
      makeRequest({ productDescription: "desc", audienceType: "investors" })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/Missing required fields/);
  });

  it("returns 400 when productDescription is missing", async () => {
    const res = await POST(
      makeRequest({ productName: "Test", audienceType: "investors" })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/Missing required fields/);
  });

  it("returns 400 when productName exceeds 200 chars", async () => {
    const res = await POST(
      makeRequest({
        productName: "x".repeat(201),
        productDescription: "desc",
        audienceType: "investors",
      })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/productName must be 200 characters or fewer/);
  });

  it("returns 400 when productDescription exceeds 5000 chars", async () => {
    const res = await POST(
      makeRequest({
        productName: "Test",
        productDescription: "x".repeat(5001),
        audienceType: "investors",
      })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(
      /productDescription must be 5000 characters or fewer/
    );
  });

  it("returns 400 when audienceType is not in valid list", async () => {
    const res = await POST(
      makeRequest({
        productName: "Test",
        productDescription: "desc",
        audienceType: "aliens",
      })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/Invalid audienceType/);
  });

  it("returns 200 with valid input and parsed AI response", async () => {
    const mockResearch = {
      tam: { value: "$50B", description: "Large market", growth_rate: "12%", source_context: "Industry reports" },
      sam: { value: "$10B", description: "Serviceable segment" },
      som: { value: "$500M", description: "First 3-year capture" },
      competitors: [],
      icp: { title: "Startup founders", demographics: "25-45", pain_points: [], buying_triggers: [], objections: [], decision_criteria: [] },
      market_trends: [],
      key_stats: [],
    };
    mockedChatCompletion.mockResolvedValueOnce(JSON.stringify(mockResearch));

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.research).toBeDefined();
    expect(json.research.tam.value).toBe("$50B");
  });

  it("handles code-fence wrapped JSON from AI gracefully", async () => {
    const mockResearch = { tam: { value: "$20B" }, sam: { value: "$5B" }, som: { value: "$200M" } };
    const fencedResponse = "```json\n" + JSON.stringify(mockResearch) + "\n```";
    mockedChatCompletion.mockResolvedValueOnce(fencedResponse);

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.research.tam.value).toBe("$20B");
  });
});
