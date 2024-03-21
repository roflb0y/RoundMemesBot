import { bot } from "../bot";
import * as db from "../database/database";
import * as log from "../services/logger";
import { mainButtons } from "../replyMarkups/keyboardMarkups";

bot.command("start", async ctx => {
    if(!ctx.from?.id) return;

    log.info(`/start from ${ctx.from.username}(${ctx.from.id})`);
    db.addUser(ctx.from);
    await ctx.reply("Hello", { reply_markup: mainButtons.reply_markup });
});