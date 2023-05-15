import mysql 				from "mysql2/promise";
import bcrypt	 			from "bcrypt";
import waitOn				from "wait-on";
import * as util			from "./util.js";
import { ADMINS }			from "./consts.js";
import {
	Option, Nullable, SparkletDB,
	TimestampIntoDate, DateablePacket
}	from "./classes.js";

// for testing purposes... remove when we start
// processing important information someday
const DEFAULT_PASSWORD = "asdf";

util.loadEnv();
util.checkEnvReady([
	"DB_USER",
	"DB_PASS",
]);

const CONN_OPTIONS = {
	database:			"main",
	host:				"db",
	user:				process.env["DB_USER"]!,
	password:			process.env["DB_PASS"]!,
	multipleStatements:	true,
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
		query?:	DbRunMode,
	): Promise<T[]> {
		let res;

		if (!query) {
			// execute
			res = conn.execute<T[]>(sql, values);
		} else {
			// query
			res = conn.query<T[]>(sql, values);
		}

		return (await res)[0];
	}

	// type-safe shorthand for doing execute()[0][n]
	export async function executeGet<T extends mysql.RowDataPacket>(
		sql:	string,
		values:	any[],
		conn:	mysql.Pool,
		nth:	number,
		query?:	DbRunMode,
	): Promise<Option<T>> {
		const res = await executeGetArr<T>(sql, values, conn, query);
		return res[nth];
	}

	// shorthand to executeGet() and then dateify
	export async function executeGetDateify<T extends DateablePacket>(
		sql:	string,
		values:	any[],
		conn:	mysql.Pool,
		nth:	number,
		query?:	DbRunMode,
	): Promise<Option<TimestampIntoDate<T>>> {
		const atNth = await executeGet<T>(sql, values, conn, nth, query);
		return typeof atNth === "undefined" ? undefined : util.dateify(atNth);
	}

	// shorthand to executeGet() and then dateify
	export async function executeGetArrDateify<T extends DateablePacket>(
		sql:	string,
		values:	any[],
		conn:	mysql.Pool,
		query?:	DbRunMode,
	): Promise<TimestampIntoDate<T>[]> {
		const res = await executeGetArr<T>(sql, values, conn, query);

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

const enum DbRunMode {
	// Default is conn.execute()
	Execute	= 0,
	Query	= 1,

	__LENGTH
}

export namespace db {
	export async function register(user: string, pass: string) {
		// Get hash of password
		const hashed = await bcrypt.hash(pass, 10);

		// Put in DB
		const row = await dbGet.executeGetDateify<SparkletDB.SparkletUserRow>(`
			INSERT INTO users(name, passHash) VALUES(?, ?);
			SELECT * FROM users WHERE LOWER(name) = LOWER(?);
		`, [user, hashed, user], conn, 0, DbRunMode.Query);

		return row!;
	}
	
	export async function registerIfNotExists(user: string, pass: string) {
		if (await getUser(user)) return null;

		return await register(user, pass);
	}

	export async function setAdminRank(uuid: string, rank: number) {
		return conn.execute(`
			UPDATE users
			SET adminRank = ?
			WHERE LOWER(uuid) = LOWER(?);
		`, [rank, uuid]);
	}

	export async function updateBio(uuid: string, bio: string) {
		return conn.execute(`
			UPDATE users
			SET bio = ?
			WHERE LOWER(uuid) = LOWER(?);
		`, [bio, uuid]);
	}

	export async function editLoginToken(uuid: string, newToken: Nullable<string>) {
		return conn.execute(`
			UPDATE users
			SET authToken = ?
			WHERE LOWER(uuid) = LOWER(?);
		`, [newToken, uuid]);
	}
	
	export async function verifyLoginTokenWithName(name: string, token: string) {
		const row = await getUser(name);

		if (!row) return false;

		return verifyLoginToken(row.uuid, token);
	}
	
	export async function verifyLoginToken(uuid: string, token: string) {
		return await dbGet.executeGetDateify<SparkletDB.SparkletUserRow>(`
			SELECT name, uuid FROM users
			WHERE uuid = ? AND authToken = ?;
		`, [uuid, token], conn, 0);
	}

	export async function getUser(username: string) {
		return await dbGet.executeGetDateify<SparkletDB.SparkletUserRow>(`
			SELECT * FROM users
			WHERE LOWER(name) = LOWER(?);
		`, [username], conn, 0);
	}

	export async function getUserByUUID(uuid: string) {
		return await dbGet.executeGetDateify<SparkletDB.SparkletUserRow>(`
			SELECT * FROM users
			WHERE uuid = ?;
		`, [uuid], conn, 0);
	}

	export async function getCapsule(uuid: string) {
		return await dbGet.executeGetDateify<SparkletDB.CapsuleRow>(`
			SELECT * FROM capsules
			WHERE uuid = (?) AND visible = 1;
		`, [uuid], conn, 0);
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

		export async function postSpark(
			title:		string,
			creator:	string,
			desc:		string,
		) {
			return (await dbGet.executeGetDateify<SparkletDB.CapsuleRow>(`
				INSERT INTO games(title, creator, description, visible)
				VALUES (?, ?, ?, 1);

				SELECT * FROM games
				WHERE LOWER(creator) = LOWER(?)
				ORDER BY date DESC
				LIMIT 1;
			`, [title, creator, desc, creator], conn, 0, DbRunMode.Query))!;
		}

		export async function postCapsule(
			name:		string,
			creator:	string,
			version:	string,
			content:	string
		) {
			return await dbGet.executeGetDateify<SparkletDB.CapsuleRow>(`
				INSERT INTO capsules(name, creator, version, content)
				VALUES (?, ?, ?, ?, ?);
			`, [name, creator, version, content], conn, 0);
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
