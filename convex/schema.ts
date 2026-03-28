import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pitches: defineTable({
    productName: v.string(),
    productDescription: v.string(),
    githubUrl: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    presenterName: v.optional(v.string()),
    presenterBio: v.optional(v.string()),
    audienceType: v.union(
      v.literal("investors"),
      v.literal("customers"),
      v.literal("partners"),
      v.literal("general"),
      v.literal("competition"),
    ),
    desiredOutcome: v.optional(v.string()),
    files: v.optional(
      v.array(
        v.object({
          name: v.string(),
          url: v.string(),
          type: v.string(),
        }),
      ),
    ),
    status: v.union(
      v.literal("intake"),
      v.literal("enriching"),
      v.literal("researching"),
      v.literal("generating"),
      v.literal("ready"),
      v.literal("error"),
    ),
    // enrichedData: AI-enriched data from GitHub/website/LinkedIn scraping.
    // Fields can be null (fetch failed) or variable shape. Using v.any().
    enrichedData: v.optional(v.any()),
    // TODO: researchData is AI-generated JSON with a highly variable shape
    // (tam, sam, som, competitors[], icp, market_trends[], key_stats[]).
    // Fully typing it would be brittle since the LLM output varies. Keeping
    // v.any() until the research prompt stabilises.
    researchData: v.optional(v.any()),
    // generatedSlides: AI-generated JSON with variable shape (slide_number,
    // content_blocks with polymorphic types, extra fields). Using v.any()
    // since the LLM output varies per model and prompt version. Client-side
    // code in page.tsx and buildSlides.tsx handles type guards defensively.
    generatedSlides: v.optional(v.any()),
    talkingPoints: v.optional(v.array(v.string())),
    faq: v.optional(
      v.array(
        v.object({
          question: v.string(),
          answer: v.string(),
        }),
      ),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
