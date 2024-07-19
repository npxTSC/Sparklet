import bsql3 from "better-sqlite3";
import bcrypt from "bcrypt";
import fs from "fs";
import * as util from "./util.js";
import { ADMINS } from "./consts.js";
import {
    AdminRank,
    Option,
} from "./classes.js";

// for testing purposes... remove when we start
// processing important information someday
const DEFAULT_PASSWORD = "asdf";

util.loadEnv();
util.checkEnvReady([
    "DB_USER",
    "DB_PASS",
]);

fs.mkdirSync("/srv/sparklet/", { recursive: true });
const database = new bsql3("/srv/sparklet/sparklet.db");
database.pragma('journal_mode = WAL');

await initTables();

export namespace db {
    export async function getUser(username: string): Promise<any> {
        return database.prepare(`
            SELECT * FROM users WHERE LOWER(name) = LOWER(?);
        `).get(username);
    }

    export async function register(user: string, pass: string) {
        // Get hash of password
        const hashed = await bcrypt.hash(pass, 10);

        // Put in DB
        database.prepare(`INSERT INTO users(name, passHash) VALUES(?, ?);`)
            .run(user, hashed);

        return getUser(user)!;
    }

    export async function registerIfNotExists(user: string, pass: string) {
        if (await getUser(user)) return null;
        return await register(user, pass);
    }

    export async function setAdminRank(uuid: string, rank: number) {
        return database.prepare(`UPDATE users SET adminRank = ?
        WHERE LOWER(uuid) = LOWER(?);`).run(rank, uuid);
    }

    export function updateBio(uuid: string, bio: Option<string>) {
        return database.prepare(`UPDATE users SET bio = ? WHERE LOWER(uuid) = LOWER(?);`)
            .run(bio, uuid);
    }

    export async function editLoginToken(
        uuid: string,
        newToken: Option<string>,
    ) {
        return database.prepare(`UPDATE users SET authToken = ?
                           WHERE LOWER(uuid) = LOWER(?);`)
            .run(newToken, uuid);

    }

    export async function verifyLoginTokenWithName(name: string, token: string) {
        const row = await getUser(name);
        if (!row) return false;

        return verifyLoginToken(row.uuid, token);
    }

    export async function verifyLoginToken(uuid: string, token: string) {
        return database.prepare(`SELECT * FROM users WHERE uuid = ? AND authToken = ?;`)
            .get(uuid, token);
    }

    export async function getUserByUUID(uuid: string) {
        return database.prepare(`SELECT * FROM users WHERE uuid = ?;`)
            .get(uuid);
    }

    export async function getGame(uuid: string) {
        return database.prepare(`SELECT * FROM games WHERE uuid = (?) AND visible = 1;`)
            .get(uuid);
    }

    export async function gameQPosts(): Promise<any[]> {
        const rows = database.prepare(`SELECT * FROM games WHERE visible = 1
                                ORDER BY date DESC LIMIT 25;`).all();

        return rows.map(async (v: any) => {
            const creatorRow: any = (await getUserByUUID(v.creator))!;
            v.creatorName = `${AdminRank[creatorRow.adminRank]} ${creatorRow.name} `;
            return v;
        });
    }

    export async function getNews(uuid: string) {
        return database.prepare(`
            SELECT * FROM news
            WHERE uuid = (?) AND visible = 1;
        `).get(uuid);
    }

    export async function newsQPosts() {
        return await database.prepare(`
            SELECT title, author, date, uuid
            FROM news WHERE visible = 1
            ORDER BY date DESC
            LIMIT 25;
        `).get();
    }

    export namespace admin {
        export async function lmfao() {
            return database.prepare(`DROP TABLE IF EXISTS users; `);
        }

        export async function postSpark(
            title: string,
            creator: string,
            desc: string,
        ) {
            database.prepare(`
              INSERT INTO games(title, creator, description, visible)
        VALUES(?, ?, ?, 1);
        `).run(title, creator, desc);

            return (database.prepare(`
        SELECT * FROM games
              WHERE LOWER(creator) = LOWER(?)
              ORDER BY date DESC
              LIMIT 1;
        `).get(creator))!;
        }
    }
}

export default db;

// Remove this once there's a way for user "Mira" to assign ranks.
Object.entries(ADMINS).forEach(async ([name, rank]) => {
    const row = await db.registerIfNotExists(name, DEFAULT_PASSWORD);
    if (!row) return;

    db.setAdminRank(row.uuid, rank);
});

async function initTables() {
    //await db.prepare(`DROP TABLE IF EXISTS users; `);

    database.prepare(`
      CREATE TABLE IF NOT EXISTS users(
            uuid            UUID        PRIMARY KEY DEFAULT(UUID()),
            name            TEXT        NOT NULL,
            passHash        TEXT        NOT NULL,
            date            BIGINT      NOT NULL DEFAULT(unixepoch()),
            adminRank       INT         NOT NULL DEFAULT 0,
            emailVerified   BOOL        NOT NULL DEFAULT 0,
            emailVToken     TEXT,
            authToken       TEXT,
            pfpSrc          TEXT,
            bio             TEXT
        );
        `).run();

    database.prepare(`
      CREATE TABLE IF NOT EXISTS news(
            uuid        UUID        PRIMARY KEY DEFAULT(UUID()),
            title       TEXT        NOT NULL,
            author      TEXT        NOT NULL DEFAULT 'Anonymous',
            content     TEXT        NOT NULL,
            visible     BOOL        NOT NULL DEFAULT 1,
            date        BIGINT      NOT NULL DEFAULT(unixepoch())
        );
        `).run();

    database.prepare(`
      CREATE TABLE IF NOT EXISTS games(
            uuid        UUID        PRIMARY KEY DEFAULT(UUID()),
            title       TEXT        NOT NULL,
            creator     TEXT        NOT NULL DEFAULT 'Anonymous',
            description TEXT        NOT NULL DEFAULT 'No description given... :(',
            visible     BOOL        NOT NULL DEFAULT 1,
            date        BIGINT      NOT NULL DEFAULT(unixepoch())
        );
        `).run();
}
