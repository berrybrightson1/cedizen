import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getChats = query({
    args: { deviceId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("chats")
            .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
            .order("desc")
            .collect();
    },
});

export const saveChat = mutation({
    args: {
        messages: v.array(v.any()),
        deviceId: v.string(),
        timestamp: v.number(),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("chats", {
            messages: args.messages,
            deviceId: args.deviceId,
            timestamp: args.timestamp,
        });
        return id;
    },
});

export const deleteChat = mutation({
    args: { id: v.id("chats") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
