import ffmpeg from "fluent-ffmpeg";
import * as log from "../logger";
import * as utils from "../utils";

export function convertToSquare(filename: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        const filepath = `videos/source/${filename}.mp4`;
        const outputFilepath = `videos/result/${filename}.mp4`;

        log.debug(`STARTING TO PROCESS ${filepath}`);

        ffmpeg()
            .input(filepath)
            .videoFilter(
                `crop=w='min(min(iw\,ih)\,ih)':h='min(min(iw\,ih)\,ih)',scale=ih:ih,setsar=1`
            ) // Thanks Gyan from stackoverflow
            .FPS(30)
            .setDuration(60)
            .size("400x400")
            .videoCodec("libx264")
            .videoBitrate(2000)
            .audioCodec("aac")
            .audioBitrate(128)
            .addOutputOption(["-ar", "48000"])
            .output(outputFilepath)
            .on("end", () => {
                log.debug(`PROCESS FINISHED ${outputFilepath}`);
                resolve(outputFilepath);
            })
            .on("error", (error: Error) => {
                log.error(
                    `There has been an error while processing ${filepath}\n${error.message}`
                );
                resolve(undefined);
            })

            .run();
    });
}

export async function addMeme(
    filename: string,
    memeIndex: number
): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const filepath = `videos/result/${filename}.mp4`;
        const memeFilepath = `videos/memes/meme_${memeIndex}.mp4`;
        const outputFilepath = `videos/result/${filename}-meme.mp4`;

        log.debug(`STARTING TO ADD MEME ${filepath}`);

        const concatFiles = utils.createConcatFile(
            [filepath, memeFilepath],
            filename
        );

        ffmpeg()
            .input(concatFiles)
            .inputFormat("concat")
            .inputOptions(["-safe 0"])
            //.output(outputFilepath)
            .videoCodec("libx264")
            .videoBitrate(2000)
            .audioCodec("aac")
            .audioBitrate(128)
            .on("end", () => {
                log.debug("MEME ADDED");
                resolve(outputFilepath);
            })
            .on("error", (error: Error) => {
                log.error(
                    `There has been an error while processing ${filepath}\n${error.message}`
                );
                reject("");
            })

            .save(outputFilepath);
    });
}
