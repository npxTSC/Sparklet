"use strict";

// Modules
import Express	from "express";
import cparse	from "cookie-parser";
import bcrypt	from "bcrypt";
import path		from "path";
import ejs		from "ejs";

// Local Modules
import db		from "./db";

// CONSTANTS
const PORT = 3000;

const app = Express();
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

// Calling it a VM is like calling a Chromebook a laptop.
// It's technically true, but... come on!

// JESS About/Login page
app.get("/jess", (req, res) => {
	res.render("jesslogin");
});

// JESS OS (Once login provided)
app.post("/jess", (req, res) => {
	const data = req.body;
	if (typeof data.CID !== "string") { return res.render("jesslogin", {jessLoginError: "Login 404"}); }

	// Get conductor if exists
	let conductor = db.prepare(`
		SELECT rowid, * FROM conductors
		WHERE name = (?)
	`).get(data.CID);

	// If client requests a new VM
	if (data.makeNew) {
		// If Conductor ID already taken
		if (conductor) {
			// Render login page again, show error
			res.render("jesslogin", {jessLoginError: "VM Name Taken"});
		} else {
			// Make new VM
			db.prepare(`
				INSERT INTO conductors(name, keyhash, doubleauth, active)
				VALUES ( (?), (?), (?), 1 )
			`).run();
		}
	} else { // If client requests an existing VM
		if (conductor) {
			// If VM active, attempt to start it
			if (conductor.active) {
				let passed = {
				//	test: test,
				}

				res.render("jess", passed);
			} else { // Otherwise, tell the user the VM is dormant
				res.render("jesslogin", {
					jessLoginError: "Dormant Login Attempt"
				});
			}
		} else { // If VM not found
			res.render("jesslogin", {jessLoginError: "Login 404"});
		}
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















let {} = app.listen(PORT, () => {
	console.log("Listening on port " + PORT);
});

// Functions

function getIp(req: any) {
    //return req.headers['x-forwarded-for'].split(',').shift()
    //|| req.socket.remoteAddress;
	return req.socket.remoteAddress;
}
