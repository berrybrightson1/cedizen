import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getVotes = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("votes")
            .order("desc")
            .take(100);
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
