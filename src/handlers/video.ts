import { bot } from "../bot";
import { message } from "telegraf/filters"
import { download } from "../services/utils";
import { convertToSquare } from "../services/video/processVideo";
import { Input } from "telegraf";

bot.on(message("video"), async ctx => {
    const videoFile = ctx.message.video;
    const source_filepath = `videos/source/${ctx.from.id}_${ctx.message.message_id}.mp4`;

    //блять ну некрасиво но промисы какого-то хуя блочат код
    ctx.reply("Downloading...", { reply_to_message_id: ctx.message.message_id })
    .then(async msg => {
        const video_url = await bot.telegram.getFileLink(videoFile.file_id);
        await download(video_url.href, source_filepath);

        await bot.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, "Processing...");

        const square_filepath = await convertToSquare(`${ctx.from.id.toString()}_${ctx.message.message_id}`);

        await bot.telegram.deleteMessage(msg.chat.id, msg.message_id);
        await bot.telegram.callApi("sendVideoNote", { video_note: Input.fromLocalFile(square_filepath), chat_id: ctx.chat.id, reply_to_message_id: ctx.message.message_id });
    });
})

bot.on(message("video_note"), async ctx => {

})