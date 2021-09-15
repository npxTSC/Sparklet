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
	let post
	if (typeof postId === "number") {
		post = db.prepare(`
			SELECT rowid, * FROM news
			WHERE rowid = (?) AND visible = 1
		`).get(postId);
	}

	let passed = {
		postId: postId,
		postData: post,
	}
	
	if (post) res.render("article", passed);
	else res.render("404");
});

app.get("/news", (req, res) => {
	let qposts = db.prepare("SELECT title, author, date FROM news WHERE visible = 1").all();

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
