import { bot } from "../bot";
import { callbackQuery } from "telegraf/filters";
import * as db from "../database/database";
import { settingsButtons } from "../replyMarkups/inlineMarkups";

bot.action(/set_converttype_/, async (ctx) => {
    if (!ctx.has(callbackQuery("data"))) return;
    if (!ctx.from) return;

    const user = await db.getUser(ctx.from.id);
    if (!user) return;

    const convertType = ctx.callbackQuery.data.split("_").pop();
    if (!convertType) return;

    if (Number.isNaN(Number(convertType))) return;

    if (user.convertType === Number(convertType)) {
        ctx.answerCbQuery();
        return;
    }

    await user.setConvertType(Number(convertType));

    const inlineButtons = settingsButtons(user).reply_markup;
    await ctx.editMessageReplyMarkup(inlineButtons).catch(() => {});
    ctx.answerCbQuery("Settings updated");
});
