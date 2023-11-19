import { Telegraf, session, Scenes } from "telegraf";
import * as config from "./config";

import { AddMemeVideoNote } from "./scenes/addmemevideonote.scene";
import { MySceneSession } from "./scenes/interface";

export type MyContext = Scenes.WizardContext<MySceneSession>;

export const bot = new Telegraf<MyContext>(config.DEV_TOKEN);
bot.use(session());

const stage = new Scenes.Stage<MyContext>([AddMemeVideoNote]);
bot.use(stage.middleware());