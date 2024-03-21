import { bot } from "../bot";
import { settingsButtons } from "../replyMarkups/inlineMarkups";
import * as db from "../database/database";

bot.command("settings", async ctx => {
    const user = await db.getUser(ctx.from.id);

    if (!user) return;
    ctx.reply("Settings", settingsButtons(user));
})