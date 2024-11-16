import { User } from "telegraf/typings/core/types/typegram";
import { DBUserI, DBProcessI } from "./interface";
import * as schemas from "./schemas";
import * as log from "../services/logger";

export async function getUser(userId: number): Promise<DBUser | undefined> {
    const user = await schemas.User.findOne({ userId: userId });
    if (user === null) return undefined;

    const processCount = await schemas.Process.find({ user: userId }).countDocuments()

    return new DBUser(user, processCount);
}

export async function addUser(tguser: User): Promise<DBUser> {
    const user = await getUser(tguser.id);

    if (user) return user;
    const res = await new schemas.User({
        userId: tguser.id,
        username: tguser.username,
        locale: tguser.language_code,
    }).save();
    log.db(`Inserted new user ${tguser.username}(${tguser.id})`);

    console.log(res);

    return new DBUser(res, 0);
}

export async function insertProcess(user: DBUser, processTime: number) {
    const res = await new schemas.Process({
        user: user.userId,
        convertType: user.convertType,
        processTime: processTime
    }).save();

    log.db(`Inserted new process for ${user.username}(${user.userId})`);

    return new DBProcess(res);
}

export class DBUser implements DBUserI {
    userId: number;
    username: string;
    locale: string;
    processesCount: number;
    convertType: number;
    joinedAt: Date;
    isBanned: boolean;

    constructor(user: DBUserI, processCount: number) {
        this.username = user.username;
        this.userId = user.userId;
        this.processesCount = processCount;
        this.convertType = user.convertType;
        this.locale = user.locale;
        this.joinedAt = user.joinedAt;
        this.isBanned = user.isBanned;
    }

    async addProcess(processTime: number): Promise<void> {
        await insertProcess(this, processTime);
    }

    async setConvertType(convertType: number): Promise<void> {
        await schemas.User.findOneAndUpdate(
            { userId: this.userId },
            { convertType: convertType },
            { returnDocument: "after" }
        );
        log.db(
            `convertType SET TO ${convertType} FOR ${this.username}(${this.userId})`
        );
        this.convertType = convertType;
    }

    async setBanned(status: boolean): Promise<void> {
        await schemas.User.findOneAndUpdate(
            { userId: this.userId },
            { isBanned: status },
            { returnDocument: "after" }
        );
        log.db(
            `SET BAN STATUS TO ${status} FOR ${this.username}(${this.userId})`
        );
        this.isBanned = status;
    }
}

export class DBProcess implements DBProcessI {
    user: number;
    convertType: number;
    processTime: number;
    date: Date;

    constructor(process: DBProcessI) {
        this.user = process.user;
        this.convertType = process.convertType;
        this.processTime = process.processTime;
        this.date = process.date;
    }
}
