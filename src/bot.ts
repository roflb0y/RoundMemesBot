import { Bot, session, Context } from "grammy";
import { FileFlavor, hydrateFiles } from "@grammyjs/files"
import * as config from "./config";

import { ChooseMemeContext } from "./scenes/interface";
import { conversations, createConversation } from "@grammyjs/conversations";

import { convertVideoConversation } from "./scenes/convertvideo.scene";
import { addMemeVideoNoteConversation } from "./scenes/addmemevideonote.scene";

export type MyContext = FileFlavor<ChooseMemeContext>;

export const bot = new Bot<MyContext>(config.DEV_TOKEN);

bot.api.config.use(hydrateFiles(bot.token));

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

bot.use(createConversation(convertVideoConversation));
bot.use(createConversation(addMemeVideoNoteConversation));