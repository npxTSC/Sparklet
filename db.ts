import mysql 				from "mysql2/promise";
import {v4 as newUUID}		from "uuid";
import bcrypt	 			from "bcrypt";
import waitOn				from "wait-on";
import * as util			from "./util.js";
import { ADMINS }			from "./consts.js";
import {
	Option, Nullable, SparkletDB,
	TimestampIntoDate, DateablePacket
}	from "./classes.js";

const DEFAULT_PASSWORD_FOR_TESTING = "asdf";

util.loadEnv();
util.checkEnvReady([
	"DB_USER",
	"DB_PASS",
]);

const CONN_OPTIONS = {
	database:	"main",
	host:		"db",
	user:		process.env["DB_USER"]!,
	password:	process.env["DB_PASS"]!,
};

console.log("Waiting for MariaDB container...");
await waitOn({
	resources: [
		"tcp:db:3306"
	],

	delay: 1000,
});

console.log("MariaDB container is up! Connecting...");
const conn = await mysql.createPool(CONN_OPTIONS);

console.log("Connected to DB.");

await initTables(conn);


namespace dbGet {
	/*
	* Ideally, we only use conn.execute() for tasks that don't
	* return anything related to the SQL command...
	*
	* Think of stuff like updating tokens, setting passwords, etc.
	*/

	export async function executeGetArr<T extends mysql.RowDataPacket>(
		sql:	string,
		values:	any[],
		conn:	mysql.Pool,
	): Promise<T[]> {
		const res = await conn.execute<T[]>(sql, values);
		return res[0];
	}

	// type-safe shorthand for doing execute()[0][n]
	export async function executeGet<T extends mysql.RowDataPacket>(
		sql:	string,
		values:	any[],
		conn:	mysql.Pool,
		nth:	number,
	): Promise<Option<T>> {
		const res = await executeGetArr<T>(sql, values, conn);
		return res[nth];
	}

	// shorthand to executeGet() and then dateify
	export async function executeGetDateify<T extends DateablePacket>(
		sql:	string,
		values:	any[],
		conn:	mysql.Pool,
		nth:	number,
	): Promise<Option<TimestampIntoDate<T>>> {
		const atNth = await executeGet<T>(sql, values, conn, nth);
		return typeof atNth === "undefined" ? undefined : util.dateify(atNth);
	}

	// shorthand to executeGet() and then dateify
	export async function executeGetArrDateify<T extends DateablePacket>(
		sql:	string,
		values:	any[],
		conn:	mysql.Pool,
	): Promise<TimestampIntoDate<T>[]> {
		const res = await executeGetArr<T>(sql, values, conn);

		/*
		* we can safely say it's not an Option<T>[] because...
		* well, that'd be stupid. The only reason we used
		* Option<T> earlier was because there was a chance
		* that row 0 doesn't exist, but if someone calls this
		* function, it's their responsibility to check length.
		*/

		return res.map(util.dateify);
	}
}

export namespace db {
	export async function register(user: string, pass: string) {
		// Get hash of password
		const hashed = await bcrypt.hash(pass, 10);

		// Put in DB
		const row = await dbGet.executeGetDateify<SparkletDB.SparkletUserRow>(`
			INSERT INTO users(name, passHash) VALUES(?, ?);
			SELECT * FROM users WHERE name = ?;
		`, [user, hashed, user], conn, 0);

		return row!;
	}
	
	export async function registerIfNotExists(user: string, pass: string) {
		if (await getFromUsername(user)) return null;

		return await register(user, pass);
	}

	export async function getFromUsername(user: string) {
		return dbGet.executeGetDateify<SparkletDB.SparkletUserRow>(`
			SELECT name, uuid, passHash FROM users
			WHERE LOWER(name) = LOWER(?);
		`, [user], conn, 0);
	}

	export async function setAdminRank(user: string, rank: number) {
		return conn.execute(`
			UPDATE users
			SET adminRank = ?
			WHERE LOWER(name) = LOWER(?);
		`, [rank, user]);
	}

	export async function updateBio(user: string, bio: string) {
		return conn.execute(`
			UPDATE users
			SET bio = ?
			WHERE LOWER(name) = LOWER(?);
		`, [bio, user]);
	}

	export async function editLoginToken(user: string, newToken: Nullable<string>) {
		return conn.execute(`
			UPDATE users
			SET authToken = ?
			WHERE LOWER(name) = LOWER(?);
		`, [newToken, user]);
	}

	export async function verifyLoginToken(user: string, token: string) {
		return await dbGet.executeGetDateify<SparkletDB.SparkletUserRow>(`
			SELECT name, uuid FROM users
			WHERE LOWER(name) = LOWER(?) AND authToken = (?);
		`, [user, token], conn, 0);
	}

	export async function getUser(username: string) {
		return await dbGet.executeGetDateify<SparkletDB.SparkletUserRow>(`
			SELECT name, uuid, adminRank, bio, pfpSrc FROM users
			WHERE LOWER(name) = LOWER(?);
		`, [username], conn, 0);
	}

	export async function getUserByUUID(uuid: string) {
		return await dbGet.executeGetDateify<SparkletDB.SparkletUserRow>(`
			SELECT * FROM users
			WHERE uuid = ?;
		`, [uuid], conn, 0);
	}

	export async function postCapsule(
		uuid:		string,
		name:		string,
		creator:	string,
		version:	string,
		content:	string
	) {
		return await dbGet.executeGetDateify<SparkletDB.CapsuleRow>(`
			INSERT INTO capsules(uuid, name, creator, version, content)
			VALUES (?, ?, ?, ?, ?);
		`, [uuid, name, creator, version, content], conn, 0);
	}

	export async function getCapsule(capsuleUuid: string) {
		return await dbGet.executeGetDateify<SparkletDB.CapsuleRow>(`
			SELECT * FROM capsules
			WHERE uuid = (?) AND visible = 1;
		`, [capsuleUuid], conn, 0);
	}

	export async function searchCapsules(query: string) {
		return await dbGet.executeGetArrDateify<SparkletDB.CapsuleRow>(`
			SELECT *
			FROM capsules WHERE visible = 1 AND name like '%' || ? || '%'
			ORDER BY date DESC
			LIMIT 25;
		`, [query], conn);
	}

	export async function capsuleQPosts() {
		// TODO select less data... qposts are only surface-level overviews
		return await dbGet.executeGetArrDateify<SparkletDB.CapsuleRow>(`
			SELECT *
			FROM capsules WHERE visible = 1
			ORDER BY likes DESC
			LIMIT 25;
		`, [], conn);
	}

	export async function getGame(uuid: string) {
		return await dbGet.executeGetDateify<SparkletDB.SparkRow>(`
			SELECT * FROM games
			WHERE uuid = (?) AND visible = 1;
		`, [uuid], conn, 0);
	}

	export async function gameQPosts() {
		return await dbGet.executeGetArrDateify<SparkletDB.SparkRow>(`
			SELECT *
			FROM games WHERE visible = 1
			ORDER BY date DESC
			LIMIT 25;
		`, [], conn);
	}

	export async function getNews(uuid: string) {
		return await dbGet.executeGetDateify<SparkletDB.NewsPostRow>(`
			SELECT * FROM news
			WHERE uuid = (?) AND visible = 1;
		`, [uuid], conn, 0);
	}

	export async function newsQPosts() {
		return await dbGet.executeGetArrDateify<SparkletDB.NewsPostRow>(`
			SELECT title, author, date, uuid
			FROM news WHERE visible = 1
			ORDER BY date DESC
			LIMIT 25;
		`, [], conn);
	}

	export namespace admin {
		export async function lmfao() {
			return conn.execute(`
				DROP TABLE IF EXISTS users;
			`);
		}
	}
}

export default db;


// Remove this once there's a way for user "Mira" to assign ranks.
Object.entries(ADMINS).forEach(async ([name, rank]) => {
	db.registerIfNotExists(name, DEFAULT_PASSWORD_FOR_TESTING);
	db.setAdminRank(name, rank);
});

async function initTables(conn: mysql.Pool) {
	//await conn.execute(`DROP TABLE IF EXISTS users;`);

	await Promise.all([
		conn.execute(`
			CREATE TABLE IF NOT EXISTS users(
				uuid			UUID		PRIMARY KEY DEFAULT (UUID()),
				name			TEXT		NOT NULL,
				passHash		TEXT		NOT	NULL,
				date			BIGINT		NOT NULL DEFAULT (UNIX_TIMESTAMP()),
				adminRank		INT			NOT NULL DEFAULT 0,
				emailVerified	BOOL		NOT NULL DEFAULT 0,
				emailVToken		TEXT,
				authToken		TEXT,
				pfpSrc			TEXT,
				bio				TEXT
			);
		`),

		conn.execute(`
			CREATE TABLE IF NOT EXISTS news(
				uuid		UUID		PRIMARY KEY DEFAULT (UUID()),
				title		TEXT		NOT NULL,
				author		TEXT		NOT NULL DEFAULT 'Anonymous',
				content		TEXT		NOT NULL,
				visible		BOOL		NOT NULL DEFAULT 1,
				date		BIGINT		NOT NULL DEFAULT (UNIX_TIMESTAMP())
			);
		`),

		conn.execute(`
			CREATE TABLE IF NOT EXISTS games(
				uuid		UUID		PRIMARY KEY DEFAULT (UUID()),
				title		TEXT		NOT NULL,
				creator		TEXT		NOT NULL DEFAULT 'Anonymous',
				description	TEXT		NOT NULL DEFAULT 'No description given... :(',
				visible		BOOL		NOT NULL DEFAULT 1,
				date		BIGINT		NOT NULL DEFAULT (UNIX_TIMESTAMP())
			);
		`),

		conn.execute(`
			CREATE TABLE IF NOT EXISTS capsules(
				uuid		UUID		PRIMARY KEY DEFAULT (UUID()),
				name		TEXT		NOT NULL,
				creator		TEXT		NOT NULL,
				version		TEXT		NOT NULL,
				content		TEXT		NOT NULL,
				visible		BOOL		NOT NULL DEFAULT 1,
				date		BIGINT		NOT NULL DEFAULT (UNIX_TIMESTAMP()),
				likes		INT			NOT NULL DEFAULT 0
			);
		`),
	]);
}
