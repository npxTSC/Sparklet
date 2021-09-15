// MYSQL IS TRASH, DOESN'T WORK
const bsqlite3 = require("better-sqlite3");
const fs = require("fs");

// Delete old table in debug, to get rid of old data. DISABLE IN PRODUCTION!
try {
	fs.unlinkSync("./db/db.sqlite3");
} catch (e) {
	console.error(e);
}

const db = bsqlite3("./db/db.sqlite3");

// WAL mode, improves performance
db.pragma('journal_mode = WAL');

// Make tables
db.prepare(`
	CREATE TABLE IF NOT EXISTS users(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL
	);
`).run();

db.prepare(`
	CREATE TABLE IF NOT EXISTS news(
		title TEXT NOT NULL,
		author TEXT NOT NULL,
		content TEXT NOT NULL,
		visible BOOLEAN NOT NULL CHECK (visible IN (0, 1))
	);
`).run();

db.prepare(`
	INSERT INTO news
	VALUES (
		'Test Article',
		'Dexie',
		'This was written to test SQL queries',
		1
	)
`);


module.exports = db;