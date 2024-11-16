import { Markup } from "telegraf";
import { DBUser } from "../database/database";

export const settingsButtons = (user: DBUser) => Markup.inlineKeyboard(
    [
        [
            Markup.button.callback("Add meme:", "none")
        ],
        [
            Markup.button.callback(`${user.convertType === 0 ? "✅" : ""} ❌ No meme`, "set_converttype_0"),
            Markup.button.callback(`${user.convertType === 1 ? "✅" : ""} 💥 Explosion`, "set_converttype_1"),
            Markup.button.callback(`${user.convertType === 2 ? "✅" : ""} 👽 Monster`, "set_converttype_2")
        ],
        [
            Markup.button.callback(`${user.convertType === 3 ? "✅" : ""} 👻 Jumpscare 1`, "set_converttype_3"),
            Markup.button.callback(`${user.convertType === 4 ? "✅" : ""} 💀 Jumpscare 2`, "set_converttype_4"),
            Markup.button.callback(`${user.convertType === 5 ? "✅" : ""} 💥 Fast explosion`, "set_converttype_5")
        ]
    ]
)