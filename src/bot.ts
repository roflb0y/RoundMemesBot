import { Telegraf } from "telegraf";

import * as config from "./config";
import user from "./middlewares/user";

export const bot = new Telegraf(config.BOT_TOKEN);
bot.use(user);