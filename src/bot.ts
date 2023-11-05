import { Telegraf, session, Scenes } from "telegraf";
import * as config from "./config";
import { WizardContext } from "telegraf/typings/scenes";
import { ChooseMemeSession } from "./scenes/interface";

import { ConvertScene } from "./scenes/convert.scene";

export const bot = new Telegraf<WizardContext<ChooseMemeSession>>(config.DEV_TOKEN);
bot.use(session());

const stage = new Scenes.Stage([ConvertScene]);
bot.use(stage.middleware());

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));