import { bot } from "../bot";
import { Database } from "../database/database";
import * as log from "../services/logger";
import { mainButtons } from "../replyMarkups/keyboardMarkups";

const db = new Database();

bot.start(async ctx => {
    log.info(`/start from ${ctx.from.id}`)
    db.addUser(ctx);
    await ctx.reply("Hello", { reply_markup: mainButtons.reply_markup });
});