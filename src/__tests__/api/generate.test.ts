import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock chatCompletion before importing the route
vi.mock("@/lib/openrouter", () => ({
  chatCompletion: vi.fn(),
  MODELS: { AGENTIC: "test-agentic-model" },
}));

// Mock rateLimit to always allow
vi.mock("@/lib/rateLimit", () => ({
  rateLimit: vi.fn(() => ({ allowed: true, remaining: 9 })),
}));

import { POST } from "@/app/api/pitch/generate/route";
import { chatCompletion } from "@/lib/openrouter";
import { rateLimit } from "@/lib/rateLimit";

const mockedChatCompletion = vi.mocked(chatCompletion);
const mockedRateLimit = vi.mocked(rateLimit);

function makeRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/pitch/generate", {
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

const mockSlides = {
  slides: [
    { slide_number: 1, title: "Hook", eyebrow: "THE OPPORTUNITY", content_blocks: [], talking_points: "", timing_seconds: 30 },
    { slide_number: 2, title: "Problem", eyebrow: "THE PROBLEM", content_blocks: [], talking_points: "", timing_seconds: 45 },
    { slide_number: 3, title: "Solution", eyebrow: "OUR SOLUTION", content_blocks: [], talking_points: "", timing_seconds: 45 },
    { slide_number: 4, title: "Market", eyebrow: "MARKET SIZE", content_blocks: [], talking_points: "", timing_seconds: 45 },
    { slide_number: 5, title: "Ask", eyebrow: "THE ASK", content_blocks: [], talking_points: "", timing_seconds: 30 },
  ],
};

describe("POST /api/pitch/generate", () => {
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

  it("returns 400 when audienceType is invalid", async () => {
    const res = await POST(
      makeRequest({
        productName: "Test",
        productDescription: "desc",
        audienceType: "martians",
      })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/Invalid audienceType/);
  });

  it("returns 400 when productDescription is missing", async () => {
    const res = await POST(
      makeRequest({ productName: "Test", audienceType: "investors" })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/Missing required fields/);
  });

  it("returns 200 with valid input and parsed AI response", async () => {
    mockedChatCompletion.mockResolvedValueOnce(JSON.stringify(mockSlides));

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.slides).toBeDefined();
    expect(json.slides).toHaveLength(5);
    expect(json.slides[0].title).toBe("Hook");
  });

  it("handles code-fence wrapped JSON from AI", async () => {
    const fencedResponse = "```json\n" + JSON.stringify(mockSlides) + "\n```";
    mockedChatCompletion.mockResolvedValueOnce(fencedResponse);

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.slides).toBeDefined();
    expect(json.slides).toHaveLength(5);
  });

  it("returns 500 when AI returns unparseable content", async () => {
    mockedChatCompletion.mockResolvedValueOnce("this is not json at all");

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Internal server error");
  });
});
