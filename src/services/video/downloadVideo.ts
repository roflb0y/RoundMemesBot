import request from "request";
import fs from "fs";
import * as log from "../logger"

export async function downloadVideoNote(url: string, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
        request.get(url)
        .pipe(fs.createWriteStream(`./videos/source/${filename}.mp4`))
        .on("finish", () => { resolve() })
        .on("error", (error) => { log.error(error.message); reject() })
    })
}