"use strict";

const Express = require("express"),
	db = require("./db.js"),
	bp = require("body-parser"),
	cparse = require('cookie-parser'),
	b = require("bcrypt"),
	path = require("path"),
	ejs = require("ejs");

// CONSTANTS
const port = 3000,
	src = "src";

const app = Express();
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(Express.static(path.join(__dirname, src)));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
	res.render("main");
});

app.listen(port, () => {
	console.log("Listening on port " + port);
});

