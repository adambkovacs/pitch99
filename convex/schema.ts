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
    enrichedData: v.optional(
      v.object({
        github: v.optional(v.any()),
        website: v.optional(
          v.object({
            title: v.string(),
            description: v.string(),
            text: v.string(),
          }),
        ),
        linkedin: v.optional(v.any()),
      }),
    ),
    // TODO: researchData is AI-generated JSON with a highly variable shape
    // (tam, sam, som, competitors[], icp, market_trends[], key_stats[]).
    // Fully typing it would be brittle since the LLM output varies. Keeping
    // v.any() until the research prompt stabilises.
    researchData: v.optional(v.any()),
    generatedSlides: v.optional(
      v.array(
        v.object({
          title: v.string(),
          eyebrow: v.optional(v.string()),
          // TODO: content_blocks have a polymorphic "type" discriminator with
          // varying fields (text, stats, steps, metrics, items). Using v.any()
          // for the inner block shape until a tagged-union validator is viable.
          content_blocks: v.optional(v.any()),
          talking_points: v.optional(v.string()),
          timing_seconds: v.optional(v.number()),
        }),
      ),
    ),
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
