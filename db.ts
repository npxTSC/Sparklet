import mysql 			from "mysql2/promise";
import {v4 as newUUID}	from "uuid";
import bcrypt	 		from "bcrypt";
import {Ranks}			from "./classes";
import * as util		from "./util";

util.checkEnvReady([
	"ADMIN_PASSWORD",
	"MYSQL_ROOT_PASSWORD",
])

const conn = await mysql.createConnection({
	host:		"localhost",
	port:		3001,
	user:		"root",
	password:	process.env["MYSQL_ROOT_PASSWORD"],
});

{
	conn.execute(`
		CREATE TABLE IF NOT EXISTS users(
			name			TEXT		NOT NULL,
			uuid			TEXT		NOT NULL,
			passHash		TEXT		NOT	NULL,
			date			DATETIME	NOT NULL DEFAULT CURRENT_TIMESTAMP,
			adminRank		INTEGER		NOT NULL DEFAULT 0,
			emailVerified	BOOLEAN		NOT NULL DEFAULT 0,
			emailVToken		TEXT,
			authToken		TEXT,
			bio				TEXT
		);
	`);

	conn.execute(`
		CREATE TABLE IF NOT EXISTS news(
			title		TEXT		NOT NULL,
			author		TEXT		NOT NULL DEFAULT 'Anonymous',
			content		TEXT		NOT NULL,
			visible		BOOLEAN		NOT NULL DEFAULT 1,
			date		DATETIME	NOT NULL DEFAULT CURRENT_TIMESTAMP
		);
	`);

	conn.execute(`
		CREATE TABLE IF NOT EXISTS games(
			id			TEXT		PRIMARY KEY,
			title		TEXT		NOT NULL,
			creator		TEXT		NOT NULL DEFAULT 'Anonymous',
			description	TEXT		NOT NULL DEFAULT 'No description given... :(',
			visible		BOOLEAN		NOT NULL DEFAULT 1,
			date		DATETIME	NOT NULL DEFAULT CURRENT_TIMESTAMP
		);
	`);

	conn.execute(`
		CREATE TABLE IF NOT EXISTS capsules(
			uuid		TEXT		PRIMARY KEY,
			name		TEXT		NOT NULL,
			creator		TEXT		NOT NULL,
			version		TEXT		NOT NULL,
			content		TEXT		NOT NULL,
			visible		BOOLEAN		NOT NULL DEFAULT 1,
			date		DATETIME	NOT NULL DEFAULT CURRENT_TIMESTAMP,
			likes		INTEGER		NOT NULL DEFAULT 0
		);
	`);
}

[//	Reserved Username	// Reason
	"Dexie",			// Admin account
	"DexieTheSheep",	// Prevents admin impersonation
	"Sparklet",			// Prevents admin impersonation
	"Anonymous",		// Reserved for default name in DB
].forEach(async (v) => {
	db.setAdminRank(v, Ranks.Operator);
	db.updateBio(v, "This account is reserved for admin use only.");
});






/*
* This SHOULD be the external interface for accessing
* database stuff... Clearly, it's not, though, and that
* needs to change soon. Code outside db.ts and statements.ts
* should not be able to do anything with the DB except
* calling the provided methods. Maintaining code like this
* in its current state is really annoying when requirements
* are constantly changing.
*
* tl;dr git gud at encapsulation
*/

export namespace db {
	export async function register(user: string, pass: string) {
		// Get hash of password
		const hashed = await bcrypt.hash(pass, 10);

		// Put in DB
		await conn.execute(`
			INSERT INTO users(name, passHash, uuid)
			VALUES(?, ?, ?);
		`, [user, hashed, newUUID()]);

		return hashed;
	}
	
	export async function registerIfNotExists(user: string, pass: string) {
		if (await getFromUsername(user)) return null;

		return await register(user, pass);
	}

	export async function getFromUsername(user: string) {
		return await conn.execute(`
			SELECT name, uuid, passHash FROM users
			WHERE name = ? COLLATE NOCASE;
		`, [user]);
	}

	export function setAdminRank(user: string, rank: number) {
		conn.execute(`
			UPDATE users
			SET adminRank = ?
			WHERE name = ? COLLATE NOCASE;
		`, [rank, user]);
	}

	export function updateBio(user: string, bio: string) {
		conn.execute(`
			UPDATE users
			SET bio = ?
			WHERE name = ? COLLATE NOCASE;
		`, [bio, user]);
	}




	
	export const editLoginToken = conn.execute(`
		UPDATE users
		SET authToken = ?
		WHERE name = ? COLLATE NOCASE;
	`);

	export const getUser = conn.execute(`
		SELECT name, uuid, adminRank, bio FROM users
		WHERE name = ? COLLATE NOCASE;
	`);

	export const postCapsule = conn.execute(`
		INSERT INTO capsules(uuid, name, creator, version, content)
		VALUES (?, ?, ?, ?, ?);
	`);

	export const getCapsule = conn.execute(`
		SELECT rowid, * FROM capsules
		WHERE uuid = (?) AND visible = 1;
	`);

	export const searchCapsules = conn.execute(`
		SELECT rowid, *
		FROM capsules WHERE visible = 1 AND name like '%' || ? || '%'
		ORDER BY rowid DESC
		LIMIT 25;
	`);

	export const capsuleQPosts = conn.execute(`
		SELECT rowid, *
		FROM capsules WHERE visible = 1
		ORDER BY likes DESC
		LIMIT 25;
	`);

	export const getGame = conn.execute(`
		SELECT rowid, * FROM games
		WHERE id = (?) AND visible = 1;
	`);

	export const gameQPosts = conn.execute(`
		SELECT rowid, *
		FROM games WHERE visible = 1
		ORDER BY rowid DESC
		LIMIT 25;
	`);

	export const getNews = conn.execute(`
		SELECT rowid, * FROM news
		WHERE rowid = (?) AND visible = 1;
	`);

	export const newsQPosts = conn.execute(`
		SELECT title, author, date, rowid
		FROM news WHERE visible = 1
		ORDER BY rowid DESC
		LIMIT 25;
	`);
}

export default db;
