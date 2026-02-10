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
    reactions: defineTable({
        voteId: v.id("votes"),
        type: v.union(v.literal("like"), v.literal("dislike"), v.literal("maybe")),
        deviceId: v.string(),
    }).index("by_vote", ["voteId"]),
    chats: defineTable({
        messages: v.array(v.any()),
        deviceId: v.string(),
        timestamp: v.number(),
    }).index("by_device", ["deviceId"]),
});
