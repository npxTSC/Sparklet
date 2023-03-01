"use strict";

import {qstr}		from "libdx";

// Get query string, then clear it
const parsedQ = qstr.parseQ();
qstr.clearQ();

// Elements
const usernameBox = document.getElementById("usernameBox") as HTMLInputElement;

// Use a lookup table instead of directly sending error
// via Qstr to prevent link-sharing vulnerabilities
const loginECs: Record<string, string> = {
	"l-nameNotFound":	"An account by this username was not found.",
	"l-wrongPassword":	"Your password was incorrect. Maybe you forgot it?",
	"l-specialChars":	"Usernames can not contain special characters.",
	"l-tooLong":		"That name is way too long! (>30 chars)",
	"l-passTooLong":	"That password is way too long! (>100 chars)",
	"r-nameExists":		"Couldn't register, because that name is taken!",
	"l-noInput":		"You can't log in without credentials, genius!",
}

// If there's an error code in the Qstr, tell the user why that is
if (parsedQ?.ecode) {
	document.getElementById("ecText")!
		.innerText = loginECs[parsedQ.ecode] ?? "What have you done???";
	document.getElementById("ecBox")!
		.classList.remove("invisible");
}

usernameBox.focus();
