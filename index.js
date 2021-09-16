"use strict";

// Modules
const Express = require("express"),
	bp = require("body-parser"),
	cparse = require('cookie-parser'),
	b = require("bcrypt"),
	path = require("path"),
	ejs = require("ejs"),
	// Local Modules
	db = require("./db.js");

// CONSTANTS
const port = 3000,
	src = "src";

const app = Express();
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(Express.static(path.join(__dirname, src)));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/about", (req, res) => {
	res.render("about");
});

app.get("/news/:PostID", (req, res) => {
	let postId = parseInt(req.params["PostID"]);
	if (typeof postId !== "number") {res.end(); return}
	
	let post = db.prepare(`
		SELECT rowid, * FROM news
		WHERE rowid = (?) AND visible = 1
	`).get(postId);

	if (!post) {res.render("404"); return}
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

	for (const i in qposts) {
		qposts[i].date = new Date(qposts[i].date);
	}

	// Data passed to the render engine
	let passed = {
		// Quick Posts: Doesn't include content, just enough
		// stuff to display an interesting link.
		qposts: qposts
	}

	res.render("news", passed);
});

app.listen(port, () => {
	console.log("Listening on port " + port);
});

//
