"use strict";

// Modules
import Express				from "express";
import cparse				from "cookie-parser";
import bcrypt				from "bcrypt";
import path					from "path";
import ejs					from "ejs";
import http					from "http";
import {Server}				from "socket.io";
import { v4 as newUUID }	from "uuid";

// Local Modules
import {Room, Keyable}		from "./classes";
import {filterStrings}		from "./util";
import db					from "./db";

// CONSTANTS
const PORT = 3000;

// App
const app					= Express();
const server				= http.createServer(app);
const io					= new Server(server);
const activeRooms: Room[]	= [
	{	// Debug Room #79
		joinHash:	79,
		ownerAccId:	0,
		quizId:		0,
		currentQ:	0,
		players:	[]
	}
];

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.static(path.join(__dirname, "dist")));
app.use(Express.static(path.join(__dirname, "src/img")));
app.set("view engine", "ejs");


app.get("/", (req, res) => {
	res.render("home");
});

app.get("/about", (req, res) => {
	res.render("about");
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
	
	res.render("quizplay");
});




app.get("/news/:PostID", (req, res) => {
	let postId = parseInt(req.params["PostID"], 10);
	if (typeof postId !== "number" || isNaN(postId))
		return res.render("404");
	
	let post = db.prepare(`
		SELECT rowid, * FROM news
		WHERE rowid = (?) AND visible = 1
	`).get(postId);

	if (!post) { return res.render("404"); }
	else {
		post.date = new Date(post.date);

		let passed = {
			postId: postId,
			post: post,
		}

		res.render("article", passed);
	}
});

app.get("/news", (req, res) => {
	let qposts = db.prepare(`
		SELECT title, author, date, rowid
		FROM news WHERE visible = 1
		ORDER BY rowid DESC
		LIMIT 25
	`).all();

	for (const i in qposts)
		qposts[i].date = new Date(qposts[i].date);

	// Data passed to the render engine
	let passed = {
		// Quick Posts: Doesn't include content, just enough
		// stuff to display an interesting link.
		qposts: qposts
	}

	res.render("news", passed);
});

app.get("/games/:GameID", (req, res) => {
	let postId = parseInt(req.params["GameID"], 10);
	if (typeof postId !== "number" || isNaN(postId)) {
		return res.render("404");
	}

	let post = db.prepare(`
		SELECT rowid, * FROM games
		WHERE rowid = (?) AND visible = 1
	`).get(postId);

	if (!post) { return res.render("404"); }
	else {
		post.date = new Date(post.date);

		let passed = {
			postId: postId,
			post: post,
		}

		res.render("game", passed);
	}
});

app.get("/games", (req, res) => {
	let qposts = db.prepare(`
		SELECT rowid, *
		FROM games WHERE visible = 1
		ORDER BY rowid DESC
		LIMIT 25
	`).all();

	for (const i in qposts) {
		qposts[i].date = new Date(qposts[i].date);
	}

	// Data passed to the render engine
	let passed = {
		// Quick Posts: Doesn't include content, just enough
		// stuff to display an interesting link.
		qposts: qposts
	}

	res.render("catalog", passed);
});


app.get("/login", (req, res) => {
	res.render("login");
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
		const inp: Keyable<string> = JSON.parse(jsoni);
		
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
		filterStrings(id, [" ", ",", "."]),
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
    //return req.headers['x-forwarded-for'].split(',').shift()
    //|| req.socket.remoteAddress;
	return req.socket.remoteAddress;
}
