// Code for verifying emails of user accounts
"use strict";

import {app}				from "./app";
import db					from "./db";
import {createTransport}	from "nodemailer";
import crypto				from "crypto";

const mailer = createTransport({
	service: "gmail",
	auth: {
		user: "sparkletconductor@gmail.com",
		pass: process.env["EMAIL_PASSWORD"]
	}
});

app.get("/verify-email/:hash", (req, res) => {
	const hash = req.params.hash ?? "";
});

export function sendEmailVLink(user: string) {
	const token = makeNewTokenFor(user);
	const email = db.prepare(`
		SELECT email
		FROM users
		WHERE name = (?)
	`).get(user);
	
	const mailOptions = {
		from:		"sparkletconductor@gmail.com",
		to:			email,
		subject:	"Sparklet Email Verification",
		text:		"Click this link: ////////",
	}
	
	mailer.sendMail(mailOptions, function(err, info){
		if (err) throw err;
		else {
			console.log(
`Sent email to ${email} with response ${info.response}`
			);
		}
	});
}

function makeNewTokenFor(user: string) {
	const token = crypto.randomBytes(128).toString("hex");

	db.prepare(`
		UPDATE users
		SET emailVToken = (?)
		WHERE name = (?)
	`).run(token, user);

	return token;
}