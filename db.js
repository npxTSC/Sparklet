// MYSQL IS TRASH, DOESN'T WORK
const db = require("better-sqlite3")("./db/db.sqlite3");

// WAL mode, improves performance
db.pragma('journal_mode = WAL');

// Drop table in debug
db.prepare("DROP TABLE IF EXISTS users;").run();

// Make table
db.prepare(`
		CREATE TABLE IF NOT EXISTS users(
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL
		);
	`).run();

module.exports = db;