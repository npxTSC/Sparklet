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
db.pragma("journal_mode = WAL");


// Make tables
db.prepare(`
	CREATE TABLE IF NOT EXISTS users(
		name TEXT NOT NULL,
		passHash TEXT NOT NULL
	);
`).run();

db.prepare(`
	CREATE TABLE IF NOT EXISTS news(
		title TEXT NOT NULL,
		author TEXT NOT NULL DEFAULT 'Anonymous',
		content TEXT NOT NULL,
		visible BOOLEAN NOT NULL DEFAULT 1 CHECK (visible IN (0, 1)),
		date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
`).run();

db.prepare(`
	CREATE TABLE IF NOT EXISTS games(
		title TEXT NOT NULL,
		creator TEXT NOT NULL DEFAULT 'Anonymous',
		description TEXT NOT NULL DEFAULT 'No description given... :(',
		requirements TEXT NOT NULL,
		visible BOOLEAN NOT NULL DEFAULT 1 CHECK (visible IN (0, 1)),
		embedded BOOLEAN NOT NULL DEFAULT 0 CHECK (embedded IN (0, 1)),
		date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
`).run();

// JESS VMs
db.prepare(`
	CREATE TABLE IF NOT EXISTS conductors(
		name TEXT NOT NULL,
		keyhash TEXT,
		doubleauth BOOLEAN NOT NULL DEFAULT 0 CHECK (doubleauth IN (0, 1)),
		active BOOLEAN NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
		dateMade DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
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
	INSERT INTO games(title, creator, requirements) VALUES (
		'Test Game',
		'Dexie',
		(?)
	);
`).run(JSON.stringify({
	js: [
		"game1.js"
	], css: [
		"game1.css"
	]
}));

export default db;