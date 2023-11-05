import fs from "fs";
import path from "path";

export const deleteVideos = (user_id: string) => {
    fs.readdirSync("./videos/source")
    .forEach(file => {
        if (file.includes(user_id)) fs.unlinkSync(`./videos/source/${file}`);
    })

    fs.readdirSync("./videos/result")
    .forEach(file => {
        if (file.includes(user_id)) fs.unlinkSync(`./videos/result/${file}`);
    })

    fs.readdirSync("./videos/memes")
    .forEach(file => {
        if (file.includes(user_id)) fs.unlinkSync(`./videos/memes/${file}`);
    })
}

export function getMemePresets(): object {
    return JSON.parse(fs.readFileSync("/videos/presets.json", "utf-8"));
}

export function createConcatFile(files: string[], user_id: string): string {
    const resultPath = `videos/memes/${user_id}.txt`;
    //console.log(files.map(item => `file '${item}'`).join("\n"))
    fs.writeFileSync(resultPath, files.map(item => `file '${path.resolve(item)}'`).join("\n"), "utf-8");
    return resultPath;
}