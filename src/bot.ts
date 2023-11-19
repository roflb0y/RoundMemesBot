import { Bot, Context } from "grammy";
import { FileFlavor, hydrateFiles } from "@grammyjs/files";
import * as config from "./config";

export type MyContext = FileFlavor<Context>;

export const bot = new Bot<MyContext>(config.DEV_TOKEN);
bot.api.config.use(hydrateFiles(bot.token));