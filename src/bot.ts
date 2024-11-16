import { Context, Telegraf } from "telegraf";
import { I18n, I18nFlavor } from "@grammyjs/i18n";

import * as config from "./config";
import user from "./middlewares/user";

const args = require('args-parser')(process.argv);

export const bot = new Telegraf(args.dev ? config.DEV_TOKEN : config.BOT_TOKEN);

bot.use(user);