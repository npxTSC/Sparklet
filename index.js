"use strict";

// Modules
const Express = require("express"),
	cparse = require('cookie-parser'),
	b = require("bcrypt"),
	path = require("path"),
	ejs = require("ejs"),
	// Local Modules
	db = require("./db.js"),

// CONSTANTS
	port = 3000,
	src = "src";

const app = Express();
app.use(Express.json());
app.use(Express.urlencoded());
app.use(Express.static(path.join(__dirname, src)));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/about", (req, res) => {
	res.render("about");
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


// Javascript-Engine Sparklet System (aka JESS):
// Browser-based OS you can run on Sparklet

// JESS About/Login page
app.get("/jess", (req, res) => {
	res.render("jesslogin");
});

// JESS OS (Once login provided)
app.post("/jess", (req, res) => {
	const data = req.body;
	if (typeof data.CID !== "string") { return res.render("404"); }

	let conductor = db.prepare(`
		SELECT rowid, * FROM conductors
		WHERE name = (?) AND active = 1
	`).get(data.CID);

	if (conductor) {
		post.date = new Date(post.date);

		let passed = {
			postId: postId,
			post: post,
		}

		res.render("jess", passed);
	} else {
		res.render("jesslogin", {failed: "username"});
	}
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















let {} = app.listen(port, () => {
	console.log("Listening on port " + port);
});

// Functions

function getIp(req) {
    //return req.headers['x-forwarded-for'].split(',').shift()
    //|| req.socket.remoteAddress;
	return req.socket.remoteAddress;
}
