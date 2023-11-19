import { bot } from "../bot";
import { callbackQuery } from "telegraf/filters";
import { Database } from "../database/database";
import { settingsButtons } from "../replyMarkups/inlineMarkups";

const db = new Database();

bot.action(/set_converttype_/, async ctx => {
    if (!ctx.has(callbackQuery("data"))) return;
    if (!ctx.from) return;

    const user = await db.getUser(ctx.from.id);
    if (!user) return;

    const convertType = ctx.callbackQuery.data.split("_").pop();
    if (!convertType) return;

    user.setConvertType(convertType);

    const inlineButtons = settingsButtons(user).reply_markup;
    await ctx.editMessageReplyMarkup(inlineButtons).catch(() => {});
    ctx.answerCbQuery("Settings updated");
})