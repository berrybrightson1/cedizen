import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    votes: defineTable({
        articleId: v.string(),
        type: v.union(v.literal("stay"), v.literal("go")),
        comment: v.string(),
        userAlias: v.string(),
        timestamp: v.number(),
    }),
});
