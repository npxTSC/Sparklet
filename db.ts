import mysql 			from "mysql2";
import {v4 as newUUID}	from "uuid";
import bcrypt	 		from "bcrypt";
import {Ranks}			from "./classes";

loadEnv();

const con = mysql.createConnection({
	host: "localhost",
	port: 3001,
	user: "yourusername",
	password: "yourpassword"
});

con.connect((err) => {
	if (err) throw err;
	console.log("Connected!");
});


{
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
		const hashed = await bcrypt.hash(pass, 10);

		// Put in DB
		statements.registerUser.run(user, hashed, newUUID());

		return hashed;
	}
	
	export async function registerIfNotExists(u: string, p: string) {
		if (getFromUsername(u)) return null;

		return await register(u, p);
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
	const adm = process.env["ADMIN_PASSWORD"];

	console.assert(adm, "NO ADMIN_PASSWORD IN ENV FILE!");

	await accs.registerIfNotExists(v, adm!);
	accs.setAdminRank(v, Ranks.Operator);
	accs.updateBio(v, "This account is reserved for admin use only.");
});
