import { bot } from "./bot";
import * as log from "./services/logger";

import "./handlers/message";
import "./commands/init";

(async () => {
    bot.launch();

    const me = await bot.telegram.getMe();
    log.info(`Logged as @${me.username}`);
})()