import bsqlite3 			from "better-sqlite3";
import {v4 as newUUID}		from "uuid";
import bcrypt	 			from "bcrypt";
import fs					from "fs";

// Delete old table in debug, to get rid of old data. DISABLE IN PRODUCTION!
try {
	fs.unlinkSync("./db/db.sqlite3");
} catch (e) {
	console.error(e);
}


export const db = bsqlite3("./db/db.sqlite3");

// WAL mode, improves performance
db.pragma("journal_mode = WAL");


// Make tables
db.prepare(`
	CREATE TABLE IF NOT EXISTS users(
		name			TEXT		NOT NULL,
		uuid			TEXT		NOT NULL,
		passHash		TEXT		NOT	NULL,
		date			DATETIME	NOT NULL DEFAULT CURRENT_TIMESTAMP,
		emailVerified	BOOLEAN		NOT NULL DEFAULT 0
						CHECK (emailVerified IN (0, 1)),
		emailVToken		TEXT,
		authToken		TEXT
	);
`).run();

db.prepare(`
	CREATE TABLE IF NOT EXISTS news(
		title		TEXT		NOT NULL,
		author		TEXT		NOT NULL DEFAULT 'Anonymous',
		content		TEXT		NOT NULL,
		visible		BOOLEAN		NOT NULL DEFAULT 1 CHECK (visible IN (0, 1)),
		date		DATETIME	NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
`).run();

db.prepare(`
	CREATE TABLE IF NOT EXISTS games(
		id			TEXT PRIMARY KEY,
		title		TEXT		NOT NULL,
		creator		TEXT		NOT NULL DEFAULT 'Anonymous',
		description	TEXT		NOT NULL DEFAULT 'No description given... :(',
		visible		BOOLEAN		NOT NULL DEFAULT 1 CHECK (visible IN (0, 1)),
		date		DATETIME	NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
`).run();






db.prepare(`
	INSERT INTO news(title, author, content) VALUES (
		'Test Article',
		'Dexie',
		'<p>This was written to test SQL queries.</p>'
	);
`).run();

db.prepare(`
	INSERT INTO news(title, content) VALUES (
		'Test Article 2',
		'<p>This was written to test CSS with multiple articles.</p>'
	);
`).run();



db.prepare(`
	INSERT INTO games(title, creator, id) VALUES (
		'Speedrun Wordle',
		'Dexie',
		'hackathon-wordle'
	);
`).run();

export namespace accs {
	export async function register(user: string, pass: string) {
		// Get hash of password
		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(pass, salt);

		// Put in DB
		db.prepare(`
			INSERT INTO users(name, passHash, uuid)
			VALUES(?, ?, ?)
		`).run(user, hashed, newUUID());

		return hashed
	}

	export function getFromUsername(user: string) {
		return db.prepare(`
			SELECT name, uuid, passHash FROM users
			WHERE name = (?) COLLATE NOCASE
		`).get(user);
	}
}

accs.register("Dexie", process.env["ADMIN_PASSWORD"]);

