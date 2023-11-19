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
    //const c = await ctx.conversation.active();
    //console.log(c);

    const video_note = ctx.message.video_note;
    const filesize = video_note.file_size ? video_note.file_size : 0;

    conversation.session.videoNoteMessage = ctx;

    ctx.reply("Choose a meme to add", { reply_markup: chooseVideoNoteMemeButtons, reply_to_message_id: ctx.message.message_id });

    // ждем выбора
    const memeChoice = await conversation.waitForCallbackQuery(/^convert_/);
    const memeIndex = memeChoice.callbackQuery.data.split("_")[1];

    console.log(memeIndex);
    
    await memeChoice.editMessageText("Downloading video...");

    const videoMessage = conversation.session.videoNoteMessage;
    const videoFile = await videoMessage.getFile();

    videoFile.download(`videos/source/${ctx.from?.id}.mp4`)
        .then(async () => {
            if (!videoMessage.message) return;
            if (!videoMessage.from) return;
            console.log(videoMessage.message.video_note);

            await memeChoice.editMessageText("Processing video...");

            await convertToSquare(videoMessage.from.id.toString());
            const memeResult = await addMeme(videoMessage.from.id.toString(), memeIndex);
        
            await memeChoice.deleteMessage();
            await videoMessage.replyWithVideoNote(new InputFile(memeResult), { reply_to_message_id: videoMessage.message.message_id });
            
            log.info(`Sent video note to ${videoMessage.from.id}`);
            const user = await db.getUser(videoMessage.from.id);
            if (user) user.addProcess();
            
            utils.deleteVideos(videoMessage.from.id.toString());
            return;
        })
};