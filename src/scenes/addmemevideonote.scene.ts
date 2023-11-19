import { Scenes } from "telegraf";
import { MySceneSession } from "./interface";
import { MyContext } from "../bot";

export const AddMemeVideoNote = new Scenes.WizardScene<MyContext>("ADD_MEME_VIDEO_NOTE_SCENE",
    async (ctx) => {
        ctx.reply("jopa");
        ctx.scene.leave();
        return;
    }
)