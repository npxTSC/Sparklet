import bsqlite3 			from "better-sqlite3";
import {v4 as newUUID}		from "uuid";
import bcrypt	 			from "bcrypt";
import fs					from "fs";
import {Ranks}				from "./classes";

// Delete old table in debug, to get rid of old data.
// DISABLE IN PRODUCTION!

const PURGE_DATABASE = false;

if (PURGE_DATABASE) {
	try {
		fs.unlinkSync("./db/db.sqlite3");
	} catch (e) {
		console.error(e);
	}
}




export const db = bsqlite3("./db/db.sqlite3");

// WAL mode, improves performance
db.pragma("journal_mode = WAL");




if (PURGE_DATABASE) {
	// Make tables
	db.prepare(`
		CREATE TABLE IF NOT EXISTS users(
			name			TEXT		NOT NULL,
			uuid			TEXT		NOT NULL,
			passHash		TEXT		NOT	NULL,
			date			DATETIME	NOT NULL DEFAULT CURRENT_TIMESTAMP,
			adminRank		INTEGER		NOT NULL DEFAULT 0,
			emailVerified	BOOLEAN		NOT NULL DEFAULT 0
							CHECK (emailVerified IN (0, 1)),
			emailVToken		TEXT,
			authToken		TEXT,
			bio				TEXT
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
			id			TEXT		PRIMARY KEY,
			title		TEXT		NOT NULL,
			creator		TEXT		NOT NULL DEFAULT 'Anonymous',
			description	TEXT		NOT NULL DEFAULT 'No description given... :(',
			visible		BOOLEAN		NOT NULL DEFAULT 1 CHECK (visible IN (0, 1)),
			date		DATETIME	NOT NULL DEFAULT CURRENT_TIMESTAMP
		);
	`).run();
	
	db.prepare(`
		CREATE TABLE IF NOT EXISTS capsules(
			uuid		TEXT		PRIMARY KEY,
			name		TEXT		NOT NULL,
			creator		TEXT		NOT NULL,
			version		TEXT		NOT NULL,
			content		TEXT		NOT NULL,
			visible		BOOLEAN		NOT NULL DEFAULT 1 CHECK (visible IN (0, 1)),
			date		DATETIME	NOT NULL DEFAULT CURRENT_TIMESTAMP,
			likes		INTEGER		NOT NULL DEFAULT 0
		);
	`).run();
}



import statements			from "./statements";
if (PURGE_DATABASE) {
	statements.prepopulate.forEach(v => v.run());
}



export namespace accs {
	export async function register(user: string, pass: string) {
		// Get hash of password
		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(pass, salt);

		// Put in DB
		statements.registerUser.run(user, hashed, newUUID());

		return hashed;
	}

	export function getFromUsername(user: string) {
		return statements.getUserPH.get(user);
	}

	export function setAdminRank(user: string, rank: number) {
		statements.editAdminRank.run(rank, user);
	}

	export function updateBio(user: string, bio: string) {
		statements.updateBio.run(bio, user);
	}
}



[//	Reserved Username	// Reason
	"Dexie",			// Admin account
	"DexieTheSheep",	// Prevents admin impersonation
	"Sparklet",			// Prevents admin impersonation
	"Anonymous",		// Reserved for default name in DB
].forEach(async (v) => {
	await accs.register(v, process.env["ADMIN_PASSWORD"]);
	accs.setAdminRank(v, Ranks.Operator);
	accs.updateBio(v, "This account is reserved for admin use only.");
});
