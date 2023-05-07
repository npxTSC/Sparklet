"use strict";

// Modules
import Express				from "express";
import crypto				from "crypto";
import cparse				from "cookie-parser";
import bcrypt				from "bcrypt";
import path					from "path";
import http					from "http";
import {Server as ioServer}	from "socket.io";
import {str, rand}			from "libdx";
import gzipCompression		from "compression";
import fs					from "fs";
import sanitize				from "sanitize-filename";

import "ejs";

util.loadEnv();

// Local Modules
import {
	Room, AdminRank, QuizPlayer, SparkletDB,
} from "./classes";
import db						from "./db";
import accountParser			from "./middleware/accounts";
import { QUIZ_SOCKET_HANDLERS }	from "./quiz-utils";
import * as routes				from "./routes/all";
import { PORT }					from "./consts";
import * as util				from "./util";

// App
export const app					= Express();
export const activeRooms: Room[]	= [];
const server						= http.createServer(app);
const io							= new ioServer(server);

// Middleware
app.use(cparse());
app.use(accountParser);
app.use(gzipCompression());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.static(path.join(__dirname, "dist")));

// App config
app.locals.Ranks = AdminRank;
app.set("view engine", "ejs");


app.use((req, res, next) => {
	const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
	console.log(`${req.method} @ ${req.originalUrl}\n^^^ from ${ip}\n`);
	next();
});

// Routes
app.get("/", (req, res) => {
	res.render("home");
});

// robots.txt -> /public/robots.txt
app.get("/robots.txt", (req, res) => {
	res.sendFile(path.join(__dirname, "dist/public/robots.txt"));
});

app.get("/info(/*)?", (req, res) => {
	res.render("sussy");
});

app.get("/pets", (req, res) => {
	res.render("pets-info");
});

app.get("/about", (req, res) => {
	res.render("about");
});

app.use("/rooms",		routes.rooms);
app.use("/.well-known",	routes.wk);
app.use("/api",			routes.api);

app.post("/create-room/:roomType", async (req, res) => {
	const {roomType}	= req.params;
	const {cuuid}		= req.body;

	
	const row = await db.getCapsule(cuuid);
	if (!row) return res.status(400).json({
		bruhmoment:	"Invalid capsule! You shouldn't be here...",
	});
	

	let jh = "";

	// Make a random join code (repeat until unique)
	do jh = rand.r_str(6);
	while (activeRooms.filter(v => v.joinHash === jh).length > 0);

	// Admin token (doesn't have to be as secure, since rooms are temporary)
	const tok = generateToken(128);

	// Create new room object, and push it to activeRooms
	const newRoom = {
		joinHash:	jh,
		ownerAccId:	res.locals.account?.uuid,
		authToken:	tok,
		quizId:		cuuid,
		currentQ:	0,
		status:		"waiting",
		players:	<QuizPlayer[]>[],
	}
	
	activeRooms.push(newRoom);

	return res.status(200).json(newRoom);
});

app.get("/host-room/:rid", (req, res) => {
	return res.render("host-room");
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.post("/login", async (req, res) => {
	const {
		username:		user,
		password:		pass,
		loginAction:	action,
	} = req.body;
	
	// Empty usernames, specially crafted requests with missing fields, etc.
	if ([user, pass, action].some(v => (typeof v === "undefined" || v.length === 0))) {
		return fail("l-noInput");
	}

	if (str.containsSpecials(user))	return fail("l-specialChars");
	if (user.length > 30)			return fail("l-tooLong");
	if (pass.length > 100)			return fail("l-passTooLong");

	let row = await db.getFromUsername(user) satisfies SparkletDB.SparkletUser;

	switch (action) {
		case "Register":
			// Opposite of login, reject if exists
			if (row) return fail("r-nameExists");

			const hashed = await db.register(user, pass);

			console.log(`New account created: ${user}`);

			// Reassign row to new user object
			row = await db.getFromUsername(user);
			
			// Fall-through to Login, because let's be real,
			// it's fucking annoying when you need to log in
			// after registering on a site ¯\_(ツ)_/¯
		
		case "Log In":
			// If username not found, reject early
			if (!row) return fail("l-nameNotFound");
			
			// Compare password to hash
			const correct = await bcrypt.compare(pass, row.passHash);
			
			// If password is wrong, reject
			if (!correct) return fail("l-wrongPassword");
	
			// Password is correct
			console.log(`User ${user} logged in successfully`);

			// Change login token in DB
			const token = makeNewTokenFor(user);
			
			res.cookie("user", user);
			res.cookie("luster", token);
			res.redirect("/conductors/"+ user.toLowerCase());
			
			break;

		case "Log Out":
			// Remove auth cookie stuff
			res.cookie("user", null);
			res.cookie("luster", null);
			
			db.editLoginToken(user, null);
			
			return res.redirect("/login");

		default:
			// Malformed requests should be rejected
			res.status(400);
			return res.send("Use the form correctly pls :)");
	}

	function fail(code: string) {
		console.log(`Failed "${action}" on ${user}`);
		res.redirect("/login?ecode="+code);
	}

	function makeNewTokenFor(user: string) {
		const token = generateToken(512);

		db.editLoginToken(user, token);
		return token;
	}
});

app.get("/conductors/:profile", async (req, res) => {
	const {profile}		= req.params;
	const user			= res.locals.account;

	console.log(
		`${user?.name ?? "<Anon>"} requested profile of "${profile}"`
	);
	
	if (str.containsSpecials(profile)) return throw404(res);
	
	let row = db.getUser(profile);

	if (!row) return throw404(res);
	
	return res.render("profile", {profileInfo: row});
});

app.get("/news/:PostID", (req, res) => {
	let postId = req.params["PostID"];
	if (typeof postId !== "number" || isNaN(postId))
		return throw404(res);
	
	let post = db.getNews(postId);

	if (!post) return throw404(res);

	
	post.date = new Date(post.date);

	let passed = {
		postId: postId,
		post: post,
	}

	res.render("article", passed);
});

app.get("/news", (req, res) => {
	let qposts = db.newsQPosts().map(v => {
		v.date = new Date(v.date);
		return v;
	});

	res.render("news", {qposts});
});

app.get("/sparks/:SparkID", (req, res) => {
	let sparkId = req.params["SparkID"];
	if (!sparkId) return throw404(res);

	sparkId = sanitize(sparkId);

	let post = db.getGame(sparkId);

	if (!post) return throw404(res);
	
	post.date = new Date(post.date);

	let passed = {
		postId: sparkId,
		post: post,
	}

	res.render("sparks/"+sparkId, passed);
});

app.get("/sparks", (req, res) => {
	let qposts = db.gameQPosts().map(v => {
		v.date = new Date(v.date);
		return v;
	});

	res.render("catalog", {qposts});
});

app.get("/capsules", async (req, res) => {
	const qposts = db.capsuleQPosts().map(v => {
		const jsondata = fs.readFileSync(
			`./dist/public/capsules/${v.uuid}.json`
		).toString();
		
		return {
			...JSON.parse(jsondata),
			
			// PLUS the following information:

			uuid: v.uuid,
			date: new Date(v.date),
		}
	});

	res.render("capsules", {qposts});
});

// 404 other routes
app.get("*", (req, res) => throw404(res));


// Socket.IO handlers
io.on("connection", (socket) => {
	//socket.on("disconnect", () => {});

	socket.on("quizHostAction",	QUIZ_SOCKET_HANDLERS.quizHostAction(socket));
	socket.on("queryRoom",		QUIZ_SOCKET_HANDLERS.queryRoom(socket));
	socket.on("joinRoom",		QUIZ_SOCKET_HANDLERS.joinRoom(socket));
});





server.listen(PORT, () => {
	console.log("Listening on port " + PORT);
});

// Functions
export function throw404(res: Express.Response) {
	res.status(404);
	res.render("404");
}

export function generateToken(len: number) {
	return crypto.randomBytes(len).toString("hex");
}

export function findRoom(code: string) {
	return activeRooms.find(v => v.joinHash === code);
}
