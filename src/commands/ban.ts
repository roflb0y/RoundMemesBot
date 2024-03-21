import { bot } from "../bot";
import * as db from "../database/database";
import { ADMINS_ID } from "../config";

bot.command("ban", async ctx => {
    if (!ADMINS_ID.includes(ctx.from.id.toString())) return;

    const userId = Number(ctx.message.text.split(" ").slice(1));

    const user = await db.getUser(userId);
    if (!user) {
        ctx.reply("Нет такого пользователя");
        return;
    }

    await user.setBanned(true);
    ctx.reply(`Пользователь ${user.username}(${user.userId}) забанен ахахаха`)
})

bot.command("unban", async ctx => {
    if (!ADMINS_ID.includes(ctx.from.id.toString())) return;

    const userId = Number(ctx.message.text.split(" ").slice(1));

    const user = await db.getUser(userId);
    if (!user) {
        ctx.reply("Нет такого пользователя");
        return;
    }

    await user.setBanned(false);
    ctx.reply(`Пользователь ${user.username}(${user.userId}) разбанен`)
})