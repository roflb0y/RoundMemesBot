import { bot } from "../bot";

bot.on(":video", async ctx => {
    await ctx.conversation.enter("convertVideoConversation")
})

bot.on(":video_note", async ctx => {
    await ctx.conversation.enter("addMemeVideoNoteConversation")
})

bot.on(":text", async ctx => {
    if (!ctx.message) return
    await ctx.reply(ctx.message.text);
})