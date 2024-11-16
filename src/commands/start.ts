import { bot } from "../bot";
import * as db from "../database/database";
import * as log from "../services/logger";
import { mainButtons } from "../replyMarkups/keyboardMarkups";
import { Input } from "telegraf";

bot.command("start", async ctx => {
    if(!ctx.from?.id) return;

    log.info(`/start from ${ctx.from.username}(${ctx.from.id})`);
    db.addUser(ctx.from);
    await ctx.replyWithVideoNote(Input.fromFileId("DQACAgIAAxkBAAJa42c5IGGMhx9OinMWAkAWf5hZqG6EAAI6VQACe2rRSZT33xPs1zAVNgQ"))
    await ctx.reply("👋 Привет! Это бот который умеет конвертировать видео в кружки, а также добавлять в них мемы! Бот еще довольно сырой, но я активно работаю над тем чтобы сделать его лучше. Приятного пользования! 🤗", { reply_markup: mainButtons.reply_markup });
});