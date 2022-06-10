import {db}			from "./db";

// SQL prepared statements
namespace statements {
	export const editLoginToken = db.prepare(`
		UPDATE users
		SET authToken = ?
		WHERE name = ? COLLATE NOCASE
	`);

	export const getUser = db.prepare(`
		SELECT name, uuid FROM users
		WHERE name = ? COLLATE NOCASE
	`);

	export const getGame = db.prepare(`
		SELECT rowid, * FROM games
		WHERE id = (?) AND visible = 1
	`);

	export const gameQPosts = db.prepare(`
		SELECT rowid, *
		FROM games WHERE visible = 1
		ORDER BY rowid DESC
		LIMIT 25
	`);

	export const getNews = db.prepare(`
		SELECT rowid, * FROM news
		WHERE rowid = (?) AND visible = 1
	`);

	export const newsQPosts = db.prepare(`
		SELECT title, author, date, rowid
		FROM news WHERE visible = 1
		ORDER BY rowid DESC
		LIMIT 25
	`);

	export const capsuleQPosts = db.prepare(`
		SELECT uuid, date
		FROM capsules WHERE visible = 1
		ORDER BY rowid DESC
		LIMIT 25
	`);
}

export default statements;