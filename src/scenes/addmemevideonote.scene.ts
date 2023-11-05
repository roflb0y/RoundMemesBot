import { chooseVideoNoteMemeButtons } from "../replyMarkups/inlineMarkups";
import { ChooseMemeContext, ChooseMemeConversation } from "./interface";
import { FileFlavor } from "@grammyjs/files";
import { InputFile } from "grammy";

import { Database } from "../database/database";
import { addMeme, convertToSquare } from "../services/video/processVideo";
import * as log from "../services/logger";
import * as utils from "../services/utils";

const db = new Database();

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
    
    await memeChoice.editMessageText("Downloading video...");

    const videoFile = await ctx.getFile();
    videoFile.download(`videos/source/${ctx.from?.id}.mp4`)
        .then(async () => {
            if (!ctx.message) return;
            if (!ctx.from) return;

            await memeChoice.editMessageText("Processing video...");

            const convertPath = await convertToSquare(ctx.from.id.toString());
            const memeResult = await addMeme(ctx.from.id.toString(), memeIndex);
        
            await memeChoice.deleteMessage();
            await ctx.replyWithVideoNote(new InputFile(memeResult), { reply_to_message_id: ctx.message.message_id });
            
            log.info(`Sent video note to ${ctx.from.id}`);
            const user = await db.getUser(ctx.from.id);
            if (user) user.addProcess();
            
            utils.deleteVideos(ctx.from.id.toString());
            return;
        })
};