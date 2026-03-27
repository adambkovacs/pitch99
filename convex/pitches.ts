import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const pitchId = await ctx.db.insert("pitches", {
      ...args,
      status: "intake",
      createdAt: now,
      updatedAt: now,
    });
    return pitchId;
  },
});

export const update = mutation({
  args: {
    id: v.id("pitches"),
    productName: v.optional(v.string()),
    productDescription: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    presenterName: v.optional(v.string()),
    presenterBio: v.optional(v.string()),
    audienceType: v.optional(
      v.union(
        v.literal("investors"),
        v.literal("customers"),
        v.literal("partners"),
        v.literal("general"),
        v.literal("competition"),
      ),
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
    status: v.optional(
      v.union(
        v.literal("intake"),
        v.literal("enriching"),
        v.literal("researching"),
        v.literal("generating"),
        v.literal("ready"),
        v.literal("error"),
      ),
    ),
    enrichedData: v.optional(v.any()),
    researchData: v.optional(v.any()),
    generatedSlides: v.optional(v.any()),
    talkingPoints: v.optional(v.any()),
    faq: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error(`Pitch ${id} not found`);
    }
    // Filter out undefined values so we only patch provided fields
    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }
    await ctx.db.patch(id, updates);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("pitches"),
    status: v.union(
      v.literal("intake"),
      v.literal("enriching"),
      v.literal("researching"),
      v.literal("generating"),
      v.literal("ready"),
      v.literal("error"),
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error(`Pitch ${args.id} not found`);
    }
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const get = query({
  args: { id: v.id("pitches") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("pitches")
      .withIndex("by_createdAt")
      .order("desc")
      .take(20);
  },
});
