/*
* Loads meta tags from EJS res.locals
*/
"use strict";

namespace loaders {
	export function account() {
		return getMeta("account");
	}

	export function profileInfo() {
		return getMeta("profile-info");
	}
}

// NOT SECURE AGAINST BAD USER INPUT!
// don't let users supply `name`
function getMeta(name: string) {
	const sel = document.querySelector(`meta[name='${name}']`);
	return sel?.getAttribute("content");
}

export default loaders;
