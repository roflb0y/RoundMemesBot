import { bot } from "../bot";
import { Database } from "../database/database";
import * as utils from "../services/utils";
import { settingsButtons } from "../replyMarkups/inlineMarkups";

const db = new Database();

bot.hears("💼 My profile", async ctx => {
    if (!ctx.from) return;

    const user = await db.getUser(ctx.from.id);
    if (!user) { ctx.reply("Произошла ошибка"); return; }
    const timeSinceReg = utils.getTimeSince(user.join_date);

    ctx.reply(`*💼 Your profile:*\n\n*📱 Processes count:* ${user.processes}\n*🗓 Joined:* ${timeSinceReg}`, { parse_mode: "MarkdownV2" })
})

bot.hears("⚙ Settings", async ctx => {
    const user = await db.getUser(ctx.from.id);
    if (!user) { 
        ctx.reply("Error. Type /start");
        return;
    }
    const inlineButtons = settingsButtons(user).reply_markup;
    ctx.reply("Settings", { reply_markup: inlineButtons });
})