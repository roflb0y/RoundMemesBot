import { InputFile } from "grammy";
import { bot } from "../bot";
import { download } from "../services/utils";
import { convertToSquare } from "../services/video/processVideo";

bot.on(":video", async ctx => {
    if (!ctx.message) return;
    
    const source_filepath = `videos/source/${ctx.from.id}_${ctx.message.message_id}.mp4`;

    //блять ну некрасиво но промисы какого-то хуя блочат код
    ctx.reply("Downloading...", { reply_to_message_id: ctx.message.message_id })
    .then(async msg => {
        const f = await ctx.getFile();
        await f.download(source_filepath);

        await bot.api.editMessageText(msg.chat.id, msg.message_id, "Processing...");

        const square_filepath = await convertToSquare(`${ctx.from.id.toString()}_${ctx.message.message_id}`);

        await bot.api.deleteMessage(msg.chat.id, msg.message_id);
        ctx.replyWithVideoNote(new InputFile(square_filepath), { reply_to_message_id: ctx.message.message_id });
    });
})