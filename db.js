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
		author TEXT NOT NULL DEFAULT 'Anonymous',
		content TEXT NOT NULL,
		visible BOOLEAN NOT NULL DEFAULT 1 CHECK (visible IN (0, 1)),
		date DATETIME DEFAULT CURRENT_TIMESTAMP
	);
`).run();

db.prepare(`
	INSERT INTO news(title, author, content)
	VALUES (
		'Test Article',
		'Dexie',
		'This was written to test SQL queries'
	);
`).run();

db.prepare(`
	INSERT INTO news(title, content)
	VALUES (
		'Test Article 2',
		'This was written to test CSS with multiple articles.'
	);
`).run();


module.exports = db;