import { bot } from "../bot";
import { Database } from "../database/database";
import * as utils from "../services/utils";

const db = new Database();

bot.hears("💼 My profile", async ctx => {
    if (!ctx.from) return;

    const user = await db.getUser(ctx.from?.id);
    if (!user) { ctx.reply("Произошла ошибка"); return; }

    const timeSinceReg = utils.getTimeSince(user.join_date);

    await ctx.reply(`*💼 Your profile:*\n\n*📱 Processes count:* ${user.processes}\n*🗓 Joined:* ${timeSinceReg}`, { parse_mode: "MarkdownV2" })
})