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
db.pragma("journal_mode = WAL");


// Make tables
db.prepare(`
	CREATE TABLE IF NOT EXISTS users(
		name			TEXT NOT NULL,
		passHash		TEXT NOT NULL,
		date			DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		emailVerified	${booleanSQL("emailVerified", false)} NOT NULL,
		emailVToken		TEXT,
		authToken		TEXT,
	);
`).run();

db.prepare(`
	CREATE TABLE IF NOT EXISTS news(
		title		TEXT		NOT NULL,
		author		TEXT		NOT NULL DEFAULT 'Anonymous',
		content		TEXT		NOT NULL,
		visible		${booleanSQL("visible", true)} NOT NULL,
		date		DATETIME	NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
`).run();

db.prepare(`
	CREATE TABLE IF NOT EXISTS games(
		id			TEXT PRIMARY KEY,
		title		TEXT		NOT NULL,
		creator		TEXT		NOT NULL DEFAULT 'Anonymous',
		description	TEXT		NOT NULL DEFAULT 'No description given... :(',
		visible		${booleanSQL("visible", true)} NOT NULL,
		embedded	${booleanSQL("embedded", false)} NOT NULL,
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

export default db;

function booleanSQL(name: string, deft = true): string {
	return
`BOOLEAN DEFAULT ${deft ? 1 : 0} CHECK (${name} IN (0, 1))`;
}