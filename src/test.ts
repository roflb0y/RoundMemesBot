import { Bot, Context } from "grammy";
import { FileFlavor, hydrateFiles } from "@grammyjs/files";

import * as config from "./config";

// Transformative Context flavor
type MyContext = FileFlavor<Context>;

// Create a bot.
const bot = new Bot<MyContext>(config.DEV_TOKEN);

// Use the plugin.


// Download videos and GIFs to temporary locations.
bot.on([":video", ":animation"], async (ctx) => {
  // Prepare the file for download.
  const file = await ctx.getFile();
  // Download the file to a temporary location.
  const path = await file.download();
  // Print the file path.
  console.log("File saved at ", path);
});

bot.start();