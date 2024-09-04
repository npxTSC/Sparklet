import bsql3 from "better-sqlite3";
import bcrypt from "bcrypt";
import fs from "fs";
import { v4 as newUUID } from "uuid";
import crypto from "crypto";

import { APP_FOLDER, ANON_PASSWORD, AUTH_TOKEN_LEN, DB_PATH } from "./consts.js";

const PUBLIC_USER_COLS = "uuid, name, date, adminRank, emailVerified, bio";

const enum Ranks {
    USER = 0,
    MOD = 1,
    ADMIN = 2,
}

fs.mkdirSync(APP_FOLDER, { recursive: true });
const database = new bsql3(DB_PATH);
database.pragma('journal_mode = WAL');

export namespace db {
    // prepared statements for backend
    // DO NOT use for user-facing stuff
    export namespace unsafe {
        export async function getUserUnsafe(username: string): Promise<any> {
            return database.prepare(`
                SELECT * FROM users WHERE LOWER(name) = LOWER(?);
            `).get(username);
        }

        export function getUserByUUIDUnsafe(uuid: string) {
            return database.prepare(`SELECT * FROM users WHERE uuid = ?;`)
                .get(uuid);
        }

        export function listUsers() {
            return database.prepare(`SELECT * FROM users;`).all();
        }
    }

    //
    // Regular functions for user-facing stuff
    //

    export function getUserByUUID(uuid: string) {
        return database.prepare(`SELECT ${PUBLIC_USER_COLS} FROM users WHERE uuid = ?;`)
            .get(uuid);
    }

    // TODO when we have more private data that should only be seen by the owner
    // of an account OR admins, we should have a separate function for this that
    // returns more columns.
    export function getUserBySessionToken(token: string) {
        return database.prepare(`SELECT ${PUBLIC_USER_COLS} FROM users WHERE session = ?;`)
            .get(token);
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

    /// Returns a token if successful, null otherwise
    export async function userLogin(name: string, pass: string) {
        const user = await unsafe.getUserUnsafe(name);

        const correctPassword = await bcrypt.compare(pass, user.passHash);
        if (!correctPassword) return null;


        const newToken = crypto.randomBytes(AUTH_TOKEN_LEN).toString("hex");

        await database.prepare(`UPDATE users SET session = ?
                           WHERE LOWER(uuid) = LOWER(?);`)
            .run(newToken, user.uuid);

        return newToken;

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
    // database.prepare(`DROP TABLE IF EXISTS users;`).run();

    database.prepare(`
      CREATE TABLE IF NOT EXISTS users(
            uuid            TEXT        PRIMARY KEY,
            name            TEXT        NOT NULL,
            passHash        TEXT        NOT NULL,
            date            BIGINT      NOT NULL DEFAULT(unixepoch()),
            adminRank       INT         NOT NULL DEFAULT 0,
            emailVerified   BOOL        NOT NULL DEFAULT 0,
            emailVToken     TEXT,
            session         TEXT,
            bio             TEXT
        );
        `).run();

    // Create "Anonymous" user if not exists
    const row = await db.registerIfNotExists("Anonymous", ANON_PASSWORD);
    if (row) db.setAdminRank(row.uuid, Ranks.USER);
}

await initTables();
export default db;
