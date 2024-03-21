import { bot } from "../bot";
import * as db from "../database/database";
import * as utils from "../services/utils";
import { settingsButtons } from "../replyMarkups/inlineMarkups";

bot.hears("💼 My profile", async ctx => {
    if (!ctx.from) return;
    
    const user = await db.getUser(ctx.from.id);
    if (!user) return;

    const timeSinceReg = utils.getTimeSince(user.joinedAt);

    ctx.reply(`*💼 Your account:*\n\n*📱 Processes count:* ${user.processesCount}\n*🗓 Bot launched:* ${timeSinceReg}`, { parse_mode: "MarkdownV2" })
})

bot.hears("⚙ Settings", async ctx => {
    const user = await db.getUser(ctx.from.id);
    if (!user) return;
    
    const inlineButtons = settingsButtons(user).reply_markup;
    ctx.reply("Settings", { reply_markup: inlineButtons });
})