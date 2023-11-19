import { Markup } from "telegraf";

export const chooseVideoMemeButtons = Markup.inlineKeyboard(
    [
        [
            Markup.button.callback("❌ No meme", "convert_0"),
            Markup.button.callback("💥 Explosion", "convert_1"),
            Markup.button.callback("👽 Monster", "convert_2")
        ]
    ]
)