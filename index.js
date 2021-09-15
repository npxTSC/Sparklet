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

app.get("/news", (req, res) => {
	let posts = db.prepare("SELECT title, author FROM news WHERE visible = 1").get();
	//
	let passData = {
		posts: posts
	}

	res.render("news", passData);
});

app.listen(port, () => {
	console.log("Listening on port " + port);
});

