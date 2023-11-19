import { bot } from "../bot";
import { settingsButtons } from "../replyMarkups/inlineMarkups";
import { Database } from "../database/database";

const db = new Database();

bot.command("settings", async ctx => {
    const user = await db.getUser(ctx.from.id);

    if (!user) return;
    ctx.reply("Settings", settingsButtons(user));
})