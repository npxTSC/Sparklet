import mysql 							from "mysql2/promise";
import {v4 as newUUID}					from "uuid";
import bcrypt	 						from "bcrypt";
import {AdminRank, Option, SparkletDB}	from "./classes.js";
import * as util						from "./util.js";
import { ADMINS }						from "./consts.js";

const DEFAULT_PASSWORD_FOR_TESTING = "asdf";

util.loadEnv();
util.checkEnvReady([
	"MARIADB_ROOT_PASSWORD",
]);

const conn = await mysql.createPool({
	database:	"sparklet_main",
	host:		"db",
	user:		"root",
	password:	process.env["MARIADB_ROOT_PASSWORD"],
});

await initTables(conn);

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
		return (await conn.execute<SparkletDB.SparkletUser[]>(`
			SELECT name, uuid, passHash FROM users
			WHERE LOWER(name) = LOWER(?);
		`, [user]))[0][0];
	}

	export async function setAdminRank(user: string, rank: number) {
		return (await conn.execute<SparkletDB.SparkletUser[]>(`
			UPDATE users
			SET adminRank = ?
			WHERE LOWER(name) = LOWER(?);
		`, [rank, user]))[0][0];
	}

	export async function updateBio(user: string, bio: string) {
		return (await conn.execute<SparkletDB.SparkletUser[]>(`
			UPDATE users
			SET bio = ?
			WHERE LOWER(name) = LOWER(?);
		`, [bio, user]))[0][0];
	}

	export async function editLoginToken(user: string, newToken: Option<string>) {
		return (await conn.execute<SparkletDB.SparkletUser[]>(`
			UPDATE users
			SET authToken = ?
			WHERE LOWER(name) = LOWER(?);
		`, [newToken, user]))[0][0];
	}

	export async function verifyLoginToken(user: string, token: string) {
		return (await conn.execute<SparkletDB.SparkletUser[]>(`
			SELECT name, uuid FROM users
			WHERE LOWER(name) = LOWER(?) AND authToken = (?);
		`, [user, token]))[0][0];
	}

	export async function getUser(username: string) {
		return (await conn.execute<SparkletDB.SparkletUser[]>(`
			SELECT name, uuid, adminRank, bio, pfpSrc FROM users
			WHERE LOWER(name) = LOWER(?);
		`, [username]))[0][0];
	}

	export async function postCapsule(
		uuid:		string,
		name:		string,
		creator:	string,
		version:	string,
		content:	string
	) {
		return (await conn.execute<SparkletDB.Capsule[]>(`
			INSERT INTO capsules(uuid, name, creator, version, content)
			VALUES (?, ?, ?, ?, ?);
		`, [uuid, name, creator, version, content]))[0][0];
	}

	export async function getCapsule(capsuleUuid: string) {
		return (await conn.execute<SparkletDB.Capsule[]>(`
			SELECT * FROM capsules
			WHERE uuid = (?) AND visible = 1;
		`, [capsuleUuid]))[0][0];
	}

	export async function searchCapsules(query: string) {
		return (await conn.execute<SparkletDB.Capsule[]>(`
			SELECT *
			FROM capsules WHERE visible = 1 AND name like '%' || ? || '%'
			ORDER BY id DESC
			LIMIT 25;
		`, [query]))[0];
	}

	export async function capsuleQPosts() {
		// TODO select less data... qposts are only surface-level overviews
		return (await conn.execute<SparkletDB.Capsule[]>(`
			SELECT *
			FROM capsules WHERE visible = 1
			ORDER BY likes DESC
			LIMIT 25;
		`))[0];
	}

	export async function getGame(uuid: string) {
		return (await conn.execute<SparkletDB.Spark[]>(`
			SELECT * FROM games
			WHERE uuid = (?) AND visible = 1;
		`, [uuid]))[0][0];
	}

	export async function gameQPosts() {
		return (await conn.execute<SparkletDB.Spark[]>(`
			SELECT *
			FROM games WHERE visible = 1
			ORDER BY id DESC
			LIMIT 25;
		`))[0];
	}

	export async function getNews(uuid: string) {
		return (await conn.execute<SparkletDB.NewsPost[]>(`
			SELECT * FROM news
			WHERE uuid = (?) AND visible = 1;
		`, [uuid]))[0][0];
	}

	export async function newsQPosts() {
		return (await conn.execute<SparkletDB.NewsPost[]>(`
			SELECT title, author, date, uuid
			FROM news WHERE visible = 1
			ORDER BY id DESC
			LIMIT 25;
		`))[0];
	}
}

export default db;


// Remove this once there's a way for user "Mira" to assign ranks.
Object.entries(ADMINS).forEach(async ([name, rank]) => {
	db.registerIfNotExists(name, DEFAULT_PASSWORD_FOR_TESTING);
	db.setAdminRank(name, rank);
});

async function initTables(conn: mysql.Pool) {
	conn.execute(`
		CREATE TABLE IF NOT EXISTS users(
			id				INT			PRIMARY KEY AUTO_INCREMENT,
			uuid			TEXT		NOT NULL,
			name			TEXT		NOT NULL,
			passHash		TEXT		NOT	NULL,
			date			BIGINT		NOT NULL DEFAULT CURRENT_TIMESTAMP,
			adminRank		INT			NOT NULL DEFAULT 0,
			emailVerified	BOOL		NOT NULL DEFAULT 0,
			emailVToken		TEXT,
			authToken		TEXT,
			pfpSrc			TEXT,
			bio				TEXT
		);
	`);

	conn.execute(`
		CREATE TABLE IF NOT EXISTS news(
			id			INT				PRIMARY KEY AUTO_INCREMENT,
			uuid		TEXT			NOT NULL,
			title		TEXT			NOT NULL,
			author		TEXT			NOT NULL DEFAULT 'Anonymous',
			content		TEXT			NOT NULL,
			visible		BOOL			NOT NULL DEFAULT 1,
			date		BIGINT			NOT NULL DEFAULT CURRENT_TIMESTAMP
		);
	`);

	conn.execute(`
		CREATE TABLE IF NOT EXISTS games(
			id			INT				PRIMARY KEY AUTO_INCREMENT,
			uuid		TEXT			NOT NULL,
			title		TEXT			NOT NULL,
			creator		TEXT			NOT NULL DEFAULT 'Anonymous',
			description	TEXT			NOT NULL DEFAULT 'No description given... :(',
			visible		BOOL			NOT NULL DEFAULT 1,
			date		BIGINT			NOT NULL DEFAULT CURRENT_TIMESTAMP
		);
	`);

	conn.execute(`
		CREATE TABLE IF NOT EXISTS capsules(
			id			INT				PRIMARY KEY AUTO_INCREMENT,
			uuid		TEXT			NOT NULL,
			name		TEXT			NOT NULL,
			creator		TEXT			NOT NULL,
			version		TEXT			NOT NULL,
			content		TEXT			NOT NULL,
			visible		BOOL			NOT NULL DEFAULT 1,
			date		BIGINT			NOT NULL DEFAULT CURRENT_TIMESTAMP,
			likes		INT				NOT NULL DEFAULT 0
		);
	`);
}
