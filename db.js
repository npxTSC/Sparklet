// MYSQL IS TRASH, DOESN'T WORK
const sql = require("sqlite3");
const db = new sql.Database("./db/db.sqlite3");

db.serialize(() => {
	db.run(`
		DROP TABLE IF EXISTS businesses;
	`).run(`
		CREATE TABLE businesses(
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL
		);
	`);
});

module.exports = db;