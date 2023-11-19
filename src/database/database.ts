import mysql from "mysql2";
import * as config from "../config";
import * as log from "../services/logger";
import { Message } from "telegraf/typings/core/types/typegram";

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

    addUser(message: Message): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!message.from) return;
            const user = await this.getUser(message.from.id);
                
            if (user) resolve();
            else {
                const locale = message.from.language_code ? config.LANGUAGES.includes(message.from.language_code) ? message.from.language_code : "en" : "en";
                this.db.query(`INSERT INTO users(user_id, convert_type, locale) VALUES (?, ?, ?)`, [message.from.id, "0", locale], (err, res, fields) => {
                    if (err) reject();
                    if (res) { log.info(`Inserted new user ${message.from?.id}`); resolve() };
                })
            }
        })
    }

    getUser(user_id: number): Promise<DBUser | undefined> {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT * FROM users WHERE user_id = "${user_id.toString()}"`, (err, res, fields) => {
                if (err) { log.error(err); reject(err); } 

                if (!Array.isArray(res)) return;

                if (res.length === 0) resolve(undefined);
                else resolve(new DBUser(res[0]))
            })
        })
    };
}

export class DBUser {
    id: number;
    user_id: string;
    processes: number;
    convert_type: string;
    locale: string;
    join_date!: Date;

    constructor(user: any) {
        this.id = user.id;
        this.user_id = user.user_id;
        this.processes = user.processes;
        this.convert_type = user.convert_type;
        this.locale = user.locale;
        this.join_date = user.join_date;
    }

    addProcess(): void {
        db.query(`UPDATE users SET processes = ? WHERE id = ?`, [this.processes + 1, this.id]);
        this.processes++;
    }

    setConvertType(convert_type: string): void {
        db.query(`UPDATE users SET convert_type = ? WHERE id = ?`, [convert_type, this.id], (err, res, fields) => { if (err) log.error(err) });
        this.convert_type = convert_type;
    }
}
