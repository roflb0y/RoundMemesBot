import { chooseVideoMemeButtons } from "../replyMarkups/inlineMarkups";
import { ChooseMemeContext, ChooseMemeConversation } from "./interface";
import { FileFlavor } from "@grammyjs/files";
import { InputFile } from "grammy";

import { convertToSquare, addMeme } from "../services/video/processVideo";
import * as log from "../services/logger";
import * as utils from "../services/utils";

export async function convertVideoConversation(conversation: ChooseMemeConversation, ctx: FileFlavor<ChooseMemeContext>) {
    if (!ctx.message?.video) return;
    if (!ctx.from) return;

    const video = ctx.message.video;
    const filesize = video.file_size ? video.file_size : 0;

    if (filesize >= 20 * 1024 * 1024 || filesize === 0) {
        await ctx.reply("File size cannot be bigger than 20MB");
        return;
    }

    if (video.duration > 60) {
        await ctx.reply("Video is longer than 60 seconds. It will be trimmed.");
    }

    ctx.reply("Would you like to add a meme to your video?", { reply_markup: chooseVideoMemeButtons, reply_to_message_id: ctx.message.message_id });

    // ждем выбора
    const memeChoice = await conversation.waitForCallbackQuery(/^convert_/);
    const memeIndex = memeChoice.callbackQuery.data.split("_")[1];
    console.log(memeIndex);
    
    await memeChoice.editMessageText("Downloading video...");

    const videoFile = await ctx.getFile();
    await videoFile.download(`videos/source/${ctx.from?.id}.mp4`);

    await memeChoice.editMessageText("Processing video...");
    const resultPath = await convertToSquare(ctx.from.id.toString());

    if (memeIndex === "0") {
        await memeChoice.deleteMessage();
        await ctx.replyWithVideoNote(new InputFile(resultPath), { reply_to_message_id: ctx.message.message_id });
    }
    else {
        const memeResult = await addMeme(ctx.from.id.toString(), memeIndex);
        await memeChoice.deleteMessage();
        await ctx.replyWithVideoNote(new InputFile(memeResult), { reply_to_message_id: ctx.message.message_id });
    }

    log.info(`Sent video note to ${ctx.from.id}`);

    utils.deleteVideos(ctx.from.id.toString());
    return;
}