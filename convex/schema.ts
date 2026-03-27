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
    enrichedData: v.optional(v.any()),
    researchData: v.optional(v.any()),
    generatedSlides: v.optional(v.any()),
    talkingPoints: v.optional(v.any()),
    faq: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
