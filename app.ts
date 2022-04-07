"use strict";

// Modules
import Express	from "express";
import cparse	from "cookie-parser";
import bcrypt	from "bcrypt";
import path		from "path";
import ejs		from "ejs";
import http		from "http";
import {Server}	from "socket.io";

// Local Modules
import {Room}	from "./classes";
import db		from "./db";

// CONSTANTS
const PORT = 3000;

// App
const app					= Express();
const server				= http.createServer(app);
const io					= new Server(server);
const activeRooms: Room[]	= [];

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
	const room = parseInt(req.params.room);
	if (typeof room !== "number" || isNaN(room)) { return res.render("404"); }
	
	res.render("quiz");
});

app.get("/ip", (req, res) => {
	const ip = req.headers['x-forwarded-for'] ||
		req.socket.remoteAddress ||
		null;
	console.log(ip);
	res.send("User Tested IP: " + ip);
});

app.get("/news/:PostID", (req, res) => {
	let postId = parseInt(req.params["PostID"]);
	if (typeof postId !== "number" || isNaN(postId)) { return res.render("404"); }

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
	let qposts = db.prepare(`SELECT title, author, date, rowid
		FROM news WHERE visible = 1 ORDER BY rowid DESC LIMIT 25`).all();

	for (const i in qposts) qposts[i].date = new Date(qposts[i].date);

	// Data passed to the render engine
	let passed = {
		// Quick Posts: Doesn't include content, just enough
		// stuff to display an interesting link.
		qposts: qposts
	}

	res.render("news", passed);
});

app.get("/games/:GameID", (req, res) => {
	let postId = parseInt(req.params["GameID"]);
	if (typeof postId !== "number" || isNaN(postId)) { return res.render("404"); }

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
	let qposts = db.prepare(`SELECT rowid, *
		FROM games WHERE visible = 1 ORDER BY rowid DESC LIMIT 25`).all();

	for (const i in qposts) qposts[i].date = new Date(qposts[i].date);

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
	console.log("connection");

	socket.on("queryRoom", (id) => {
		const receivedId = parseInt(
			filterStrings(id, [" ", ",", "."]),
		10);

		if (isNaN(receivedId)) {
			socket.send("quiz code invalid");
			console.log("NaN quiz code");
		}

		const searched = activeRooms.filter((v) => v.joinHash === receivedId);

		if (searched.length === 0) {
			// No quiz found
			socket.send("quiz not found");
			console.log("Invalid quiz " + receivedId);
		} else {
			// Quiz join successful
			socket.send("quiz found");
			console.log("Successful quiz");
		}
	});
});





let {} = server.listen(PORT, () => {
	console.log("Listening on port " + PORT);
});

// Functions

function getIp(req: any) {
    //return req.headers['x-forwarded-for'].split(',').shift()
    //|| req.socket.remoteAddress;
	return req.socket.remoteAddress;
}

function filterStrings(str: string, filtered: string[]) {
	let res = str;
	filtered.forEach((v) => {
		res = res.replaceAll(v, "");
	});

	return res;
}
