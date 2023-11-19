import { Input } from "telegraf";
import { message } from "telegraf/filters";
import { bot } from "../bot";
import { download } from "../services/utils";
import { convertToSquare } from "../services/video/processVideo";

bot.on(message("video"), async ctx => {
    if (!ctx.message) return;

    const source_filepath = `videos/source/${ctx.from.id}_${ctx.message.message_id}.mp4`;

    //блять ну некрасиво но промисы какого-то хуя блочат код
    ctx.reply("Downloading...", { reply_to_message_id: ctx.message.message_id })
    .then(async msg => {
        const video_link = await bot.telegram.getFileLink(ctx.message.video.file_id);
        await download(video_link.href, source_filepath);

        await bot.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, "Processing...");

        const square_filepath = await convertToSquare(`${ctx.from.id.toString()}_${ctx.message.message_id}`);

        await bot.telegram.deleteMessage(msg.chat.id, msg.message_id);
        await bot.telegram.callApi("sendVideoNote", { chat_id: ctx.from.id, video_note: Input.fromLocalFile(square_filepath), reply_to_message_id: ctx.message.message_id })
    });
})