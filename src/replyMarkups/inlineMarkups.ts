import { InlineKeyboard } from "grammy";

export const chooseVideoMemeButtons = new InlineKeyboard()
    .text("❌ No meme", "convert_0")
    .text("💥 Explosion", "convert_1")
    .text("👽 Monster", "convert_2")

export const chooseVideoNoteMemeButtons = new InlineKeyboard()
    .text("💥 Explosion", "convert_1")
    .text("👽 Monster", "convert_2")