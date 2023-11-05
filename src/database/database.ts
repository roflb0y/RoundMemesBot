import mysql from "mysql2";
import * as config from "../config";
import * as log from "../services/logger";

import { MyContext } from "../bot";

const db = mysql.createConnection({
    host: config.MYSQL_HOST,
    user: config.MYSQL_USER,
    database: config.MYSQL_DB,
    password: config.MYSQL_PASSWORD
});

db.connect((err) => {
    if (err) {
        log.error("Connection to db failed");
        log.error(err.message);
        return;
    }
    log.debug("Connected to db");
});

process.on("unhandledRejection", (error) => console.log("Unhandled rejection:", error));
process.on("uncaughtException", (error) => console.log("Uncaught exception:", error));

export class Database {
    db = db;

    addUser(ctx: MyContext): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!ctx.message) reject();
            else {
                if (!ctx.from) return;
                const user = await this.getUser(ctx.from?.id);
                
                if (user) resolve();
                else {
                    const locale = ctx.from.language_code ? config.LANGUAGES.includes(ctx.from.language_code) ? ctx.from.language_code : "en" : "en";
                    this.db.query(`INSERT INTO users(user_id, locale) VALUES (?, ?)`, [ctx.from.id, locale], (err, res, fields) => {
                        if (err) reject(err);
                        if (res) { log.info(`Inserted new user ${ctx.from?.id}`); resolve() };
                    })
                }
                
            }
        })
    };

    getUser(user_id: number): Promise<User | void> {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT * FROM users WHERE user_id = "${user_id.toString()}"`, (err, res, fields) => {
                if (err) { log.error(err); reject(err); } 

                if (!Array.isArray(res)) return;

                if (res.length === 0) resolve();
                else resolve(new User(res[0]))
            })
        })
    };
}

export class User {
    id: number;
    user_id: string;
    processes: number;
    locale: string;
    join_date!: Date;

    constructor(user: any) {
        this.id = user.id;
        this.user_id = user.user_id;
        this.processes = user.processes;
        this.locale = user.locale;
        this.join_date = user.join_date;
    }

    addProcess(): void {
        db.query(`UPDATE users SET processes = ? WHERE id = ?`, [this.processes + 1, this.id]);
        this.processes++;
    }
}
