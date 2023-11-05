import fs from "fs";
import path from "path";
import moment from "moment";

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

export function getTimeSince(date: Date) {
    return parseUploadDate(date) + " \\| " + timeSince(date) + " ago";
}

export function parseUploadDate(date: Date) {
    return moment(date).format('DD.MM.YYYY').replace(/\./g, "\\.");
}

export function timeSince(date: Date) {
    // thanks Sky Sanders from stackoverflow
    let seconds = Math.floor((new Date().valueOf() - date.valueOf()) / 1000);
    let interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " " + numDeclination(Math.floor(interval), ["year", "years", "years"]);
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " " + numDeclination(Math.floor(interval), ["month", "months", "months"]);
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " " + numDeclination(Math.floor(interval), ["day", "days", "days"]);
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " " + numDeclination(Math.floor(interval), ["hour", "hours", "hours"]);
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " " + numDeclination(Math.floor(interval), ["minute", "minutes", "minutes"]);
    }
    return Math.floor(seconds) + " " + numDeclination(Math.floor(interval), ["second", "seconds", "seconds"]);
}

// склонение числительных или типа того ну типо минут минуты минуту
function numDeclination(num: number, declensions: string[]): string {
    let n = Math.abs(num);
    n %= 100;
    if (n >= 5 && n <= 20) {
      return declensions[2];
    }
    n %= 10;
    if (n === 1) {
      return declensions[0];
    }
    if (n >= 2 && n <= 4) {
      return declensions[1];
    }
    return declensions[2];
}