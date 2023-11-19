import { bot } from "./bot";
import * as log from "./services/logger";

import "./handlers/init";
import "./commands/init";

(async () => {
    bot.launch();

    const b = await bot.telegram.getMe();
    log.info(`Logged as @${b.username}`);
})()

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());