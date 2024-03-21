import { bot } from "./bot";
import * as config from "./config";
import * as log from "./services/logger";
import mongoose from "mongoose";
import user from "./middlewares/user"

import "./handlers/init";
import "./commands/init";

(async () => {
    log.info("Connecting to DB")
    mongoose.connect(config.MONGODB_URI, 
        { 
            user: config.MONGODB_USER,
            pass: config.MONGODB_PASSWORD,
            dbName: config.MONGODB_DB
        }
    )
    .then(async () => {
        log.info("Connected to DB. Starting bot...")
        bot.launch();

        const b = await bot.telegram.getMe();
        log.info("")
        log.info(`Logged as @${b.username}`);
    })
})()

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());