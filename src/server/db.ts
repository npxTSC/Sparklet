import bsql3 from "better-sqlite3";
import bcrypt from "bcrypt";
import fs from "fs";
import { v4 as newUUID } from "uuid";

// for testing purposes...
const ANON_PASSWORD = "asdf";

const enum Ranks {
    USER = 0,
    MOD = 1,
    ADMIN = 2,
}

// const database = new bsql3("/srv/sparklet/sparklet.db");
const database = new bsql3("/home/refcherry/sparklet.db");
database.pragma('journal_mode = WAL');

namespace db {
    export function register(username: string, password: string, rank?: number = 0): string {
        const uuid = newUUID();
        const passHash = bcrypt.hashSync(password, 10);

        database.prepare(`
            INSERT INTO users(uuid, username, passHash)
            VALUES(?, ?, ?);
        `).run(uuid, username, passHash);

        return uuid;
    }

    export function getAccountByUUID(uuid: string): any {
        return database.prepare(`
            SELECT uuid, username, rank, dateJoined FROM users WHERE uuid = ?;
        `).get(uuid);
    }
}


async function initTables() {
    database.prepare(`DROP TABLE IF EXISTS users;`).run();
    database.prepare(`DROP TABLE IF EXISTS games;`).run();

    database.prepare(`
      CREATE TABLE IF NOT EXISTS users(
            uuid            TEXT        PRIMARY KEY,
            username        TEXT        NOT NULL,
            rank            INT         NOT NULL DEFAULT 0,
            dateJoined      BIGINT      NOT NULL DEFAULT(unixepoch()),

            bio             TEXT,

            passHash        TEXT        NOT NULL,
            emailVerified   BOOL        NOT NULL DEFAULT 0,
            emailVToken     TEXT,
            authToken       TEXT
        );
        `).run();

    // database.prepare(`
    //   CREATE TABLE IF NOT EXISTS games(
    //         uuid        TEXT        PRIMARY KEY,
    //         title       TEXT        NOT NULL,
    //         creator     TEXT        NOT NULL DEFAULT 'Anonymous',
    //         description TEXT        NOT NULL DEFAULT 'No description given... :(',
    //         visible     BOOL        NOT NULL DEFAULT 1,
    //         date        BIGINT      NOT NULL DEFAULT(unixepoch())
    //     );
    //     `).run();

    // Create "Anonymous" user if not exists
    db.register("Anonymous", ANON_PASSWORD, Ranks.USER);
}

await initTables();
export default db;
