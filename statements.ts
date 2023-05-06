import {db}			from "./db";

/*
* This SHOULD be the external interface for accessing
* database stuff... Clearly, it's not, though, and that
* needs to change soon. Code outside db.ts and statements.ts
* should not be able to do anything with the DB except
* calling the provided methods. Maintaining code like this
* in its current state is really annoying when requirements
* are constantly changing.
*
* tl;dr git gud at encapsulation
*/

// SQL prepared statements
namespace statements {
	export const updateBio = db.prepare(`
		UPDATE users
		SET bio = ?
		WHERE name = ? COLLATE NOCASE;
	`);
	
	export const editLoginToken = db.prepare(`
		UPDATE users
		SET authToken = ?
		WHERE name = ? COLLATE NOCASE;
	`);
	
	export const editAdminRank = db.prepare(`
		UPDATE users
		SET adminRank = ?
		WHERE name = ? COLLATE NOCASE;
	`);

	export const getUser = db.prepare(`
		SELECT name, uuid, adminRank, bio FROM users
		WHERE name = ? COLLATE NOCASE;
	`);

	export const getUserPH = db.prepare(`
		SELECT name, uuid, passHash FROM users
		WHERE name = ? COLLATE NOCASE;
	`);

	export const registerUser = db.prepare(`
		INSERT INTO users(name, passHash, uuid)
		VALUES(?, ?, ?);
	`);

	export const postCapsule = db.prepare(`
		INSERT INTO capsules(uuid, name, creator, version, content)
		VALUES (?, ?, ?, ?, ?);
	`);

	export const getCapsule = db.prepare(`
		SELECT rowid, * FROM capsules
		WHERE uuid = (?) AND visible = 1;
	`);

	export const searchCapsules = db.prepare(`
		SELECT rowid, *
		FROM capsules WHERE visible = 1 AND name like '%' || ? || '%'
		ORDER BY rowid DESC
		LIMIT 25;
	`);

	export const capsuleQPosts = db.prepare(`
		SELECT rowid, *
		FROM capsules WHERE visible = 1
		ORDER BY likes DESC
		LIMIT 25;
	`);

	export const getGame = db.prepare(`
		SELECT rowid, * FROM games
		WHERE id = (?) AND visible = 1;
	`);

	export const gameQPosts = db.prepare(`
		SELECT rowid, *
		FROM games WHERE visible = 1
		ORDER BY rowid DESC
		LIMIT 25;
	`);

	export const getNews = db.prepare(`
		SELECT rowid, * FROM news
		WHERE rowid = (?) AND visible = 1;
	`);

	export const newsQPosts = db.prepare(`
		SELECT title, author, date, rowid
		FROM news WHERE visible = 1
		ORDER BY rowid DESC
		LIMIT 25;
	`);
}

export default statements;