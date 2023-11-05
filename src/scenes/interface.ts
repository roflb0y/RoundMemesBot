import {
    type Conversation,
    type ConversationFlavor,
    conversations,
    createConversation,
  } from "@grammyjs/conversations";

import { Context } from "grammy/out/context";
import { FileFlavor } from "@grammyjs/files";

export type ChooseMemeContext = Context & ConversationFlavor;
export type ChooseMemeConversation = Conversation<ChooseMemeContext & FileFlavor<Context>>;