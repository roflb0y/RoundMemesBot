import { Markup } from "telegraf"

export const mainButtons = Markup.keyboard(
    [
        [
            Markup.button.text("💼 My profile"),
            Markup.button.text("⚙ Settings")
        ]
    ]
).resize()