import { bot } from "./bot";
import * as log from "./services/logger";

import "./handlers/init";
import "./commands/init";

import { hydrateFiles } from "@grammyjs/files";

(async () => {
    bot.api.config.use(hydrateFiles(bot.token));
    bot.start();

    await bot.init();
    log.info(`Logged as @${bot.botInfo.username}`);
})()

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());