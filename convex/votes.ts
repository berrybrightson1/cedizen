import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getVotes = query({
    args: {},
    handler: async (ctx) => {
        const votes = await ctx.db
            .query("votes")
            .order("desc")
            .take(100);

        // Fetch reactions for each vote
        return await Promise.all(votes.map(async (vote) => {
            const reactions = await ctx.db
                .query("reactions")
                .withIndex("by_vote", (q) => q.eq("voteId", vote._id))
                .collect();

            const stats = {
                like: reactions.filter(r => r.type === "like").length,
                dislike: reactions.filter(r => r.type === "dislike").length,
                maybe: reactions.filter(r => r.type === "maybe").length,
            };

            return { ...vote, stats };
        }));
    },
});

export const toggleReaction = mutation({
    args: {
        voteId: v.id("votes"),
        type: v.union(v.literal("like"), v.literal("dislike"), v.literal("maybe")),
        deviceId: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("reactions")
            .withIndex("by_vote", (q) => q.eq("voteId", args.voteId))
            .filter((q) => q.eq(q.field("deviceId"), args.deviceId))
            .unique();

        if (existing) {
            if (existing.type === args.type) {
                // Remove reaction if clicking the same one again
                await ctx.db.delete(existing._id);
                return null;
            } else {
                // Update reaction type
                await ctx.db.patch(existing._id, { type: args.type });
                return existing._id;
            }
        }

        const id = await ctx.db.insert("reactions", {
            voteId: args.voteId,
            type: args.type,
            deviceId: args.deviceId,
        });
        return id;
    },
});

export const saveVote = mutation({
    args: {
        articleId: v.string(),
        type: v.union(v.literal("stay"), v.literal("go")),
        comment: v.string(),
        userAlias: v.string(),
        timestamp: v.number(),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("votes", {
            articleId: args.articleId,
            type: args.type,
            comment: args.comment,
            userAlias: args.userAlias,
            timestamp: args.timestamp,
        });
        return id;
    },
});
