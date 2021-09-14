0  // MYSQL IS TRASH, DOESN'T WORK
const db = require("better-sqlite3")("./db/db.sqlite3");

db.prepare(`
		CREATE TABLE users(
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL
		);
	`).run();

module.exports = db;