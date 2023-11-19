import { Telegraf } from "telegraf";

import * as config from "./config";

export const bot = new Telegraf(config.DEV_TOKEN);