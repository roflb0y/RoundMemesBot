import { Input } from "telegraf";
import { message } from "telegraf/filters";
import { bot } from "../bot";
import { download } from "../services/utils";
import { addMeme, convertToSquare } from "../services/video/processVideo";
import { mainButtons } from "../replyMarkups/keyboardMarkups";
import { Database } from "../database/database";
import * as log from "../services/logger";
import { deleteVideos } from "../services/utils";

const db = new Database();

bot.on(message("video"), async ctx => {
    if (!ctx.message) return;
    if (!ctx.message.video.file_size) return;
    
    const user = await db.getUser(ctx.from.id);
    if (!user) return;

    if (ctx.message.video.file_size > 20 * 1024 * 1024) {
        ctx.reply("Video size can't be more than 20MB", { reply_to_message_id: ctx.message.message_id });
        return;
    }

    if (user.convert_type !== "0" && ctx.message.video.duration > 55) {
        ctx.reply("To add meme to a video it needs to be <55 seconds long.", { reply_to_message_id: ctx.message.message_id });
        return;
    }

    if (ctx.message.video.duration > 60) {
        await ctx.reply("Video duration is longer that 60 seconds. It will be trimmed.", { reply_to_message_id: ctx.message.message_id });
    }

    const source_filepath = `videos/source/${ctx.from.id}_${ctx.message.message_id}.mp4`;

    //блять ну некрасиво но промисы какого-то хуя блочат код
    ctx.reply("Processing...", { reply_to_message_id: ctx.message.message_id, reply_markup: mainButtons.reply_markup })
    .then(async msg => {
        const video_link = await bot.telegram.getFileLink(ctx.message.video.file_id);
        await download(video_link.href, source_filepath);

        //у меня с нихуя перестали изменяться сообщения
        //await bot.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, "Converting...");

        const square_filepath = await convertToSquare(`${ctx.from.id.toString()}_${ctx.message.message_id}`);
        let result_filepath;

        if (user.convert_type !== "0") {
            //await bot.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, "Adding meme...");
            result_filepath = await addMeme(`${ctx.from.id}_${ctx.message.message_id}`, user.convert_type);
        } 
        else { 
            result_filepath = square_filepath;
        }

        await bot.telegram.deleteMessage(msg.chat.id, msg.message_id);
        await bot.telegram.callApi("sendVideoNote", { chat_id: ctx.from.id, video_note: Input.fromLocalFile(result_filepath), reply_to_message_id: ctx.message.message_id, reply_markup: mainButtons.reply_markup });

        user.addProcess();
        deleteVideos(`${ctx.from.id}_${ctx.message.message_id}`);
        log.info(`VIDEO NOTE SENT TO ${ctx.from.id}`);
    });
})



bot.on(message("video_note"), async ctx => {
    if (!ctx.message) return;
    
    const user = await db.getUser(ctx.from.id);
    if (!user) return;

    if (user.convert_type === "0") {
        ctx.reply("You haven't choose a meme to add. You can do it in the /settings", { reply_to_message_id: ctx.message.message_id });
        return;
    }

    if (user.convert_type !== "0" && ctx.message.video_note.duration > 55) {
        ctx.reply("To add meme to a video it needs to be <55 seconds long.", { reply_to_message_id: ctx.message.message_id });
        return;
    }

    const source_filepath = `videos/source/${ctx.from.id}_${ctx.message.message_id}.mp4`;

    ctx.reply("Processing...", { reply_to_message_id: ctx.message.message_id, reply_markup: mainButtons.reply_markup })
    .then(async msg => {
        const video_link = await bot.telegram.getFileLink(ctx.message.video_note.file_id);
        await download(video_link.href, source_filepath);

        //у меня с нихуя перестали изменяться сообщения
        //await bot.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, "Converting...");

        const square_filepath = await convertToSquare(`${ctx.from.id.toString()}_${ctx.message.message_id}`);
        let result_filepath;

        if (user.convert_type !== "0") {
            //await bot.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, "Adding meme...");
            result_filepath = await addMeme(`${ctx.from.id}_${ctx.message.message_id}`, user.convert_type);
        } 
        else { 
            result_filepath = square_filepath;
        }

        await bot.telegram.deleteMessage(msg.chat.id, msg.message_id);
        await bot.telegram.callApi("sendVideoNote", { chat_id: ctx.from.id, video_note: Input.fromLocalFile(result_filepath), reply_to_message_id: ctx.message.message_id, reply_markup: mainButtons.reply_markup });

        user.addProcess();
        deleteVideos(`${ctx.from.id}_${ctx.message.message_id}`);
        log.info(`VIDEO NOTE SENT TO ${ctx.from.id}`);
    });
})