import { bot } from "../bot";
import { downloadVideoNote } from "../services/video/downloadVideo";
import { convertToSquare } from "../services/video/processVideo";
import * as utils from "../services/utils";

import * as log from "../services/logger";

bot.on(":video", async ctx => {
    await ctx.conversation.enter("convertVideoConversation")
    //ctx.scene.enter("CONVERT_SCENE");
    /*
    
    */
})