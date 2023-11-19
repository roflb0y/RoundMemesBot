import { Markup } from "telegraf";
import { DBUser } from "../database/database";

export const settingsButtons = (user: DBUser) => Markup.inlineKeyboard(
    [
        [
            Markup.button.callback("Add meme:", "none")
        ],
        [
            Markup.button.callback(`${user.convert_type === "0" ? "✅" : ""} ❌ No meme`, "set_converttype_0"),
            Markup.button.callback(`${user.convert_type === "1" ? "✅" : ""} 💥 Explosion`, "set_converttype_1"),
            Markup.button.callback(`${user.convert_type === "2" ? "✅" : ""} 👽 Monster`, "set_converttype_2")
        ]
    ]
)