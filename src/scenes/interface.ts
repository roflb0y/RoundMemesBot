import {
    type Conversation,
    type ConversationFlavor,
    conversations,
    createConversation,
  } from "@grammyjs/conversations";

import { Context } from "grammy/out/context";
import { FileFlavor } from "@grammyjs/files";
import { SessionFlavor } from "grammy";

interface ChooseMemeContextSession {
  videoNoteMessage: FileFlavor<ChooseMemeContext> | undefined;
}

export type ChooseMemeContext = Context & SessionFlavor<ChooseMemeContextSession> & ConversationFlavor;
export type ChooseMemeConversation = Conversation<ChooseMemeContext & FileFlavor<Context>>;