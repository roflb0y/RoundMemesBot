import { bot } from "../bot";
import { message } from "telegraf/filters";
import { downloadVideoNote } from "../services/video/downloadVideo";
import { convertToSquare } from "../services/video/processVideo";
import { Input } from "telegraf";
import * as utils from "../services/utils";

import * as log from "../services/logger";

bot.on(message("video"), async ctx => {
    ctx.scene.enter("CONVERT_SCENE");
    /*
    
    */
})