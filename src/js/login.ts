import {qstr}		from "libdx";
import {Keyable}	from "../../classes";

const parsedQ = qstr.parseQ();
qstr.clearQ();

// Use a lookup table instead of directly sending error
// via Qstr to prevent link-sharing vulnerabilities
const loginECs: Keyable<string> = {
	"l-nameNotFound":	"An account by this username was not found.",
	"l-wrongPassword":	"Your password was incorrect. Maybe you forgot it?",
	"r-nameExists":		"Couldn't register, because that name is taken!",
	"r-noPassword":		"You can't register without a password, genius!",
}

// If there's an error code in the Qstr, tell the user why that is
if (parsedQ?.ecode) {
	document.getElementById("ecText")
		.innerText = loginECs[parsedQ.ecode] ?? "What have you done???";
	document.getElementById("ecBox")
		.classList.remove("invisible");
}