import { message } from "telegraf/filters";
import { bot } from "../bot";
import { Database } from "../database/database";
import * as utils from "../services/utils";

const db = new Database();

bot.hears("💼 My profile", async ctx => {
    if (!ctx.from) return;

    const user = await db.getUser(ctx.from?.id);
    if (!user) { ctx.reply("Произошла ошибка"); return; }
    const timeSinceReg = utils.getTimeSince(user.join_date);

    ctx.reply(`*💼 Your profile:*\n\n*📱 Processes count:* ${user.processes}\n*🗓 Joined:* ${timeSinceReg}`, { parse_mode: "MarkdownV2" })
})

bot.hears("jopa?", async ctx => {
    ctx.scene.enter("ADD_MEME_VIDEO_NOTE_SCENE");
})