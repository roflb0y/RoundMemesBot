import fs from "fs";

export const deleteVideos = (user_id: string) => {
    fs.unlinkSync(`./videos/source/${user_id}.mp4`);
    fs.unlinkSync(`./videos/result/${user_id}.mp4`);
}