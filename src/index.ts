import { bot } from "./bot";
import * as log from "./services/logger";

import "./handlers/init";
import "./commands/init";

(async () => {
    bot.start();

    await bot.init();
    log.info(`Logged as @${bot.botInfo.username}`);
})()

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());