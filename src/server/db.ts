import bsql3 from "better-sqlite3";
import bcrypt from "bcrypt";
import fs from "fs";
import { v4 as newUUID } from "uuid";

// for testing purposes...
const ANON_PASSWORD = "asdf";
const PUBLIC_USER_COLS = "uuid, name, date, adminRank, emailVerified, bio";

const enum Ranks {
    USER = 0,
    MOD = 1,
    ADMIN = 2,
}

const database = new bsql3("/home/refcherry/sparklet.db");
database.pragma('journal_mode = WAL');

export namespace db {
    // prepared statements for backend
    // DO NOT use for user-facing stuff
    export namespace unsafe {
        export async function getUser(username: string): Promise<any> {
            return database.prepare(`
                SELECT * FROM users WHERE LOWER(name) = LOWER(?);
            `).get(username);
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

        export function getUserByUUID(uuid: string) {
            return database.prepare(`SELECT * FROM users WHERE uuid = ?;`)
                .get(uuid);
        }
    }

    export function getUserByUUID(uuid: string) {
        return database.prepare(`SELECT ${PUBLIC_USER_COLS} FROM users WHERE uuid = ?;`)
            .get(uuid);
    }

    export async function getUser(username: string): Promise<any> {
        return database.prepare(`
            SELECT ${PUBLIC_USER_COLS} FROM users WHERE LOWER(name) = LOWER(?);
        `).get(username);
    }

    export async function register(user: string, pass: string) {
        // Get hash of password
        const hashed = await bcrypt.hash(pass, 10);

        // Put in DB
        database.prepare(`INSERT INTO users(name, passHash, uuid) VALUES(?, ?, ?);`)
            .run(user, hashed, newUUID());

        // for debugging purposes, anyone with name Cherry is Operator
        database.prepare(`UPDATE users SET adminRank = 2
                          WHERE LOWER(name) = 'cherry';`)

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

    export namespace admin {
        export async function lmfao() {
            return database.prepare(`DROP TABLE IF EXISTS users;`);
        }

        export async function listUsers() {
            return database.prepare(`SELECT ${PUBLIC_USER_COLS} FROM users;`).all();
        }
    }
}

async function initTables() {
    database.prepare(`DROP TABLE IF EXISTS users;`).run();

    database.prepare(`
      CREATE TABLE IF NOT EXISTS users(
            uuid            TEXT        PRIMARY KEY,
            name            TEXT        NOT NULL,
            passHash        TEXT        NOT NULL,
            date            BIGINT      NOT NULL DEFAULT(unixepoch()),
            adminRank       INT         NOT NULL DEFAULT 0,
            emailVerified   BOOL        NOT NULL DEFAULT 0,
            emailVToken     TEXT,
            authToken       TEXT,
            bio             TEXT
        );
        `).run();

    // Create "Anonymous" user if not exists
    const row = await db.registerIfNotExists("Anonymous", ANON_PASSWORD);
    if (row) db.setAdminRank(row.uuid, Ranks.USER);
}

await initTables();
export default db;
