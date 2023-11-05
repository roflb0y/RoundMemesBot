import { chooseVideoNoteMemeButtons } from "../replyMarkups/inlineMarkups";
import { ChooseMemeContext, ChooseMemeConversation } from "./interface";
import { FileFlavor } from "@grammyjs/files";
import { InputFile } from "grammy";

import { addMeme, convertToSquare } from "../services/video/processVideo";
import * as log from "../services/logger";
import * as utils from "../services/utils";

export async function addMemeVideoNoteConversation(conversation: ChooseMemeConversation, ctx: FileFlavor<ChooseMemeContext>) {
    if (!ctx.message?.video_note) return;
    if (!ctx.from) return;

    const video_note = ctx.message.video_note;
    const filesize = video_note.file_size ? video_note.file_size : 0;

    if (filesize >= 20 * 1024 * 1024 || filesize === 0) {
        await ctx.reply("File size cannot be bigger than 20MB");
        return;
    }

    ctx.reply("Choose a meme to add", { reply_markup: chooseVideoNoteMemeButtons, reply_to_message_id: ctx.message.message_id });

    // ждем выбора
    const memeChoice = await conversation.waitForCallbackQuery(/^convert_/);
    const memeIndex = memeChoice.callbackQuery.data.split("_")[1];
    console.log(memeIndex);
    
    await memeChoice.editMessageText("Downloading video...");

    const videoFile = await ctx.getFile();
    await videoFile.download(`videos/source/${ctx.from?.id}.mp4`);

    await memeChoice.editMessageText("Processing video...");

    await convertToSquare(ctx.from.id.toString())
    const memeResult = await addMeme(ctx.from.id.toString(), memeIndex);

    await memeChoice.deleteMessage();
    await ctx.replyWithVideoNote(new InputFile(memeResult), { reply_to_message_id: ctx.message.message_id });

    log.info(`Sent video note to ${ctx.from.id}`);

    utils.deleteVideos(ctx.from.id.toString());
    return;
}