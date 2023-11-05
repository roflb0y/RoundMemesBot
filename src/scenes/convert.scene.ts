import { Scenes, deunionize, Context, Input } from "telegraf";
import { chooseMemeButtons } from "../replyMarkups/inlineMarkups";
import { message } from "telegraf/filters";
import { ChooseMemeSession } from "./interface";

import { bot } from "../bot";
import { downloadVideoNote } from "../services/video/downloadVideo";
import { convertToSquare } from "../services/video/processVideo";
import * as log from "../services/logger";
import * as utils from "../services/utils";


export const ConvertScene = new Scenes.WizardScene<Scenes.WizardContext<ChooseMemeSession>>("CONVERT_SCENE",
    async ctx => {
        if (!ctx.has(message("video"))) return;

        const filesize = ctx.message.video.file_size ? ctx.message.video.file_size : 0;

        if (filesize >= 20 * 1024 * 1024) {
            await ctx.reply("File size cannot be bigger than 20MB");
            await ctx.scene.leave();
            
            return;
        }

        if (ctx.message.video.duration > 60) {
            await ctx.reply("Video is longer than 60 seconds. It will be trimmed.");
        }

        ctx.scene.session.video = ctx.message.video;
        ctx.reply("Would you like to add a meme to your video?", { reply_markup: chooseMemeButtons.reply_markup, reply_to_message_id: ctx.message?.message_id });
        ctx.wizard.next();
    },
    async ctx => {
        if (!ctx.has("callback_query")) return;

        const video = ctx.scene.session.video;

        console.log(deunionize(ctx.callbackQuery));
        console.log(ctx.scene.session.video);

        await ctx.editMessageText("Downloading video");
        const videofilelink = await bot.telegram.getFileLink(video.file_id);

        await downloadVideoNote(videofilelink.toString(), ctx.callbackQuery.from.id.toString());
        await ctx.editMessageText("Processing video");

        const outputPath = await convertToSquare(ctx.callbackQuery.from.id.toString(), ctx.scene.session.video);

        const file = Input.fromLocalFile(outputPath);

        // replyWithVideoNote doesnt work in this shit
        await bot.telegram.callApi("sendVideoNote", { chat_id: ctx.callbackQuery.from.id, video_note: file });
        //bot.telegram.deleteMessage(ctx.callbackQuery.message?.chat.id, ctx.message?.message);

        log.info(`VIDEO NOTE SENT TO ${ctx.callbackQuery.from.id}`);
        utils.deleteVideos(ctx.callbackQuery.from.id.toString());

        await ctx.scene.leave();
    })