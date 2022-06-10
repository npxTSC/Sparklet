"use strict";

// Modules
import Express				from "express";
import crypto				from "crypto";
import cparse				from "cookie-parser";
import bcrypt				from "bcrypt";
import path					from "path";
import ejs					from "ejs";
import http					from "http";
import {Server as ioServer}	from "socket.io";
import {v4 as newUUID}		from "uuid";
import {str}				from "libdx";
import gzipCompression		from "compression";
import fs					from "fs";

// Local Modules
import {Room}				from "./classes";
import {db, accs}			from "./db";
import statements			from "./statements";
import accountsMw			from "./middleware/accounts";

// CONSTANTS
const PORT = 3000;

// App
export const app			= Express();
const server				= http.createServer(app);
const io					= new ioServer(server);
const activeRooms: Room[]	= [
	{	// Debug Room #79
		joinHash:	79,
		ownerAccId:	0,
		quizId:		0,
		currentQ:	0,
		players:	[],
	}
];

app.use(Express.json());
app.use(cparse());
app.use(accountsMw);
app.use(gzipCompression());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.static(path.join(__dirname, "dist")));
app.set("view engine", "ejs");


app.get("/", (req, res) => {
	res.render("home");
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.post("/login", async (req, res) => {
	const user = req.body?.username;
	const pass = req.body?.password;
	const action = req.body?.loginAction;

	if (str.containsSpecials(user)) return fail("l-specialChars");

	let row = accs.getFromUsername(user);

	switch (action) {
		case "Register":
			// Opposite of login, reject if exists
			if (row) return fail("r-nameExists");

			if (!pass || (pass.length === 0))
				return fail("r-noPassword");

			const hashed = await accs.register(user, pass);

			console.log(`New account created: ${user}`);

			// Prevents unnecessary DB calls...
			row = {
				passHash: hashed
			}
			
			// Fall-through to Login, because let's be real,
			// it's fucking annoying when you need to log in
			// after registering on a site ¯\_(ツ)_/¯
		
		case "Log In":
			// If username not found, reject early
			if (!row) return fail("l-nameNotFound");
			
			// Compare password to hash
			const correct = bcrypt.compare(pass, row.passHash);
			
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
			
			statements.editLoginToken.run(user, null);
			
			res.redirect("/login");
			break;

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
		const token = crypto.randomBytes(512).toString("hex");

		statements.editLoginToken.run(token, user);

		return token;
	}
});



app.get("/conductors/:profile", async (req, res) => {
	const {profile}			= req.params;
	const {account: user}	= res.locals;

	console.log(
		`${user?.name ?? "<Anon>"} requested profile of "${profile}"`
	);
	
	if (str.containsSpecials(profile)) return res.render("404");
	
	let row = statements.getUser.get(profile);

	if (!row) return res.render("404");
	
	// User exists, so... do something?
	return res.render("profile", {profileInfo: row});
});



app.get("/about", (req, res) => {
	res.render("about");
});

app.get("/rooms/breakout", (req, res) => {
	res.render("breakout");
});

app.get("/rooms/quiz", (req, res) => {
	res.render("quiz");
});

app.get("/rooms/quiz/:room", (req, res) => {
	const room = parseInt(req.params.room, 10);

	// Guard clause for invalid inputs
	if (typeof room !== "number"	||
		isNaN(room)					||
		checkRoomExists(room.toString()) !== "Found") {
	
		return res.render("404");
	}
	
	res.render("quizplay", {room: room});
});

app.get("/news/:PostID", (req, res) => {
	let postId = parseInt(req.params["PostID"], 10);
	if (typeof postId !== "number" || isNaN(postId))
		return res.render("404");
	
	let post = statements.getNews.get(postId);

	if (!post) return res.render("404");

	
	post.date = new Date(post.date);

	let passed = {
		postId: postId,
		post: post,
	}

	res.render("article", passed);
});

app.get("/news", (req, res) => {
	let qposts = statements.newsQPosts.all();

	for (const i in qposts)
		qposts[i].date = new Date(qposts[i].date);

	// Data passed to the render engine
	let passed = {
		// Quick Posts: No content, just headline data
		qposts: qposts
	}

	res.render("news", passed);
});

app.get("/sparks/:GameID", (req, res) => {
	let postId = req.params["GameID"];
	if (!postId) {
		return res.render("404");
	}

	let post = statements.getGame.get(postId);

	if (!post) return res.render("404");
	
	post.date = new Date(post.date);

	let passed = {
		postId: postId,
		post: post,
	}

	res.render("sparks/"+postId, passed);
});

app.get("/sparks", (req, res) => {
	let qposts = statements.gameQPosts.all();

	for (const i in qposts) {
		qposts[i].date = new Date(qposts[i].date);
	}

	// Data passed to the render engine
	let passed = {
		qposts: qposts
	}

	res.render("catalog", passed);
});

app.get("/capsules", async (req, res) => {
	const qposts = statements.capsuleQPosts.all().map(v => {
		const jsondata = fs.readFileSync(
			`./dist/public/capsules/${v.uuid}.json`
		).toString();
		
		return {
			// all JSON data...
			...JSON.parse(jsondata),
			// PLUS the following information:

			// Capsule UUID (from DB query)
			uuid: v.uuid,

			// JS Date Object instead of Unix Epoch Time
			date: new Date(v.date),
		}
	});

	res.render("capsules", {qposts});
});



io.on("connection", (socket) => {
	console.log("User Connected");
	socket.on("disconnect", () => {
		console.log("User Disconnected");
	});

	socket.on("queryRoom", (id) => {
		const res = checkRoomExists(id);
		
		switch (res) {
			case "NaN":
			case "Not Found":
				socket.emit("quizNotFound");
				console.log("Invalid quiz " + id);
				break;
			case "Found":
				socket.emit("quizFound");
				console.log("Successful quiz " + id);
				break;
		}
	});

	socket.on("joinRoom", (jsoni) => {
		const inp: Record<string, string> = JSON.parse(jsoni);
		
		// If quiz invalid
		if (checkRoomExists(inp.roomcode) !== "Found") {
			console.log("Attempt to join finished quiz :P");
			socket.emit("quizNotFound on step 2");
			return;
		}

		// Add user to quiz
		console.log(`User ${inp.username} joined code ${inp.roomcode}`);
		let roomStatus = "waiting";
		let quizToken = newUUID();
		console.log(quizToken);
		
		socket.emit("joinRoomSuccess", {
			roomStatus,
			quizToken,
		});
	});
});

function checkRoomExists(id: string) {
	const receivedId = parseInt(
		str.filterStrings(id, [" ", ",", "."]),
	10);

	if (isNaN(receivedId)) return "NaN";

	const searched = activeRooms.filter(
		(v) => v.joinHash === receivedId
	);

	if (searched.length === 0)	return "Not Found";
	else						return "Found";
}

let {} = server.listen(PORT, () => {
	console.log("Listening on port " + PORT);
});

// Functions

function getIp(req: any) {
	return req.socket.remoteAddress;
}
