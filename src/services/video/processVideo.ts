import ffmpeg from "fluent-ffmpeg";
import * as log from "../logger";
import { Video } from "grammy/types";

export async function convertToSquare(filename: string, videoProps: Video): Promise<string> {
    return new Promise((resolve, reject) => {
        const filepath = `videos/source/${filename}.mp4`;
        const outputFilepath = `videos/result/${filename}.mp4`
        
        log.debug(`BEGINNING TO PROCESS ${filepath}`);

        ffmpeg()
            .input(filepath)
            .videoFilter(`crop=w='min(min(iw\,ih)\,ih)':h='min(min(iw\,ih)\,ih)',scale=ih:ih,setsar=1`) // Thanks Gyan from stackoverflow
            .FPS(30)
            .setDuration(60)
            .size("400x400")
            .output(outputFilepath)
            .on("end", () => { log.debug("PROCESS FINISHED"); resolve(outputFilepath); })
            .on("error", (error: Error) => { log.error(`There has been an error while processing ${filepath}\n${error.message}`); reject(""); })

            .run()
    })
}