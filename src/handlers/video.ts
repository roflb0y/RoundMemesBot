import { bot } from "../bot";

bot.on(":video", async ctx => {
    await ctx.conversation.enter("convertVideoConversation")
})

bot.on(":video_note", async ctx => {
    await ctx.conversation.enter("addMemeVideoNoteConversation")
})