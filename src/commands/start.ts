import { bot } from "../bot";
import { Database } from "../database/database";
import * as log from "../services/logger";
import { mainButtons } from "../replyMarkups/keyboardMarkups";

const db = new Database();

bot.command("start", async ctx => {
    if(!ctx.from?.id) return;

    log.info(`/start from ${ctx.from.id}`);
    db.addUser(ctx.message);
    await ctx.reply("Hello", { reply_markup: mainButtons });
});