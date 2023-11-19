import { bot } from "../bot";
import { Database } from "../database/database";

import { mainButtons } from "../replyMarkups/keyboardMarkups";

const db = new Database();

bot.command("start", async ctx => {
    db.addUser(ctx);
    ctx.reply("Hello", { reply_markup: mainButtons });
});